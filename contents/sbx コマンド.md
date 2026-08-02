---
title: "sbx コマンド"
tags:
  - "コマンド"
created: 2026-08-02T10:40:00+09:00
modified: 2026-08-02T10:40:00+09:00
sirusita: "1"
---

## sbx コマンド

Docker Sandboxes（AIコーディングエージェントを隔離された microVM 内で動かす仕組み）を操作するCLI。サンドボックスごとに独立した Docker デーモン・ファイルシステム・ネットワークが割り当てられ、claude / codex / copilot / gemini などのエージェントを安全に起動できる。

---

## 1. サンドボックスの起動・実行

* **`sbx run <エージェント>`**：カレントディレクトリでエージェント（例: `claude`）を起動した新規サンドボックスを作成
* **`sbx run <エージェント> --branch <ブランチ名>`**：指定ブランチで作業するサンドボックスモードとして起動
* **`sbx run <エージェント> --name <名前>`**：サンドボックスに名前を付けて起動
* **`sbx run <エージェント> --name <既存の名前>`**：既存サンドボックスに再アタッチ（エージェントの一致も検証）
* **`sbx run <エージェント> -- <引数>`**：`--` 以降をエージェント自身への引数として渡す

```bash
# claude をブランチ my-feature 用のサンドボックスとして起動
sbx run claude --branch my-feature

# 既存サンドボックスへ再アタッチ
sbx run claude --name existing-sandbox
```

---

## 2. サンドボックス内でのコマンド実行

* **`sbx exec <サンドボックス名> <コマンド>`**：サンドボックス内でコマンドを実行（停止中なら自動起動）。フラグは `docker exec` に準拠
* **`sbx exec -it <サンドボックス名> bash`**：対話的にシェルを起動
* **`sbx exec -d <サンドボックス名> <コマンド>`**：バックグラウンドで実行
* **`sbx exec -u root <サンドボックス名> <コマンド>`**：root ユーザーとして実行

```bash
# サンドボックスにシェルで入る
sbx exec -it my-sandbox bash

# rootでパッケージ更新
sbx exec -u root my-sandbox apt-get update
```

---

## 3. サンドボックスの一覧・停止・削除

* **`sbx ls`**（`sbx list`）：サンドボックスの一覧と状態（名前・エージェント・状態・ポート・ワークスペース）を表示
* **`sbx stop <サンドボックス名>`**：稼働中のサンドボックスを状態を保持したまま停止（`sbx run` で再開可能）
* **`sbx rm <サンドボックス名>`**：サンドボックスとコンテナ・Git worktree・状態を含めて完全に削除
* **`sbx rm --force <サンドボックス名>`**：確認プロンプトをスキップして削除（SSH接続中など使用中でも強制削除）

```bash
# 稼働状況を確認してから不要なものを一括整理
sbx ls
sbx stop old-sandbox
sbx rm --force old-sandbox
```

---

## 4. ネットワークポリシー（policy）

サンドボックスは既定でネットワークアクセスがホワイトリスト制（default deny）。`sbx policy` でドメイン単位に許可・拒否を管理する。deny ルールは allow より常に優先される。

* **`sbx policy allow network <ドメイン>`**：指定ホストへのアクセスを許可（全サンドボックス対象）
* **`sbx policy allow network "<A>,<B>"`**：カンマ区切りで複数ホストを一括許可
* **`sbx policy allow network "*.example.com"`**：ワイルドカードでサブドメインを一括許可
* **`sbx policy allow network "**"`**：全ホストへのアウトバウンドを許可
* **`sbx policy allow network --sandbox <名前> <ドメイン>`**：特定サンドボックスだけに許可を限定（ローカルスコープ）
* **`sbx policy deny network <ドメイン>`**：指定ホストへのアクセスを拒否
* **`sbx policy ls`**：現在のポリシー一覧を表示（`sbx policy ls <サンドボックス名>` で特定サンドボックスのみ、`--wide` でルール単位の詳細表示）

```bash
# MCPサーバーのサブドメインを許可（apexドメインの許可だけでは不十分な点に注意）
sbx policy allow network mcp.context7.com

# 特定サンドボックスにだけ広告ドメインへのアクセスを拒否
sbx policy deny network --sandbox my-sandbox ads.example.com

# 現在のポリシーをルール単位で確認
sbx policy ls --wide
```

> ポイント: ドメインの許可はサブドメイン単位で厳密にマッチする（ワイルドカードを使わない限り、`example.com` の許可は `api.example.com` をカバーしない）。
