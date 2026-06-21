# devcontainer（Podman 前提・コンテナ内で完結）

Go / Node / Wails のビルドツールチェーンと **Claude Code CLI** を 1 つのイメージに同梱した開発環境です。
Windows 用 exe のクロスビルドまで**コンテナ内で完結**し、ホストの Docker/Podman ソケットや
ネストした daemon には一切依存しません。

- `Containerfile` … イメージ定義（Go 1.23 / Node 22 / Wails v2.12.0 / mingw-w64 / NSIS / Claude Code）
- `devcontainer.json` … devcontainer CLI / VS Code 用設定（Podman 向けに調整済み）

---

## 1. devcontainer CLI で使う（推奨）

```bash
# devcontainer CLI に Podman を使わせる
devcontainer up --docker-path podman --workspace-folder .

# コンテナ内でシェルを開く
devcontainer exec --docker-path podman --workspace-folder . bash
```

> ホストの UID/GID が 1000 以外の場合は、`devcontainer.json` の
> `build.args.USER_UID` / `USER_GID` を `id -u` / `id -g` の値に変更してください。
> `--userns=keep-id` と UID を一致させることでマウントファイルの所有権が揃います。

## 2. 素の Podman で使う

```bash
# イメージをビルド（ホスト UID に合わせる）
podman build \
  --build-arg USER_UID=$(id -u) \
  --build-arg USER_GID=$(id -g) \
  -t sirusita-dev \
  -f .devcontainer/Containerfile .

# リポジトリをマウントして起動
podman run --rm -it \
  --userns=keep-id \
  --security-opt label=disable \
  -v "$PWD":/workspace:rw \
  -w /workspace \
  sirusita-dev bash
```

---

## コンテナ内での開発フロー

```bash
# Claude Code（非 root ユーザーなので skip-permissions が利用可能）
claude --dangerously-skip-permissions

# テスト
go test -v ./...

# Linux ビルド
wails build

# Windows ビルド（出力: build/bin/sirusita.exe）
wails build -platform windows/amd64

# Go API 変更後のバインディング再生成
wails generate module
```

`--userns=keep-id` によりマウントファイルの所有権がホストと揃うため、
従来必要だった生成物への `chown` は不要です。

---

## Claude Code の認証

イメージには鍵を焼き込みません。コンテナ内で以下のいずれかを行ってください。

- 対話ログイン: コンテナ内で `claude` を起動してログイン
- API キー: 起動時に環境変数を渡す
  ```bash
  podman run --rm -it -e ANTHROPIC_API_KEY=sk-ant-... \
    --userns=keep-id --security-opt label=disable \
    -v "$PWD":/workspace:rw -w /workspace sirusita-dev bash
  ```
- 認証情報を再利用する場合はホストの `~/.claude` をマウント:
  `-v "$HOME/.claude":/home/dev/.claude:rw`

> 非 root の `dev` ユーザーで実行するため、`--dangerously-skip-permissions` は
> root 拒否に当たりません。コンテナ自体がサンドボックスとして隔離を担います。
