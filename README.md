# snm-hp — 札幌看護医療専門学校HP 学内検証用レプリカ

> **本リポジトリは本番サイト https://www.snm.ac.jp/ の学内検証・デモ用の静的レプリカです。**
> 公式サイトではありません。全ページに `noindex` を出力し、検索エンジンには載りません。
> 画像・文言等の素材の権利は学校法人に帰属します。

## 構成

- Eleventy 3 + Nunjucks の静的サイト（39ページ）
- デザインは本番踏襲＋スクロール演出強化（GSAP + ScrollTrigger / Swiper / IntersectionObserver）
- `snapshots/` に取得時点の原本スナップショット（親リポジトリ管理・参照用）

## 開発

```bash
pnpm install
npx @11ty/eleventy --serve   # http://localhost:8080/
```

- 実装規約は `CONVENTIONS.md`
- コンテンツ再取得: `node tools/fetch-pages.mjs` → `node tools/extract-content.mjs` → `node tools/fetch-images.mjs`

## デプロイ

`main` への push で GitHub Actions が `PATH_PREFIX=/<repo名>/` を付けてビルドし GitHub Pages へ配信。
