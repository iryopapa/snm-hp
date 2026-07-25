# snm-hp 実装規約（全エージェント必読・違反禁止）

## プロジェクト
札幌看護医療専門学校（www.snm.ac.jp）の静的レプリカ＋演出強化版。Eleventy 3 + Nunjucks。
参照正本: `snapshots/raw/<slug>.html`（原本HTML）と `snapshots/parsed/<slug>.json`（本文構造・画像リスト）。
見た目は原本に忠実、マークアップとCSSはクリーンに書き直す（原本CSSのコピペ移植は禁止）。

## パス規約（最重要）
- テンプレート内の内部リンク・アセット参照は **ルート相対**（`/course/nursing/`、`/asset/img/...`）。ビルド時に pathPrefix が自動付与される
- CSS内 `url()` は **CSSファイルからの相対パスのみ**（`../img/...`）。ルート相対禁止
- JSからのfetch等は `window.SITE_BASE + "asset/..."` を使う
- `<base>` タグ禁止
- 画像パスは原本URLのパスをそのままミラー: `https://www.snm.ac.jp/asset/img/X` → `/asset/img/X`、`/wp-content/uploads/Y` → `/asset/img/uploads/Y`
- 本番のフォーム・記事詳細へのリンクは絶対URL `https://www.snm.ac.jp/...` + `target="_blank" rel="noopener"`

## ファイル所有権
- 共有ファイル（`_layouts/` `_includes/` `_data/` `asset/css/tokens|base|components|motion.css` `asset/js/main.js` `asset/js/motion/*`）は **読み取り専用**。不備を見つけたら修正せず最終レポートで報告
- ページ担当は自セクションの `.njk` と `asset/css/pages/<section>.css`・`asset/js/pages/<section>.js` のみ作成・編集可

## ページの書き方
frontmatter 標準形:
```yaml
---
layout: page.njk
title: 看護学科
description: （原本のmeta description）
breadcrumb: [{label: 学科・専攻, url: /course/}, {label: 看護学科}]
bodyClass: p-course p-course-nursing
pageCss: /asset/css/pages/course.css
pageJs: /asset/js/pages/course.js   # 不要なら省略
permalink: /course/nursing/index.html
---
```
- クラス命名: `l-`(レイアウト) `c-`(共通部品・components.css所有) `p-<section>__`(ページ固有) `u-`(ユーティリティ)。JSフックは class でなく `data-*`
- 既存共通部品を最大限使う: `.c-badge`(+`__label`) `.c-section-head` `.c-frame-card` `.c-num-card[data-tone]` `.c-btn(--accent/--yellow/--arrow/--pill)` `.c-quicklink` `.c-accordion`(details) `.c-tab[data-tabs]` `.c-divider` `.u-marker[data-marker]` `.c-counter` `.u-section`
- 画像は必ず `width`/`height` 属性 + `loading="lazy"`（ファーストビューのMVのみlazy無し）。原寸は `snapshots/parsed/` か実ファイル参照
- YouTube iframe は `loading="lazy"` 付与でそのまま。Instagramは静的画像グリッド化

## モーション規約
- リビールは `data-anim="fade|fade-up|fade-left|zoom"` をHTMLに付けるだけ（動作はmotion.css+reveal.jsが提供済み）。連続要素は親に `data-anim-group` で自動stagger
- 数値実績は `<span class="c-counter" data-counter data-to="100" data-suffix="%">0</span>`
- 蛍光マーカー強調は `<span class="u-marker" data-marker>text</span>`
- 独自アニメは transform/opacity のみ。`prefers-reduced-motion: reduce` で無効化必須。無限ループ・全画面演出は禁止
- Swiper初期化はページJS内で `new Swiper(...)`（グローバル読込済み）。autoplayは `pauseOnMouseEnter:true`、reduced-motion時はautoplay無効

## 検証
- `pnpm build`（ルートで実行）が通ること
- `npx @11ty/eleventy --serve` でローカル確認可能
- コンテンツの文言・数値は必ず `snapshots/` の原本から転記（創作・記憶からの補完は禁止）
