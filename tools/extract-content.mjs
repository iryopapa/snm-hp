// snapshots/raw/ のHTMLをパースして構造・画像URL・アセット一覧を抽出する（ローカル完結）
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://www.snm.ac.jp";

const pages = JSON.parse(await readFile(path.join(ROOT, "tools/page-list.json"), "utf8"));
await mkdir(path.join(ROOT, "snapshots/parsed"), { recursive: true });

const allImages = new Set();
const allAssets = new Set(); // 元CSS/JS（参照用DL対象）

const abs = (u) => {
  if (!u) return null;
  u = u.trim();
  if (u.startsWith("data:") || u.startsWith("#") || u.startsWith("mailto:")) return null;
  try {
    return new URL(u, ORIGIN).href;
  } catch {
    return null;
  }
};

const collectSrcset = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim().split(/\s+/)[0])
    .filter(Boolean);

for (const page of pages) {
  let html;
  try {
    html = await readFile(path.join(ROOT, "snapshots/raw", `${page.slug}.html`), "utf8");
  } catch {
    console.error(`skip ${page.slug}: raw not found`);
    continue;
  }
  const $ = cheerio.load(html);

  const images = new Set();
  $("img[src]").each((_, el) => images.add(abs($(el).attr("src"))));
  $("img[srcset], source[srcset]").each((_, el) =>
    collectSrcset($(el).attr("srcset")).forEach((u) => images.add(abs(u)))
  );
  $("[style]").each((_, el) => {
    for (const m of ($(el).attr("style") || "").matchAll(/url\(["']?([^"')]+)["']?\)/g))
      images.add(abs(m[1]));
  });
  images.delete(null);

  const stylesheets = [];
  $("link[rel=stylesheet][href]").each((_, el) => stylesheets.push(abs($(el).attr("href"))));
  const scripts = [];
  $("script[src]").each((_, el) => scripts.push(abs($(el).attr("src"))));
  stylesheets.filter(Boolean).forEach((u) => allAssets.add(u));
  scripts.filter(Boolean).forEach((u) => u.startsWith(ORIGIN) && allAssets.add(u));

  const iframes = [];
  $("iframe[src]").each((_, el) => iframes.push(abs($(el).attr("src"))));

  const parsed = {
    slug: page.slug,
    path: page.path,
    title: $("title").text(),
    metaDescription: $('meta[name="description"]').attr("content") || "",
    ogImage: $('meta[property="og:image"]').attr("content") || "",
    bodyClass: $("body").attr("class") || "",
    stylesheets,
    scripts,
    iframes,
    images: [...images].sort(),
    // 本文構造の参照用に body 全体を保存（script除去）
    bodyHtml: (() => {
      $("script").remove();
      return $("body").html() || "";
    })(),
  };
  await writeFile(
    path.join(ROOT, "snapshots/parsed", `${page.slug}.json`),
    JSON.stringify(parsed, null, 1)
  );
  images.forEach((u) => allImages.add(u));
  console.log(`ok  ${page.slug}: ${images.size} images`);
}

// 元CSS内の url() 画像も対象に加えるため、CSSは別途DLリストへ
await writeFile(
  path.join(ROOT, "snapshots/parsed/images-manifest.json"),
  JSON.stringify([...allImages].sort(), null, 1)
);
await writeFile(
  path.join(ROOT, "snapshots/parsed/assets-manifest.json"),
  JSON.stringify([...allAssets].sort(), null, 1)
);
console.log(`\ndone: ${allImages.size} unique images, ${allAssets.size} css/js assets`);
