---
title: "JSON"
tags:
  - "シリアライズフォーマット"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## JSON（JavaScript Object Notation）

軽量で言語非依存なデータ交換フォーマット。設定ファイルやWeb APIのやり取りで広く使われる事実上の標準。

---

### 1. 概要と用途

JavaScript由来ながら多くの言語で標準サポートされるテキスト形式。人間にも機械にも読みやすく、APIレスポンスや設定ファイルの定番。値の集まりを「オブジェクト」と「配列」で表現する構造。

```json
{
  "name": "sirusita",
  "version": "1.0.0",
  "enabled": true
}
```

---

### 2. オブジェクトと配列

波括弧 `{}` でキーと値のペア（オブジェクト）、角括弧 `[]` で順序付きの値の並び（配列）を表現。キーは必ずダブルクォートで囲んだ文字列。

```json
{
  "user": { "id": 1, "name": "tako" },
  "tags": ["memo", "markdown", "note"],
  "scores": [80, 95, 72]
}
```

---

### 3. データ型

JSONで扱える値は6種類のみ。日付や関数といった型は存在せず、文字列や数値で代用する仕様。

| 型 | 例 | 説明 |
|----|----|------|
| 文字列 | `"hello"` | ダブルクォートで囲む |
| 数値 | `42`, `3.14`, `-1e3` | 整数・小数・指数表記 |
| 真偽値 | `true`, `false` | 小文字のみ |
| null | `null` | 値が無いことを示す |
| オブジェクト | `{ "k": "v" }` | キーと値の集合 |
| 配列 | `[1, 2, 3]` | 値の並び |

```json
{
  "title": "メモ",
  "count": 3,
  "pi": 3.14159,
  "active": false,
  "deleted_at": null
}
```

---

### 4. ネスト構造

オブジェクトと配列は自由に入れ子にでき、複雑な階層データも表現可能。配列の中にオブジェクト、オブジェクトの中に配列という構成も一般的。

```json
{
  "team": "dev",
  "members": [
    {
      "name": "tako",
      "roles": ["admin", "editor"],
      "profile": { "age": 20, "city": "Tokyo" }
    },
    {
      "name": "ika",
      "roles": ["viewer"],
      "profile": { "age": 25, "city": "Osaka" }
    }
  ]
}
```

---

### 5. エスケープと注意点

文字列内の特殊文字はバックスラッシュでエスケープする必要がある。またJSONはコメント不可・末尾カンマ不可といった厳格な仕様を持つ点に注意。

```json
{
  "path": "C:\\Users\\tako",
  "quote": "彼は\"OK\"と言った",
  "newline": "1行目\n2行目",
  "unicode": "あ",

  "comment": "// この行のようなコメントは書けない",
  "note": "最後の要素の後ろにカンマを付けるとエラー"
}
```

主なエスケープシーケンス。

| 記法 | 意味 |
|------|------|
| `\"` | ダブルクォート |
| `\\` | バックスラッシュ |
| `\n` | 改行 |
| `\t` | タブ |
| `\uXXXX` | Unicodeコードポイント |

---

### 6. JSON Schema による検証

JSONの構造や型のルールを定義し、データの妥当性を機械的に検証する仕様。必須キーや型、値の範囲を宣言できる。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age":  { "type": "integer", "minimum": 0 }
  },
  "required": ["name"]
}
```

---

### 7. jq による整形と抽出

コマンドラインでJSONを整形・フィルタリングする定番ツールが `jq`。可読化や特定フィールドの抽出を1行で完結。

```bash
# 整形（pretty print）
echo '{"name":"tako","age":20}' | jq '.'

# 特定キーの抽出
cat data.json | jq '.user.name'

# 配列から条件抽出
cat users.json | jq '.[] | select(.age > 20)'
```

---

### 8. よくある利用例

設定ファイルやAPIレスポンスとして頻出する形式。キーを定数のように使い、構造化された情報をやり取りする用途。

```json
{
  "api": {
    "endpoint": "https://example.com/v1",
    "timeout": 30,
    "retry": { "max": 3, "interval": 5 }
  },
  "features": ["search", "export", "import"],
  "debug": false
}
```
