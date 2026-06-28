---
title: "CSS"
tags:
  - "Web"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## CSS（Cascading Style Sheets）

HTML要素の見た目を指定するスタイル言語。色・余白・配置・アニメーションなどを宣言し、構造と表現を分離する役割を担う。

---

### 1. セレクタ

スタイルの適用対象を指定する仕組み。要素名・`.class`・`#id` に加え、子孫や状態を表す擬似クラスを組み合わせる。

```css
/* 要素セレクタ */
p { color: navy; }

/* class セレクタ */
.card { padding: 16px; }

/* id セレクタ（一意） */
#header { height: 60px; }

/* 子孫セレクタ・直接の子 */
nav a { text-decoration: none; }
ul > li { list-style: square; }

/* 擬似クラス */
a:hover { color: red; }
li:first-child { font-weight: bold; }
input:focus { outline: 2px solid blue; }
```

---

### 2. ボックスモデル

すべての要素は内容・`padding`（内側余白）・`border`（境界線）・`margin`（外側余白）の入れ子で構成される。`box-sizing: border-box` で枠線込みの幅指定にできる。

```css
.box {
  width: 200px;
  padding: 16px;          /* 内側の余白 */
  border: 2px solid #333; /* 境界線 */
  margin: 8px auto;       /* 外側の余白（左右 auto で中央寄せ） */
  box-sizing: border-box; /* width に padding と border を含める */
}
```

---

### 3. 色と背景

色は名前・`#rrggbb`・`rgb()`／`rgba()`・`hsl()` で指定する。背景は `background-color`・`background-image`・グラデーション関数で表現する。

```css
.sample {
  color: #ff6600;
  background-color: rgb(240 240 240);
  border-color: rgba(0, 0, 0, 0.2); /* 透明度付き */
}

.hero {
  background-image: url("bg.jpg");
  background-size: cover;
  background-position: center;
}

.gradient {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
```

---

### 4. テキストとフォント

文字の見た目を `font-family`・`font-size`・`font-weight`・`line-height` で、配置や装飾を `text-align`・`text-decoration` で制御する。

```css
body {
  font-family: "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #222;
}

h1 {
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05em;
}

a { text-decoration: underline; }
.note { font-style: italic; }
```

---

### 5. 表示と配置

`display` で要素の振る舞いを、`position` で配置基準を決める。`position: relative` を基準に `absolute` を重ねる使い方が定番。

```css
/* display の種類 */
.inline  { display: inline; }       /* 横並び・幅指定不可 */
.block   { display: block; }        /* 縦積み・幅100% */
.hidden  { display: none; }         /* 非表示 */

/* position */
.parent { position: relative; }
.badge {
  position: absolute; /* 親(relative) を基準に配置 */
  top: 0;
  right: 0;
}

.fixed-bar {
  position: fixed;  /* 画面に固定 */
  bottom: 0;
  z-index: 100;
}
```

---

### 6. Flexbox

1次元（横または縦）の柔軟な配置レイアウト。親に `display: flex` を指定し、主軸方向と揃え方を制御する。

```css
.container {
  display: flex;
  flex-direction: row;          /* 主軸: 横方向 */
  justify-content: space-between; /* 主軸の揃え */
  align-items: center;          /* 交差軸の揃え */
  gap: 16px;                    /* 子要素間の隙間 */
  flex-wrap: wrap;              /* 折り返し */
}

.item {
  flex: 1; /* 余白を等分して伸縮 */
}
```

---

### 7. Grid

行と列による2次元レイアウト。`grid-template-columns` で列構成を定義し、`gap` で間隔を空ける。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3等分の列 */
  grid-template-rows: auto;
  gap: 12px;
}

/* 特定セルの占有範囲を指定 */
.featured {
  grid-column: 1 / 3; /* 1〜2列目をまたぐ */
  grid-row: 1;
}
```

---

### 8. レスポンシブ（メディアクエリ）

画面幅などの条件でスタイルを切り替える仕組み。`@media` で区切り、モバイルとデスクトップで異なるレイアウトを適用する。

```css
/* 既定（モバイル優先） */
.layout { grid-template-columns: 1fr; }

/* 画面幅 768px 以上 */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 1fr; }
}

/* 画面幅 1024px 以上 */
@media (min-width: 1024px) {
  .layout { grid-template-columns: repeat(3, 1fr); }
}
```

---

### 9. トランジションとアニメーション

状態変化を滑らかにする `transition` と、キーフレームで動きを定義する `@keyframes`／`animation` の2系統がある。

```css
/* トランジション: hover 時に滑らかに変化 */
.btn {
  background: #3498db;
  transition: background 0.3s ease, transform 0.2s;
}
.btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

/* アニメーション: 連続的な動き */
@keyframes blink {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
}
.alert {
  animation: blink 1s infinite;
}
```

---

### 10. カスタムプロパティ（変数）

`--名前` で値を定義し、`var()` で参照する再利用可能な変数。テーマ色などをまとめて管理できる。

```css
:root {
  --main-color: #2c3e50;
  --accent: #e74c3c;
  --space: 16px;
}

.card {
  color: var(--main-color);
  padding: var(--space);
  border-bottom: 3px solid var(--accent);
}

/* 第2引数はフォールバック値 */
.box { margin: var(--gap, 8px); }
```
