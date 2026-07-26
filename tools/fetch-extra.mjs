// 追加取得: リンクされている news/blog 記事・special・フォーム各種・PDF を一括ミラー
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://www.snm.ac.jp";
const UA = "snm-hp-internal-replica/1.0 (school staff demo)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const NEWS = ["2020/914","2021/2849","2021/5543","2022/5543","2022/6114","2023/2849","2023/914","2023/9888","2023/9891","2024/13820","2025/14270","2025/14279","2025/14409","2025/16084","2025/16587","2026/14409","2026/17673","2026/17933","2026/17946","2026/17955","2026/18022","2026/18039","2026/18306","2026/18308","2026/18407","2026/18432","2026/18525","2026/18893","2026/18904","2026/18962","2026/19029","2026/19084","2026/5543"];
const BLOG = ["2025/15750","2025/15862","2025/15872","2025/15885","2026/18216","2026/18576","2026/18671","2026/18844","2026/18852","2026/18859","2026/18866","2026/18915","2026/18991","2026/19180"];
const FORMS = ["document","event","session","sp_events","briefing","individual","inquiry"];
const PAGES = [
  ...NEWS.map((n) => ({ path: `/news/${n}/`, slug: `news__${n.replace("/", "_")}` })),
  ...BLOG.map((n) => ({ path: `/blog/${n}/`, slug: `blog__${n.replace("/", "_")}` })),
  ...FORMS.map((f) => ({ path: `/form/${f}/`, slug: `form__${f}` })),
  { path: "/special/", slug: "special" },
];
const PDFS = ["admission/application/hairyo.pdf","admission/expenses/r7_yoyaku_leaflet.pdf","admission/share/recommendation.pdf","school/info/abm00017999.pdf","school/info/abm00018004.pdf","school/info/abm00018008.pdf","school/info/abm00018009.pdf","school/info/abm20190701-2.pdf","school/info/abm20190701-3.pdf","school/info/appended-form4-clinicalengineer.pdf","school/info/appended-form4-dentalhygienists.pdf","school/info/appended-form4-nursing.pdf","school/info/appended-form4-orthoptist.pdf","school/info/audit-report.pdf","school/info/board-members.pdf","school/info/business-education.pdf","school/info/business-report.pdf","school/info/confirmation-application.pdf","school/info/evaluation-committee-report.pdf","school/info/financial-statement.pdf","school/info/self-evaluation-table.pdf","school/info/syllabus-clinicalengineer.pdf","school/info/syllabus-dentalhygienists.pdf","school/info/syllabus-nursing.pdf","school/info/syllabus-orthoptist.pdf","visit_company/abm20210317-1.pdf","visit_company/abm20210317-2.pdf","visit_company/abm20210317-3.pdf","visit_company/abm20210317-4.pdf"];

const errors = [];
async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

// 1) ページHTML
for (const p of PAGES) {
  try {
    const res = await get(ORIGIN + p.path);
    await writeFile(path.join(ROOT, "snapshots/raw", `${p.slug}.html`), await res.text());
    console.log("ok  ", p.path);
  } catch (e) { errors.push({ url: p.path, error: String(e) }); console.error("NG  ", p.path, String(e)); }
  await sleep(700);
}

// 2) PDF → src/asset/doc/ ミラー
for (const pdf of PDFS) {
  try {
    const res = await get(`${ORIGIN}/asset/doc/${pdf}`);
    const dest = path.join(ROOT, "src/asset/doc", pdf);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log("pdf ", pdf);
  } catch (e) { errors.push({ url: pdf, error: String(e) }); console.error("NG  ", pdf, String(e)); }
  await sleep(400);
}

// 3) 新規ページ内の画像を収集してミラー（asset/img・wp-content/uploads）
const imgs = new Set();
for (const p of PAGES) {
  let html;
  try { html = await readFile(path.join(ROOT, "snapshots/raw", `${p.slug}.html`), "utf8"); } catch { continue; }
  for (const m of html.matchAll(/(?:src|href)="((?:https:\/\/www\.snm\.ac\.jp)?\/(?:asset\/img|wp-content\/uploads|wp\/wp-content\/uploads)[^"]+\.(?:png|jpe?g|webp|gif|svg))[?"]?/gi))
    imgs.add(m[1].replace(ORIGIN, ""));
}
console.log("images to mirror:", imgs.size);
for (const rel of imgs) {
  const clean = rel.split("?")[0];
  let dest;
  if (clean.startsWith("/asset/")) dest = path.join(ROOT, "src", clean);
  else dest = path.join(ROOT, "src/asset/img/uploads", clean.replace(/^\/(wp\/)?wp-content\/uploads\//, ""));
  try {
    const res = await get(ORIGIN + clean);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  } catch (e) { errors.push({ url: clean, error: String(e) }); }
  await sleep(250);
}

await writeFile(path.join(ROOT, "snapshots/fetch-extra-errors.json"), JSON.stringify(errors, null, 1));
console.log(`done. errors: ${errors.length}`);
