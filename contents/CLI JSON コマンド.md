---
title: "CLI JSON コマンド"
tags:
  - "コマンド"
  - "シリアライズフォーマット"
created: 2026-06-28T10:00:00+09:00
modified: 2026-08-02T10:50:00+09:00
sirusita: "1"
---

## CLI JSON コマンド（jq / jc / jo）

ターミナル上でJSONデータを効率的に加工・生成・変換するための強力な3つのコマンド。

---

### 1. jq

JSONデータのパース、フィルタリング、整形、変換を行う最重要コマンド。複雑なネスト構造からの特定データの抽出や、配列の集計を1行で完結させるツール。

#### 1-1. 基本：整形と値の抽出

* **`jq '.'`**：JSONを見やすくインデント整形（美化）
* **`jq '.key'`**：トップレベルのキーの値を抽出
* **`jq '.a.b.c'`**：ネストしたキーをドットで辿って抽出
* **`jq -r '.key'`**：結果を（ダブルクォート無しの）生の文字列として出力（`raw output`）
* **`jq -c '.'`**：改行・インデント無しの1行（コンパクト）で出力

```bash
# JSONファイルを見やすく整形（美化）
cat data.json | jq '.'

# 特定のキーの値のみを抽出
echo '{"name": "tako", "age": 20}' | jq '.name'

# -rでクォート無しの生文字列として取得（シェル変数への代入に便利）
name=$(echo '{"name": "tako"}' | jq -r '.name')
```

#### 1-2. 配列の操作（[], map, select）

* **`jq '.[]'`**：配列やオブジェクトの各要素を1つずつ取り出す
* **`jq '.[0]'`**：配列の先頭要素のみ取得（`.[-1]` で末尾）
* **`jq 'map(<式>)'`**：配列の各要素に式を適用して新しい配列を作る
* **`jq '.[] | select(<条件>)'`**：条件に一致する要素のみ抽出（フィルタリング）
* **`jq 'length'`**：配列やオブジェクトの要素数を取得

```bash
# 配列内のオブジェクトから特定フィールドを抽出し新しい配列を作成
cat users.json | jq '[.[] | {username: .name}]'

# 20歳以上のユーザーだけを抽出
cat users.json | jq '[.[] | select(.age >= 20)]'

# 各要素のnameだけを取り出した配列に変換
cat users.json | jq 'map(.name)'
```

#### 1-3. 集計・並べ替え（sort_by / group_by / add）

* **`jq 'sort_by(.key)'`**：指定フィールドで昇順ソート（降順は `reverse` を末尾に追加）
* **`jq 'group_by(.key)'`**：指定フィールドの値ごとにグループ化した配列の配列を作成
* **`jq 'add'`**：数値配列の合計、または複数オブジェクトのマージ
* **`jq 'min_by(.key)' / 'max_by(.key)'`**：指定フィールドが最小/最大の要素を取得
* **`jq '[.[].price] | add'`**：全要素のフィールドを取り出してから合計

```bash
# 年齢の降順で並べ替え
cat users.json | jq 'sort_by(.age) | reverse'

# 部署ごとにグループ化して人数をカウント
cat users.json | jq 'group_by(.department) | map({dept: .[0].department, count: length})'

# priceフィールドの合計値を算出
cat orders.json | jq '[.[].price] | add'
```

#### 1-4. キーの操作・整形出力（keys, to_entries, @csv）

* **`jq 'keys'`**：オブジェクトのキー一覧をソート済み配列で取得
* **`jq 'has("key")'`**：指定キーの存在有無を真偽値で判定
* **`jq 'to_entries'`**：オブジェクトを `[{key, value}, ...]` の配列へ変換（`from_entries` で逆変換）
* **`jq '{new_key: .old_key}'`**：キー名を変えて新しいオブジェクトを構築
* **`jq -r '[.name, .age] | @csv'`**：配列をCSVの1行に変換（表計算ソフトへの取り込み用）

```bash
# オブジェクトのキー一覧を確認
echo '{"name":"tako","age":20}' | jq 'keys'

# JSON配列をCSVに変換
cat users.json | jq -r '.[] | [.name, .age] | @csv'
```

#### 1-5. エラー耐性・複数入力（//, ?, -s）

* **`jq '.key // "default"'`**：`null` や存在しないキーの場合にデフォルト値を使う（`//` 演算子）
* **`jq '.key?'`**：型が合わずエラーになる場合に `null` を返して処理を継続（`?` 演算子）
* **`jq -s '.'`**：複数行のJSON（JSON Lines等）を1つの配列にまとめて読み込む（slurp）
* **`jq -n '{a:1,b:2}'`**：標準入力を使わず `jq` 単体でJSONを新規生成（`-n` = null input）

```bash
# キーが存在しない/nullでもデフォルト値にフォールバック
echo '{}' | jq '.name // "unknown"'

# JSON Lines形式（1行1オブジェクト）のログをまとめて配列化して集計
cat access.jsonl | jq -s 'group_by(.status) | map({status: .[0].status, count: length})'
```

---

### 2. jc

標準的なCLIコマンドのプレーンテキスト出力を、自動でJSON形式に構造化する変換ツール。`ifconfig` や `ls`、`ps` などの結果を `jq` で加工可能にする仲介役。

```bash
# pingコマンドの実行結果をJSONに変換
ping -c 1 google.com | jc --ping

# dfコマンドの結果をJSON化し、jqと組み合わせて使用率をフィルタリング
df -h | jc --df | jq '.[] | select(.use_percent > 80)'

# /etc/hostsファイルの内容をJSON構造にパース
cat /etc/hosts | jc --hosts

```

---

### 3. jo

引数に指定したキーと値のペアから、有効なJSONオブジェクトや配列をエスケープ不要で素早く生成するツール。シェルスクリプト内でのAPIリクエスト（curl）のペイロード作成時に活躍するコマンド。

```bash
# フラットなJSONオブジェクトの生成
jo name=tako age=20 active=true
# 出力: {"name":"tako","age":20,"active":true}

# ネストされたオブジェクトの生成（-d でドット区切りを有効化）
jo -d. user.name=tako user.role=admin
# 出力: {"user":{"name":"tako","role":"admin"}}

# 配列（-aオプション）の生成
jo -a 1 2 3 4
# 出力: [1,2,3,4]

```
