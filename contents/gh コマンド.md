---
title: "gh コマンド"
tags:
  - "コマンド"
created: 2026-08-02T10:25:00+09:00
modified: 2026-08-02T10:25:00+09:00
sirusita: "1"
---

## gh コマンド

GitHub 公式 CLI（GitHub CLI）のチートシート。Issue / PR / リポジトリ操作をブラウザを開かずターミナルから完結できる。

---

## 1. 認証・初期設定

* **`gh auth login`**：GitHubアカウントへのログイン（ブラウザ or トークン方式を選択）
* **`gh auth status`**：現在の認証状態を確認
* **`gh auth logout`**：ログアウト
* **`gh auth token`**：現在のセッションのアクセストークンを表示
* **`gh config set <キー> <値>`**：エディタやデフォルトの挙動などの設定変更

```bash
# ログインして状態を確認
gh auth login
gh auth status
```

---

## 2. リポジトリ操作

* **`gh repo clone <owner>/<repo>`**：リポジトリをクローン
* **`gh repo create <名前>`**：新規リポジトリを作成（対話形式で公開範囲などを選択）
* **`gh repo view`**：現在のリポジトリ情報をブラウザ/ターミナルで表示（`--web` でブラウザ）
* **`gh repo fork`**：フォークを作成（`--clone` で同時にクローン）
* **`gh repo list <owner>`**：指定ユーザー/組織のリポジトリ一覧を表示

```bash
# 自分のアカウントにforkしてすぐクローン
gh repo fork owner/repo --clone
```

---

## 3. Issue 操作

* **`gh issue list`**：Issueの一覧を表示（`--state open/closed/all` で絞り込み）
* **`gh issue create`**：新規Issueを対話形式で作成（`--title` / `--body` で直接指定も可）
* **`gh issue view <番号>`**：Issue詳細を表示（`--web` でブラウザ表示）
* **`gh issue close <番号>`**：Issueをクローズ
* **`gh issue comment <番号> --body "<本文>"`**：Issueにコメントを追加

```bash
# タイトルと本文を指定して即座にIssue作成
gh issue create --title "バグ報告" --body "再現手順: ..."
```

---

## 4. Pull Request 操作

* **`gh pr create`**：現在のブランチからPRを作成（対話形式。`--fill` でコミットメッセージから自動入力）
* **`gh pr list`**：PR一覧を表示
* **`gh pr view <番号>`**：PR詳細を表示（`--web` でブラウザ表示）
* **`gh pr checkout <番号>`**：他人のPRのブランチをローカルにチェックアウト
* **`gh pr diff <番号>`**：PRの差分を表示
* **`gh pr merge <番号>`**：PRをマージ（`--squash` / `--rebase` / `--merge` で方式指定）
* **`gh pr review <番号> --approve`**：PRを承認（`--request-changes` / `--comment` も可）

```bash
# 現在のブランチからPRを作成し、そのままマージ
gh pr create --fill
gh pr merge --squash --delete-branch
```

---

## 5. Actions（CI/CD）操作

* **`gh run list`**：GitHub Actionsの実行履歴一覧を表示
* **`gh run view <ID>`**：特定実行の詳細を表示（`--log` でログ全文）
* **`gh run watch`**：実行中のワークフローをリアルタイムで追跡表示
* **`gh workflow list`**：ワークフロー一覧を表示
* **`gh workflow run <ワークフロー名>`**：ワークフローを手動実行（`workflow_dispatch` トリガー）

```bash
# 最新の実行を追跡し、失敗したらログを確認
gh run watch
gh run view --log-failed
```

---

## 6. gh api（GitHub API を直接叩く）

CLI で用意されていない操作も `gh api` 経由で GitHub REST/GraphQL API を直接呼び出せる。認証情報は自動で付与される。

* **`gh api <エンドポイント>`**：REST APIをGETで呼び出し
* **`gh api <エンドポイント> -X POST -f key=value`**：POSTでフィールド付きリクエスト
* **`gh api graphql -f query='<GraphQLクエリ>'`**：GraphQL APIを呼び出し
* **`gh api --paginate <エンドポイント>`**：ページネーションを自動で辿って全件取得

```bash
# 特定PRのレビューコメント一覧をJSONで取得
gh api repos/owner/repo/pulls/123/comments

# ラベルを新規作成
gh api repos/owner/repo/labels -X POST -f name="priority:high" -f color="ff0000"
```
