---
title: "SVG"
tags:
  - "Web"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## SVG（Scalable Vector Graphics）

XMLベースのベクター画像形式。図形を座標と数式で表現するため、拡大しても劣化しない。アイコンやグラフ、図解に広く利用される。

---

### 1. 基本構造

`svg` 要素が描画領域を定義する。`viewBox` で内部座標系、`width`／`height` で表示サイズ、`xmlns` で名前空間を指定する。

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="200"
  height="100"
  viewBox="0 0 200 100"
>
  <!-- viewBox="minX minY 幅 高さ" で座標系を定義 -->
  <rect x="10" y="10" width="180" height="80" fill="#eee" />
</svg>
```

---

### 2. 基本図形（矩形・円・楕円）

`rect` は矩形、`circle` は円、`ellipse` は楕円を描く。座標と半径を属性で指定する。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <!-- 矩形: 左上座標(x,y) と幅・高さ。rx で角丸 -->
  <rect x="10" y="20" width="60" height="60" rx="8" fill="tomato" />

  <!-- 円: 中心(cx,cy) と半径 r -->
  <circle cx="130" cy="50" r="30" fill="steelblue" />

  <!-- 楕円: 中心(cx,cy) と横半径 rx・縦半径 ry -->
  <ellipse cx="240" cy="50" rx="40" ry="25" fill="seagreen" />
</svg>
```

---

### 3. 線と多角形

`line` は直線、`polyline` は連続した折れ線、`polygon` は閉じた多角形を描く。`points` に座標の列を並べる。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <!-- 直線: 始点(x1,y1) と終点(x2,y2) -->
  <line x1="10" y1="10" x2="90" y2="90" stroke="black" stroke-width="2" />

  <!-- 折れ線: 閉じない -->
  <polyline points="110,80 130,20 150,80 170,20" fill="none" stroke="purple" stroke-width="2" />

  <!-- 多角形: 自動的に閉じる（三角形） -->
  <polygon points="240,20 270,80 210,80" fill="gold" stroke="#333" />
</svg>
```

---

### 4. パス

`path` の `d` 属性に描画コマンドを並べ、自由な形状を表現する。最も柔軟な図形要素。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120">
  <!-- M:移動 L:直線 C:3次ベジェ曲線 Z:閉じる -->
  <path
    d="M 20 100 L 60 20 L 100 100 Z"
    fill="none"
    stroke="crimson"
    stroke-width="3"
  />
  <path
    d="M 110 100 C 110 40, 190 40, 190 100"
    fill="none"
    stroke="navy"
    stroke-width="3"
  />
</svg>
```

主な `d` のコマンド一覧。大文字は絶対座標、小文字は相対座標。

| コマンド | 意味 |
|---------|------|
| `M x y` | 描画開始点へ移動（MoveTo） |
| `L x y` | 直線を引く（LineTo） |
| `H x` / `V y` | 水平線 / 垂直線 |
| `C x1 y1 x2 y2 x y` | 3次ベジェ曲線 |
| `Q x1 y1 x y` | 2次ベジェ曲線 |
| `A rx ry ... x y` | 円弧 |
| `Z` | パスを閉じる |

---

### 5. テキスト

`text` 要素で文字を描画する。基準点 `(x, y)` はテキストのベースライン位置。`font-size` や `text-anchor` で見た目を整える。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80" viewBox="0 0 240 80">
  <text
    x="120"
    y="50"
    font-size="32"
    font-family="sans-serif"
    fill="#333"
    text-anchor="middle"
  >
    Sirusita
  </text>
</svg>
```

---

### 6. 塗りと線

`fill` で塗りつぶし色、`stroke` で線の色、`stroke-width` で線の太さを指定する。`fill-opacity`／`stroke-opacity` で透明度、`stroke-dasharray` で破線にできる。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <!-- 塗りなし・太線 -->
  <circle cx="50" cy="50" r="30" fill="none" stroke="orange" stroke-width="6" />

  <!-- 半透明の塗り -->
  <rect x="110" y="20" width="60" height="60" fill="green" fill-opacity="0.4" />

  <!-- 破線 -->
  <line x1="200" y1="50" x2="290" y2="50" stroke="black" stroke-width="3"
        stroke-dasharray="8 4" />
</svg>
```

---

### 7. グループと変形

`g` で複数要素をまとめ、`transform` で平行移動・回転・拡大縮小をまとめて適用する。グループ全体に共通の属性も指定できる。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- グループ全体を移動・回転させる -->
  <g transform="translate(100, 100) rotate(15)" fill="indigo">
    <rect x="-30" y="-30" width="60" height="60" />
    <circle cx="0" cy="0" r="10" fill="white" />
  </g>

  <!-- 拡大縮小 -->
  <g transform="scale(0.5)">
    <rect x="10" y="10" width="40" height="40" fill="teal" />
  </g>
</svg>
```

主な `transform` 関数。

| 関数 | 効果 |
|------|------|
| `translate(x, y)` | 平行移動 |
| `rotate(角度)` | 回転（度） |
| `scale(s)` | 拡大縮小 |
| `skewX(角度)` | 傾斜 |

---

### 8. グラデーション

`defs` 内で `linearGradient`（線形）や `radialGradient`（放射状）を定義し、`id` を `fill="url(#id)"` で参照する。`stop` で色の変化点を指定する。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
  <defs>
    <!-- 線形グラデーション -->
    <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff8a00" />
      <stop offset="100%" stop-color="#e52e71" />
    </linearGradient>

    <!-- 放射状グラデーション -->
    <radialGradient id="grad2">
      <stop offset="0%" stop-color="white" />
      <stop offset="100%" stop-color="steelblue" />
    </radialGradient>
  </defs>

  <rect x="10" y="20" width="120" height="80" fill="url(#grad1)" />
  <circle cx="220" cy="60" r="40" fill="url(#grad2)" />
</svg>
```

---

### 9. アニメーション

`animate` 要素で属性値を時間変化させる。対象属性・開始値・終了値・継続時間を指定し、`repeatCount="indefinite"` で繰り返す。

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
  <circle cx="30" cy="50" r="20" fill="coral">
    <!-- cx を左右に移動 -->
    <animate
      attributeName="cx"
      from="30"
      to="170"
      dur="2s"
      repeatCount="indefinite"
    />
    <!-- 透明度を点滅 -->
    <animate
      attributeName="fill-opacity"
      values="1;0.3;1"
      dur="1s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
```
