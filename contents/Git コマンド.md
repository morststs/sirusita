---
title: "Git コマンド"
tags:
  - "コマンド"
created: 2026-06-15T21:21:06+09:00
modified: 2026-10-12T15:00:00+09:00
sirusita: "1"
---

よく使う Git コマンドの一覧です。A4 横の 1 枚にまとめた版は、サンプル集の「Git コマンド 1画面版」にあります。
`<ブランチ名>` のような `< >` の部分は、実際の値に置き換えます。

## 1. 基本用語

* **作業ツリー**：実際に編集しているファイル
* **ステージングエリア**（ステージ）：次のコミットに含める変更を置いておく場所
* **`HEAD`**：今いるコミット（通常は今のブランチの先端）
* **`HEAD^` / `HEAD~3`**：`HEAD` の 1 つ前 / 3 つ前のコミット
* **`origin`**：clone 元のリモートリポジトリに付く既定の名前

```d2
direction: right
wt: 作業ツリー
idx: ステージ
local: ローカル
remote: リモート
wt -> idx: add
idx -> local: commit
local -> remote: push
remote -> local: fetch
idx -> wt: restore
local -> idx: restore --staged
```

## 2. 初期設定

* **`git config --global user.name <名前>`**：コミットに記録する名前を設定
* **`git config --global user.email <メール>`**：コミットに記録するメールアドレスを設定
* **`git config --global init.defaultBranch main`**：新しく作るリポジトリの既定ブランチ名を `main` にする
* **`git config --global alias.st status`**：コマンドの別名を作成（`git st` で `git status`）
* **`git config --list --show-origin`**：設定の一覧と、それを定義したファイルを表示

## 3. ローカルリポジトリの作成・クローン

* **`git init`**：現在のディレクトリに新規ローカルリポジトリを作成
* **`git clone <URL>`**：リモートリポジトリをローカルに複製
* **`git clone --depth 1 <URL>`**：最新の状態だけを複製（履歴を持たないので速い）

## 4. 変更の記録

* **`git add <ファイル名>`**：指定したファイルをステージングエリアに追加
* **`git add .`**：今いるディレクトリ以下の変更・新規ファイルをまとめて追加
* **`git add -A`**：リポジトリ全体の変更（削除も含む）をまとめて追加
* **`git add -p`**：変更を部分（hunk）ごとに確認しながら追加
* **`git commit -m "<メッセージ>"`**：ステージングされた変更をメッセージ付きで記録（コミット）
* **`git commit -am "<メッセージ>"`**：追跡中のファイルの変更を add してそのままコミット（新規ファイルは含まれない）
* **`git commit --amend --no-edit`**：直前のコミットに今のステージの内容を足す（メッセージはそのまま。push 済みなら使わない）
* **`git mv <旧> <新>`** / **`git rm <ファイル名>`**：ファイルの名前変更 / 削除をステージまで済ませる
* **`git rm --cached <ファイル名>`**：ファイルは残したまま、Git の追跡だけやめる

## 5. 状態・履歴・差分の確認

* **`git status`**：変更されたファイルやステージングの状態を確認
* **`git status -sb`**：状態を 1 ファイル 1 行で短く表示（先頭にブランチと追跡先）
* **`git log`**：コミット履歴の一覧を表示
* **`git log --oneline`**：コミット履歴を 1 行ずつ簡潔に表示
* **`git log --oneline --graph --all`**：全ブランチの履歴をグラフで表示
* **`git log -p <ファイル名>`**：ファイルの変更履歴を差分付きで表示
* **`git log -S "<文字列>"`**：指定した文字列が増えた・減ったコミットを探す
* **`git diff`**：まだステージしていない変更（差分）を確認
* **`git diff --staged`**：ステージ済みの変更を確認
* **`git diff <A>..<B> --stat`**：2 つのコミットの間で変わったファイルの一覧
* **`git show <コミットID>:<ファイル名>`**：過去のコミット時点のファイルの中身を表示
* **`git blame -L 10,20 <ファイル名>`**：10〜20 行目を最後に変更したコミットと人を表示

## 6. ブランチの操作

* **`git branch`**：ブランチの一覧表示（`-a` でリモートも、`-vv` で追跡先も表示）
* **`git branch <ブランチ名>`**：新しいブランチの作成（切り替えはしない）
* **`git switch <ブランチ名>`**（または `git checkout <ブランチ名>`）：指定したブランチへの切り替え
* **`git switch -c <ブランチ名>`**（または `git checkout -b <ブランチ名>`）：新ブランチの作成と切り替えを同時に実行
* **`git branch -m <新しい名前>`**：今のブランチの名前を変更
* **`git branch -d <ブランチ名>`**：統合済みのブランチを削除
* **`git branch -D <ブランチ名>`**：統合していなくても強制的に削除（**注意**）

## 7. マージ・リベース

* **`git merge <ブランチ名>`**：現在のブランチに指定したブランチの変更を取り込み
* **`git merge --no-ff <ブランチ名>`**：早送りできる場合も、必ずマージコミットを作って取り込む
* **`git merge --squash <ブランチ名>`**：変更を 1 つにまとめてステージに取り込む（コミットは自分で行う）
* **`git merge --abort`**：衝突したマージをやめて、マージ前に戻す
* **`git rebase <ブランチ名>`**：今のブランチの付け根を指定したブランチの先端へ付け替え、履歴を一直線にする（コミットは作り直され ID が変わる）
* **`git rebase -i HEAD~3`**：直近 3 件のコミットを並べ替え・まとめ・書き換え
* **`git rebase --continue`** / **`git rebase --abort`**：衝突を解消して続ける / 中止して元に戻す
* **`git cherry-pick <コミットID>`**：ほかのブランチのコミットを 1 件だけ取り込む

```bash
# feature ブランチを main に取り込む（マージコミットを作る）
git switch main
git merge --no-ff feature

# feature ブランチを最新の main の上に載せ直す
git switch feature
git rebase main
```

> push 済みで他の人も使っているブランチは rebase しない（履歴が食い違う）。

## 8. リモートリポジトリとの連携

* **`git remote add origin <URL>`**：ローカルにリモートリポジトリ（origin）を登録
* **`git remote -v`**：登録されているリモートの一覧
* **`git fetch`**：リモートリポジトリの最新情報をローカルに取得（統合はしない）
* **`git fetch --prune`**：取得に加え、リモートで消えたブランチの参照も掃除
* **`git pull`**：リモートリポジトリの最新情報を取得し、現在のブランチに自動マージ
* **`git pull --rebase`**：取得して rebase で統合（マージコミットを作らない）
* **`git push origin <ブランチ名>`**：ローカルのコミットをリモートリポジトリに送信
* **`git push -u origin <ブランチ名>`**：初めて push するとき、追跡先も設定する（以降は `git push` だけでよい）
* **`git push origin --delete <ブランチ名>`**：リモートのブランチを削除
* **`git push --force-with-lease`**：強制 push。他の人の push があれば止まる（**注意**。`--force` より安全）

## 9. 変更の取り消し

* **`git restore <ファイル名>`**：ステージング前のファイルの変更を元に戻す（ステージの内容に戻る）
* **`git restore --staged <ファイル名>`**：ステージから外す（ファイルの変更は残る）
* **`git restore -s <コミットID> <ファイル名>`**：ファイルを過去のコミットの版に戻す
* **`git reset --soft HEAD~1`**：直前のコミットだけ取り消す（変更はステージに残る）
* **`git revert <コミットID>`**：指定したコミットを打ち消す新しいコミットを作る（push 済みならこちら）
* **`git reflog`**：`HEAD` の移動履歴を表示。reset などで消えたコミットも、ここから戻せることが多い
* **`git reset --hard <コミットID>`**：指定したコミット時点まで完全に状態を巻き戻す（**注意**。未コミットの変更は消える）
* **`git clean -fd`**：未追跡のファイル・ディレクトリを削除（**注意**。先に `git clean -nd` で消える対象を確認）

## 10. 一時退避（stash）

* **`git stash`**：作業中の変更を一時的に退避（別ブランチへの切り替え時に重宝。`-u` で未追跡ファイルも）
* **`git stash push -m "<メモ>"`**：メモを付けて退避
* **`git stash list`**：退避の一覧
* **`git stash show -p stash@{0}`**：退避の中身を差分で表示
* **`git stash pop`**：退避していた変更を現在のブランチに復元（一覧からは消える）
* **`git stash apply stash@{1}`**：指定した退避を復元（一覧には残る）
* **`git stash clear`**：退避をすべて削除（**注意**）

## 11. タグ

* **`git tag`**：タグの一覧
* **`git tag -a v1.0.0 -m "<メモ>"`**：注釈付きタグを付ける
* **`git push origin v1.0.0`**：タグを 1 つ送信
* **`git push --tags`**：タグをすべて送信

## 12. git switch（ブランチ切り替え専用コマンド）

`git checkout` はブランチ切り替え・ファイル復元など役割が広く事故りやすいため、ブランチ操作だけに絞った `switch` が用意されている（ファイルの復元は `restore`）。

* **`git switch <ブランチ名>`**：指定したブランチへ切り替え
* **`git switch -c <ブランチ名>`**：新しいブランチを作成して切り替え
* **`git switch -c <ブランチ名> <起点>`**：指定コミット/ブランチを起点に新ブランチを作成して切り替え
* **`git switch -`**：直前にいたブランチへ戻る
* **`git switch --detach <コミットID>`**：特定コミットを指したまま（ブランチに紐付けず）チェックアウト

```bash
# mainから作業用ブランチを作って切り替え
git switch -c feature/login main

# 作業を中断して直前のブランチへ戻る
git switch -
```

## 13. git worktree（複数ブランチの同時作業）

同じリポジトリの別ブランチを、別ディレクトリとして同時にチェックアウトできる機能。`git stash` を挟まずに緊急のバグ修正へ切り替えたい時などに便利。

* **`git worktree add <パス> <ブランチ名>`**：指定ブランチを別ディレクトリとしてチェックアウト
* **`git worktree add -b <新ブランチ名> <パス>`**：新しいブランチを作成しつつ worktree として追加
* **`git worktree list`**：現在のリポジトリに紐づく worktree の一覧を表示
* **`git worktree remove <パス>`**：不要になった worktree を削除
* **`git worktree prune`**：手動でディレクトリごと消してしまった worktree の管理情報を掃除

```bash
# ../hotfix ディレクトリに新規ブランチ hotfix/urgent を作って作業開始
git worktree add -b hotfix/urgent ../hotfix main

# 作業が終わったら一覧確認して削除
git worktree list
git worktree remove ../hotfix
```
