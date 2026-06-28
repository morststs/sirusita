---
title: "CLI JSON コマンド"
tags:
  - "コマンド"
  - "シリアライズフォーマット"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## CLI JSON コマンド（jq / jc / jo）

ターミナル上でJSONデータを効率的に加工・生成・変換するための強力な3つのコマンド。

---

### 1. jq

JSONデータのパース、フィルタリング、整形、変換を行う最重要コマンド。複雑なネスト構造からの特定データの抽出や、配列の集計を1行で完結させるツール。

```bash
# JSONファイルを見やすく整形（美化）
cat data.json | jq '.'

# 特定のキーの値のみを抽出
echo '{"name": "tako", "age": 20}' | jq '.name'

# 配列内のオブジェクトから特定フィールドを抽出し新しい配列を作成
cat users.json | jq '[.[] | {username: .name}]'

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
