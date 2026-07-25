// snm.ac.jp の対象ページHTMLを snapshots/raw/ へ取得する（1req/秒スロットル）
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://www.snm.ac.jp";
const UA = "snm-hp-internal-replica/1.0 (school staff demo; contact: iryopapa.jp@gmail.com)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pages = JSON.parse(await readFile(path.join(ROOT, "tools/page-list.json"), "utf8"));
await mkdir(path.join(ROOT, "snapshots/raw"), { recursive: true });
await mkdir(path.join(ROOT, "src/asset/data"), { recursive: true });

const errors = [];
for (const page of pages) {
  const url = ORIGIN + page.path;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    await writeFile(path.join(ROOT, "snapshots/raw", `${page.slug}.html`), html);
    console.log(`ok  ${page.path} (${(html.length / 1024).toFixed(0)}KB)`);
  } catch (e) {
    errors.push({ url, error: String(e) });
    console.error(`NG  ${page.path}: ${e}`);
  }
  await sleep(1000);
}

// OCカレンダーのデータ源（純JSON）
try {
  const res = await fetch(ORIGIN + "/json-calendar/", { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  JSON.parse(text); // 妥当性確認
  await writeFile(path.join(ROOT, "src/asset/data/oc-calendar.json"), text);
  console.log("ok  /json-calendar/");
} catch (e) {
  errors.push({ url: ORIGIN + "/json-calendar/", error: String(e) });
  console.error(`NG  /json-calendar/: ${e}`);
}

await writeFile(path.join(ROOT, "snapshots/fetch-page-errors.json"), JSON.stringify(errors, null, 2));
console.log(`\ndone: ${pages.length} pages, ${errors.length} errors`);
