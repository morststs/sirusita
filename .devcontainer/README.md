# devcontainer（Docker 前提・コンテナ内で完結）

Go / Node / Wails のビルドツールチェーンと **Claude Code CLI** を 1 つのイメージに同梱した開発環境です。
Windows 用 exe のクロスビルドまで**コンテナ内で完結**し、ホストの Docker ソケットの共有や
ネストした daemon（docker-out-of-docker / dind）には一切依存しません。

- `Dockerfile` … イメージ定義（Go 1.23 / Node 22 / Wails v2.12.0 / mingw-w64 / NSIS / Claude Code）
- `devcontainer.json` … devcontainer CLI / VS Code 用設定

---

## 1. VS Code / devcontainer CLI で使う（推奨）

VS Code の「Dev Containers: Reopen in Container」で開くか、devcontainer CLI を使います。

```bash
devcontainer up --workspace-folder .

# コンテナ内でシェルを開く
devcontainer exec --workspace-folder . bash
```

> Linux ホストでは `updateRemoteUserUID: true` により、コンテナ内 `dev` ユーザーの
> UID/GID がホストユーザーに自動で合わせられ、マウントファイルの所有権が揃います。
> （Docker Desktop の macOS / Windows では所有権の問題は起きません。）

## 2. 素の Docker で使う

```bash
# イメージをビルド（ホスト UID に合わせる）
docker build \
  --build-arg USER_UID=$(id -u) \
  --build-arg USER_GID=$(id -g) \
  -t sirusita-dev \
  -f .devcontainer/Dockerfile .

# リポジトリをマウントして起動
docker run --rm -it \
  -v "$PWD":/workspace \
  -w /workspace \
  sirusita-dev bash
```

> SELinux が有効なホスト（Fedora / RHEL 等）では、マウント指定を
> `-v "$PWD":/workspace:Z` にしてください。

---

## コンテナ内での開発フロー

```bash
# Claude Code（非 root ユーザーなので skip-permissions が利用可能）
claude --dangerously-skip-permissions

# テスト
go test -v ./...
node --test frontend/src/tagTree.test.js

# Linux ビルド
wails build

# Windows ビルド（出力: build/bin/sirusita.exe）
wails build -platform windows/amd64

# Go API 変更後のバインディング再生成
wails generate module
```

ビルド時の `USER_UID` / `USER_GID` をホストに合わせているため、
生成物への `chown` は不要です。

---

## Claude Code の認証

イメージには鍵を焼き込みません。コンテナ内で以下のいずれかを行ってください。

- 対話ログイン: コンテナ内で `claude` を起動してログイン
- API キー: 起動時に環境変数を渡す
  ```bash
  docker run --rm -it -e ANTHROPIC_API_KEY=sk-ant-... \
    -v "$PWD":/workspace -w /workspace sirusita-dev bash
  ```
- 認証情報を再利用する場合はホストの `~/.claude` をマウント:
  `-v "$HOME/.claude":/home/dev/.claude`

> 非 root の `dev` ユーザーで実行するため、`--dangerously-skip-permissions` は
> root 拒否に当たりません。コンテナ自体がサンドボックスとして隔離を担います。
