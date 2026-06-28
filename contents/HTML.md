---
title: "HTML"
tags:
  - "Web"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## HTML（HyperText Markup Language）

Webページの構造を記述するためのマークアップ言語。タグで要素を囲み、見出し・段落・リンク・画像などの意味づけを行う基盤技術。

---

### 1. 基本構造

`DOCTYPE` 宣言から始まり、`html` 要素の中に `head`（メタ情報）と `body`（表示内容）を持つ構成。`lang` 属性で言語、`charset` で文字コードを指定する。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ページタイトル</title>
  </head>
  <body>
    <h1>こんにちは</h1>
    <p>ここが本文。</p>
  </body>
</html>
```

---

### 2. 見出しと段落

見出しは `h1`〜`h6` の6段階で、数字が小さいほど上位の階層。段落は `p`、改行は `br`、水平線は `hr` を用いる。

```html
<h1>大見出し</h1>
<h2>中見出し</h2>
<h3>小見出し</h3>

<p>段落の文章。<br />ここで改行する。</p>
<hr />
<p><strong>強調</strong>や<em>斜体</em>、<code>コード</code>のインライン要素。</p>
```

---

### 3. リスト・リンク・画像

順序なしリストは `ul`、順序付きリストは `ol`、各項目は `li`。リンクは `a` の `href`、画像は `img` の `src` と代替テキスト `alt` を指定する。

```html
<!-- 順序なしリスト -->
<ul>
  <li>りんご</li>
  <li>みかん</li>
</ul>

<!-- 順序付きリスト -->
<ol>
  <li>準備する</li>
  <li>実行する</li>
</ol>

<!-- リンクと画像 -->
<a href="https://example.com" target="_blank" rel="noopener">外部リンク</a>
<img src="photo.png" alt="風景写真" width="320" />
```

---

### 4. セマンティック要素

意味を持つ構造化タグ。`header`（ヘッダ）・`nav`（ナビ）・`main`（主要内容）・`section`（区分）・`article`（独立記事）・`aside`（補足）・`footer`（フッタ）で文書構造を明確にする。

```html
<body>
  <header><h1>サイト名</h1></header>
  <nav>
    <a href="/">ホーム</a>
    <a href="/about">概要</a>
  </nav>
  <main>
    <article>
      <section>
        <h2>記事の見出し</h2>
        <p>本文。</p>
      </section>
    </article>
    <aside>関連情報</aside>
  </main>
  <footer><small>&copy; 2026 example</small></footer>
</body>
```

---

### 5. フォーム

入力を受け付ける `form` の中に、`input`・`textarea`・`select`・`button` を配置する。`label` の `for` を入力の `id` に対応させて関連付ける。

```html
<form action="/submit" method="post">
  <label for="name">名前</label>
  <input type="text" id="name" name="name" placeholder="氏名" required />

  <label for="mail">メール</label>
  <input type="email" id="mail" name="mail" />

  <label for="pref">都道府県</label>
  <select id="pref" name="pref">
    <option value="tokyo">東京</option>
    <option value="osaka">大阪</option>
  </select>

  <label><input type="checkbox" name="agree" /> 同意する</label>
  <textarea name="memo" rows="3"></textarea>
  <button type="submit">送信</button>
</form>
```

主な `input` の `type` 一覧。

| type | 用途 |
|------|------|
| `text` | 1行テキスト |
| `password` | パスワード（伏字） |
| `email` | メールアドレス |
| `number` | 数値 |
| `date` | 日付 |
| `radio` | ラジオボタン |
| `checkbox` | チェックボックス |
| `file` | ファイル選択 |

---

### 6. 表

表は `table` を親に、行を `tr`、見出しセルを `th`、データセルを `td` で構成する。`thead`／`tbody` で本体を区分し、`colspan`／`rowspan` でセルを結合する。

```html
<table>
  <thead>
    <tr>
      <th>商品</th>
      <th>価格</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>りんご</td>
      <td>120円</td>
    </tr>
    <tr>
      <td colspan="2">合計</td>
    </tr>
  </tbody>
</table>
```

---

### 7. 属性

要素に付加する設定値。`id`（一意識別子）・`class`（分類）・`style`（インラインCSS）・`data-*`（カスタムデータ）・`title`（補足）など、`属性名="値"` の形で記述する。

```html
<div id="main" class="card highlight" data-user-id="42" title="補足説明">
  内容
</div>

<!-- alt は画像の代替テキスト（アクセシビリティ・読み込み失敗時に表示） -->
<img src="icon.svg" alt="設定アイコン" />

<!-- 真偽属性は値なしで有効 -->
<input type="text" disabled readonly />
```

---

### 8. メタ情報と外部リソース

`head` 内で文書情報や外部ファイルを読み込む。`meta` で説明やビューポート、`link` でCSSやファビコン、`script` でJavaScriptを読み込む。

```html
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="ページの説明文" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- 外部スタイルシート・ファビコン -->
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="favicon.ico" />

  <!-- JavaScript（defer で本文解析後に実行） -->
  <script src="app.js" defer></script>
</head>
```
