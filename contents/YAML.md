---
title: "YAML"
tags:
  - "シリアライズフォーマット"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## YAML（YAML Ain't Markup Language）

インデントで階層を表現する、人間に読みやすいデータ記述フォーマット。設定ファイルやCI定義で広く使われる形式。

---

### 1. 概要と用途

括弧やカンマを使わずインデントだけで構造を表すのが特徴。Kubernetes、GitHub Actions、各種アプリの設定ファイルで定番。JSONのスーパーセットであり、より簡潔に書ける。

```yaml
name: sirusita
version: 1.0.0
enabled: true
```

---

### 2. マッピング（キー: 値）

`キー: 値` の形でキーと値のペアを記述。コロンの後ろには必ず半角スペースが必要。同じインデントのキーが同一階層のオブジェクトを構成。

```yaml
title: メモのタイトル
author: tako
published: true
```

---

### 3. インデントによる階層

ネスト構造はインデント（半角スペース）で表現。タブは使用禁止で、字下げの深さが階層の深さを示す。

```yaml
user:
  name: tako
  profile:
    age: 20
    city: Tokyo
```

---

### 4. シーケンス（- 要素）

ハイフン `-` とスペースで配列（リスト）を記述。要素にオブジェクトを並べることも可能。

```yaml
# 文字列のリスト
tags:
  - memo
  - markdown
  - note

# オブジェクトのリスト
members:
  - name: tako
    role: admin
  - name: ika
    role: viewer
```

---

### 5. スカラー型

文字列・数値・真偽値・null を表現可能。文字列は基本クォート不要だが、特殊文字を含む場合はクォートで囲む。

| 型 | 例 |
|----|----|
| 文字列 | `hello`, `"特殊: 値"` |
| 整数 | `42` |
| 浮動小数 | `3.14` |
| 真偽値 | `true`, `false`, `yes`, `no` |
| null | `null`, `~` |

```yaml
name: tako          # クォート不要の文字列
message: "key: val" # コロンを含むのでクォート必須
count: 42
ratio: 3.14
active: true
deleted: null
```

---

### 6. 複数行文字列（| と >）

`|` はリテラルブロックで改行を保持、`>` は折りたたみブロックで改行を半角スペースに変換。長文や本文の記述に便利。

```yaml
# リテラル（改行をそのまま保持）
description: |
  1行目
  2行目
  3行目

# 折りたたみ（改行はスペースに変換され1行になる）
summary: >
  この文章は
  最終的に
  1行につながる
```

---

### 7. アンカーとエイリアス（& / *）

`&` でアンカー（定義）、`*` でエイリアス（参照）を作り、同じ値を使い回す仕組み。`<<` でマップのマージも可能。重複記述の削減に有効。

```yaml
defaults: &defaults
  timeout: 30
  retry: 3

production:
  <<: *defaults     # defaults の内容を継承
  host: prod.example.com

staging:
  <<: *defaults
  host: stg.example.com
```

---

### 8. ドキュメント区切りとコメント・注意点

`---` で複数ドキュメントを1ファイルに区切り、`...` で終端を示す。`#` 以降はコメント。インデントは必ずスペースで、タブは厳禁である点に注意。

```yaml
# 1つ目のドキュメント
---
env: dev
debug: true
# 2つ目のドキュメント
---
env: prod
debug: false
...
```
