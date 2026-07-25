// images-manifest / assets-manifest を元に画像・CSS/JSを一括DLしてローカルへミラーする
// 保存規則: /asset/X → src/asset/X ／ /wp-content/uploads/Y → src/asset/img/uploads/Y
//           元CSS/JS → snapshots/original-assets/（参照用・配信しない）
// 元CSS内の url() 画像は再帰的に収集して同規則でミラー
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://www.snm.ac.jp";
const UA = "snm-hp-internal-replica/1.0 (school staff demo; contact: iryopapa.jp@gmail.com)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const localPathFor = (url) => {
  const u = new URL(url);
  if (u.origin !== ORIGIN) return null; // 外部（YouTube等）はDLしない
  const p = decodeURIComponent(u.pathname);
  if (p.startsWith("/asset/")) return path.join(ROOT, "src", p);
  if (p.startsWith("/wp-content/uploads/"))
    return path.join(ROOT, "src/asset/img/uploads", p.slice("/wp-content/uploads/".length));
  return path.join(ROOT, "src/asset/img/misc", p.replace(/^\//, ""));
};

const errors = [];
let okCount = 0;
async function download(url, dest) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    okCount++;
    return buf;
  } catch (e) {
    errors.push({ url, error: String(e) });
    console.error(`NG  ${url}: ${e}`);
    return null;
  }
}

// 1) HTML由来の画像
const images = new Set(
  JSON.parse(await readFile(path.join(ROOT, "snapshots/parsed/images-manifest.json"), "utf8"))
);

// 2) 元CSS/JSをDLし、CSS内 url() から追加画像を収集
const assets = JSON.parse(
  await readFile(path.join(ROOT, "snapshots/parsed/assets-manifest.json"), "utf8")
);
for (const url of assets) {
  const u = new URL(url);
  if (u.origin !== ORIGIN) continue;
  const dest = path.join(ROOT, "snapshots/original-assets", u.pathname.replace(/^\//, ""));
  const buf = await download(url, dest);
  if (buf && u.pathname.endsWith(".css")) {
    for (const m of buf.toString("utf8").matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const ref = m[1].trim();
      if (ref.startsWith("data:")) continue;
      try {
        const resolved = new URL(ref.split("?")[0], url).href;
        if (/\.(png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot)$/i.test(resolved))
          images.add(resolved);
      } catch {}
    }
  }
  await sleep(200);
}

// 3) 画像を4並列・200ms間隔でDL
const queue = [...images].map((u) => u.split("#")[0]);
const seen = new Set();
const workers = Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const dest = localPathFor(url);
    if (!dest) continue;
    await download(url.split("?")[0], dest);
    await sleep(200);
  }
});
await Promise.all(workers);

await writeFile(path.join(ROOT, "snapshots/fetch-errors.json"), JSON.stringify(errors, null, 2));
console.log(`\ndone: ${okCount} downloaded, ${errors.length} errors`);
