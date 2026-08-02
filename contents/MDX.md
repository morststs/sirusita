---
title: "MDX"
tags:
  - "Markdown"
created: 2026-08-02T10:45:00+09:00
modified: 2026-08-02T10:45:00+09:00
sirusita: "1"
---

## MDX

Markdown の中に JSX（React コンポーネント）を直接埋め込める拡張フォーマット。Docusaurus・Next.js・Gatsby などのドキュメントサイト生成でよく使われる。通常の Markdown はそのまま動くため、既存の記法に「コンポーネントを混ぜられる」点が追加された上位互換と考えてよい。

---

### 1. 基本：Markdown の中にJSXを混ぜる

見出しや段落は通常の Markdown のまま書きつつ、任意の位置に React コンポーネントのタグを直接記述できる。

```mdx
# タイトル

これは普通のMarkdownの段落です。

<Alert type="warning">
  これはJSXコンポーネントです。Markdownの直後に書けます。
</Alert>

続きの段落もMarkdownのまま書けます。
```

---

### 2. コンポーネントのインポート

通常の JavaScript / TypeScript と同様に、ファイル冒頭で `import` して使うコンポーネントを読み込む。

```mdx
import { Chart } from './Chart'
import Alert from '../components/Alert'

# 売上レポート

<Chart data={salesData} />

<Alert type="info">グラフはリアルタイムで更新されます。</Alert>
```

---

### 3. JSX式の埋め込み（{ }）

波括弧 `{ }` の中に任意の JavaScript 式を書くと、その場に評価結果が展開される。変数の埋め込みや条件分岐、値の計算などに使う。

```mdx
export const price = 1980

このプランの料金は {price} 円です。

{price > 1000 ? "有料プランです" : "無料プランです"}

<ul>
  {["Vue", "React", "Svelte"].map(name => <li key={name}>{name}</li>)}
</ul>
```

---

### 4. frontmatter とエクスポート（メタデータ・値の共有）

ファイル冒頭の YAML frontmatter でメタデータを、`export` で変数や関数を定義できる。多くの静的サイトジェネレーターは frontmatter をページのタイトルやレイアウト指定に利用する。

```mdx
---
title: "料金プラン"
description: "各プランの詳細比較"
---

export const plans = [
  { name: "Free", price: 0 },
  { name: "Pro", price: 1980 },
]

# {plans.find(p => p.name === "Pro").name} プラン

月額 {plans.find(p => p.name === "Pro").price} 円で利用できます。
```

---

### 5. コードブロックはそのまま動く

MDX でも通常の Markdown のコードフェンス（```` ``` ````）はシンタックスハイライト付きのコードブロックとしてそのまま表示され、JSXとして評価されることはない。

````mdx
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`)
}
```
````

---

### 6. 通常のMarkdownとの主な違い

| 項目 | Markdown | MDX |
| --- | --- | --- |
| 拡張子 | `.md` | `.mdx` |
| HTMLタグ | 一部のみ許容される場合が多い | JSXコンポーネントとして完全に評価される |
| 変数・式 | 使えない | `{ }` で埋め込み可能 |
| import/export | 使えない | JS同様に使用可能 |
| レンダリング環境 | 静的HTML変換のみで完結 | JavaScriptビルドツール（bundler）が必要 |

> 注意: MDX は静的な Markdown パーサーだけでは処理できず、React とビルドツール（webpack/Vite 等）を介したコンパイルが必要になる。このアプリ（Sirusita）のプレビューは `marked` によるプレーンな Markdown レンダリングのため、MDX 特有の JSX 部分は評価されずコードやテキストとしてそのまま表示される点に注意。
