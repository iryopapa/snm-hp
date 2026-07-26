// src/**/*.njk 内の https://www.snm.ac.jp リンクのうち、レプリカ内に実体が存在するものを
// ルート相対へ張り替える（data-keep-external 付きアンカーは除外）
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://www.snm.ac.jp";

// 内部実体があるか（njkソース基準で判定）
function internalPathFor(urlPath, query) {
  const p = urlPath.replace(/\/+$/, "");
  if (p === "/inquiry") return existsSync(path.join(ROOT, "src/form/inquiry.njk")) ? "/form/inquiry/" : null;
  if (p.startsWith("/asset/doc/")) {
    return existsSync(path.join(ROOT, "src", p)) ? p : null;
  }
  const candidates = [
    path.join(ROOT, "src", p + ".njk"),
    path.join(ROOT, "src", p, "index.njk"),
    p === "" ? path.join(ROOT, "src/index.njk") : null,
  ].filter(Boolean);
  if (candidates.some((c) => existsSync(c))) {
    return (p === "" ? "/" : p + "/") + (query || "");
  }
  return null;
}

let totalFiles = 0, totalRewrites = 0;
const unresolved = new Map();

for await (const entry of glob("src/**/*.njk", { cwd: ROOT })) {
  const file = path.join(ROOT, entry);
  const before = await readFile(file, "utf8");
  let rewrites = 0;
  const after = before
    .split("\n")
    .map((line) => {
      if (line.includes("data-keep-external")) return line;
      return line.replace(
        /<a([^>]*?)href="https:\/\/www\.snm\.ac\.jp([^"?#]*)(\?[^"#]*)?(#[^"]*)?"([^>]*)>/g,
        (m, pre, urlPath, query, hash, post) => {
          const internal = internalPathFor(urlPath, query ? decodeURIComponent(query) : "");
          if (!internal) {
            const key = urlPath + (query || "");
            unresolved.set(key, (unresolved.get(key) || 0) + 1);
            return m;
          }
          rewrites++;
          const strip = (s) => s.replace(/\s*target="_blank"/g, "").replace(/\s*rel="noopener(?: noreferrer)?"/g, "");
          return `<a${strip(pre)}href="${internal}${hash || ""}"${strip(post)}>`;
        }
      );
    })
    .join("\n");
  if (after !== before) {
    await writeFile(file, after);
    totalFiles++;
    totalRewrites += rewrites;
  }
}

console.log(`rewrote ${totalRewrites} links in ${totalFiles} files`);
console.log("still external (no local page):");
[...unresolved.entries()].sort((a, b) => b[1] - a[1]).forEach(([u, n]) => console.log(`  ${n}\t${u}`));
