---
title: "TOML"
tags:
  - "シリアライズフォーマット"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## TOML（Tom's Obvious, Minimal Language）

明快さを重視した設定ファイル向けのフォーマット。`Cargo.toml` や `pyproject.toml` で採用される、曖昧さの少ない記述形式。

---

### 1. 概要と用途

INIファイルに似た見た目で、明確なデータ型とテーブル構造を持つ設定言語。RustのCargo、Pythonのpyproject、各種ツールの設定ファイルで定番。読み書きが直感的で、ハッシュテーブルへ素直に対応する設計。

```toml
title = "sirusita"
version = "1.0.0"
enabled = true
```

---

### 2. キーと値

`キー = 値` の形でトップレベルに記述。文字列はダブルクォートで囲む。1行に1ペアが基本。

```toml
name = "tako"
age = 20
active = true
```

---

### 3. データ型

文字列・整数・浮動小数・真偽値に加え、日時（Date-Time）をネイティブにサポートするのが特徴。

| 型 | 例 |
|----|----|
| 文字列 | `"hello"`, `'リテラル'` |
| 整数 | `42`, `-17`, `1_000` |
| 浮動小数 | `3.14`, `5e22` |
| 真偽値 | `true`, `false` |
| 日時 | `2026-06-28T10:00:00+09:00` |
| ローカル日付 | `2026-06-28` |

```toml
title = "メモ"
count = 1_000
ratio = 3.14
active = false
created = 2026-06-28T10:00:00+09:00
date = 2026-06-28
```

---

### 4. テーブル `[table]`

`[テーブル名]` で名前付きのセクション（テーブル）を定義。それ以降のキーはそのテーブルに属する。JSONのオブジェクトに相当。

```toml
[server]
host = "localhost"
port = 8080

[database]
url = "postgres://localhost/db"
max_connections = 20
```

---

### 5. ネストしたテーブル `[a.b]`

ドット区切りで入れ子のテーブルを表現。階層構造を平坦な記法で記述できる。

```toml
[servers]
count = 2

[servers.alpha]
ip = "10.0.0.1"
role = "frontend"

[servers.beta]
ip = "10.0.0.2"
role = "backend"
```

---

### 6. テーブルの配列 `[[array]]`

二重角括弧 `[[名前]]` を繰り返すことで、同じ構造のテーブルを配列として並べる。オブジェクトのリストに相当。

```toml
[[products]]
name = "りんご"
price = 100

[[products]]
name = "みかん"
price = 80

[[products]]
name = "ぶどう"
price = 300
```

---

### 7. インラインテーブルと配列

短い構造は `{}` のインラインテーブルで1行に記述可能。配列は `[]` で表現し、改行をまたいでもよい。

```toml
# インラインテーブル
point = { x = 1, y = 2 }
owner = { name = "tako", role = "admin" }

# 配列
tags = ["memo", "markdown", "note"]
ports = [8000, 8001, 8002]
matrix = [
  [1, 2],
  [3, 4],
]
```

---

### 8. コメントとYAML/JSONとの比較

`#` 以降がコメント。設定ファイルとしての可読性と型の明確さが強み。インデント依存のYAML、コメント不可のJSONとは対照的な特徴を持つ。

```toml
# これはコメント
name = "sirusita"  # 行末コメントも可能
```

| 観点 | TOML | YAML | JSON |
|------|------|------|------|
| 構造の表現 | テーブル `[ ]` | インデント | 括弧 `{} []` |
| コメント | 可（`#`） | 可（`#`） | 不可 |
| 日時型 | ネイティブ対応 | 文字列扱いが基本 | 文字列扱い |
| 主な用途 | 設定ファイル | 設定・CI | データ交換・API |
