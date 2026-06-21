# CLAUDE.md — Sirusita メモアプリ

## プロジェクト概要

Wails v2 + Svelte 5 で構築されたマークダウンベースのメモアプリ（アプリ名: Sirusita）。
メモは `~/.sirusita/notes/{UUID}.md` に YAML front matter 付きで保存される。

## 技術スタック

- **バックエンド:** Go 1.23 + Wails v2.12
- **フロントエンド:** Svelte 5（runes）+ Vite 7
- **UIフレームワーク:** Flowbite Svelte 1.x + TailwindCSS 4（`@tailwindcss/vite`）
- **Go依存:** `github.com/adrg/frontmatter`, `github.com/google/uuid`
- **JS依存:** `marked`, `dompurify`, `flowbite-svelte`, `flowbite-svelte-icons`

## 開発環境

### Podman 必須（コンテナ内で完結）

ホストに Go/Node/Wails はインストールしない。全てのビルド・テストは Podman コンテナ内で実行する。
Windows 用 exe のクロスビルドまでコンテナ内で完結し、ホストの Docker/Podman ソケットや
ネストした daemon には依存しない。

コンテナ定義は 2 つある:

- **ルート `Dockerfile`** … 最小構成のビルド用イメージ（下記コマンドが使う `wails-dev`）。
- **`.devcontainer/`** … Podman 前提の devcontainer。Claude Code CLI 同梱・非 root の `dev`
  ユーザー・`--userns=keep-id` で所有権ズレ（chown）を解消。詳細は
  `.devcontainer/README.md` を参照。VS Code / devcontainer CLI を使う場合はこちらが推奨。

```bash
# Podman イメージのビルド（初回 or Dockerfile 変更時）
podman build -t wails-dev .

# Go コマンド実行
podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test -v ./...

# Wails ビルド（Linux）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build

# Wails ビルド（Windows）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build -platform windows/amd64

# フロントエンド npm コマンド
podman run --rm -v "$PWD":/app:Z -w /app/frontend wails-dev npm install <package>
```

> `:Z` は SELinux 環境でのマウントラベル付け。不要な環境では外してよい。
> rootless Podman ではホストとコンテナの UID が揃うため、従来 Docker で必要だった
> 生成物への `chown` は基本的に不要（`.devcontainer` は `--userns=keep-id` で対応）。

> 補足: Podman をさらに別コンテナの**内側**で動かす（podman-in-container）特殊な状況では、
> 次の回避が必要になることがある（通常のホスト環境では不要）:
> `unqualified-search-registries = ["docker.io"]` を `registries.conf` に追加 /
> `--network=host` / ビルド時の `--isolation=chroot`（read-only cgroup 回避）。

### イメージ内容 (wails-dev / .devcontainer)

- Go 1.23, Node.js 22 LTS（NodeSource）, Wails CLI v2.12.0
- libgtk-3-dev, libwebkit2gtk-4.0/4.1-dev（Linux ビルド用）
- gcc-mingw-w64-x86-64, nsis（Windows クロスコンパイル用）
- `.devcontainer` はさらに `@anthropic-ai/claude-code` と非 root ユーザーを同梱

> 注意: Svelte 5 / Vite 7 系は Node 20.19+ / 22.12+ を要求するため、イメージは Node 22 を使用。

## プロジェクト構成

```
sirusita/
├── main.go                  # Wails エントリポイント、NoteService 初期化
├── app.go                   # App 構造体（ライフサイクル + Import/Export/OpenURL）
├── note_service.go          # メモ CRUD ロジック
├── Dockerfile               # ビルド用イメージ（Podman でビルド）
├── wails.json               # Wails 設定（outputfilename: sirusita）
├── .devcontainer/           # Podman 前提の devcontainer（Claude Code 同梱）
│   ├── Containerfile
│   ├── devcontainer.json
│   └── README.md
├── .github/workflows/
│   └── release.yml          # v* タグ push で Windows exe をビルドし Release へ添付
├── frontend/
│   ├── svelte.config.js     # vitePreprocess({ script: true })（後述の「ビルド注意点」参照）
│   ├── vite.config.js       # Vite + svelte + @tailwindcss/vite
│   ├── src/
│   │   ├── main.js          # Svelte マウント
│   │   ├── style.css        # グローバルスタイル
│   │   ├── App.svelte       # ルート（状態管理 + Wails統合 + スプリッター + Import/Export）
│   │   ├── Sidebar.svelte   # 新規/インポートボタン + タグフィルタ + メモ一覧
│   │   ├── NoteToolbar.svelte # タイトル・タグ入力 + エクスポート/削除ボタン
│   │   ├── Editor.svelte    # マークダウンテキストエディタ
│   │   └── Preview.svelte   # マークダウンプレビュー（DOMPurify済み・文字サイズ可変）
│   └── wailsjs/             # Wails 自動生成バインディング（編集不可・ビルド時に再生成）
├── build/bin/               # ビルド出力先（sirusita / sirusita.exe）
├── LICENSE                  # MIT
└── THIRD_PARTY_LICENSES.md
```

## Go Backend API

### App（app.go）

| メソッド | 説明 |
|---------|------|
| `ExportNote(title, body)` | 開いているメモを H1 見出し付きマークダウンとして保存（保存ダイアログ） |
| `ImportNote()` | マークダウンを取り込み（複数選択可）。front matter→H1→ファイル名 でタイトル決定 |
| `OpenURL(url)` | OS 既定のブラウザで URL を開く |

### NoteService（note_service.go）

| メソッド | 説明 |
|---------|------|
| `NewNoteService(notesDir)` | コンストラクタ、ディレクトリ自動作成 |
| `CreateNote(title, body, tags)` | 新規メモ作成（UUID ファイル名） |
| `GetNote(id)` | メモ取得（front matter パース） |
| `ListNotes()` | 全メモ一覧（更新日時降順） |
| `UpdateNote(id, title, body, tags)` | メモ更新（created 保持） |
| `DeleteNote(id)` | メモ削除 |
| `ListTags()` | 全タグ一覧（重複排除、ソート済） |
| `SearchNotes(query)` | タイトル・本文の全文検索 |

## メモファイル形式

```markdown
---
title: "メモのタイトル"
tags:
  - "タグ1"
  - "タグ2"
created: 2026-06-13T10:00:00+09:00
modified: 2026-06-13T12:00:00+09:00
---

本文（マークダウン）
```

## よく使うコマンド

```bash
# テスト実行
podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test -v ./...

# Linux ビルド
podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build

# Windows ビルド（出力: build/bin/sirusita.exe）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build -platform windows/amd64

# Wails バインディング再生成（Go API 変更時）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails generate module
```

## ビルド注意点（svelte.config.js）

`frontend/svelte.config.js` は **必須**。`vitePreprocess({ script: true })` を有効化している。
flowbite-svelte は TypeScript 入りの `.svelte` を配布しており、Svelte 5 の組み込み TS 除去では
一部の型注釈（例: アロー関数の戻り値型）が残って Rollup ビルドが失敗する。esbuild による
script トランスパイルを明示することで取り込めるようにしている。この設定を削除するとビルドが壊れる。

## リリース

- `.github/workflows/release.yml` が `v*` タグ（例: `v1.0.0`）の push で起動。
- `windows-latest` 上で `wails build -platform windows/amd64` を実行し、
  `build/bin/sirusita.exe` を Release に添付する（`workflow_dispatch` でも手動実行可）。
- CI のフロントエンドビルドも `frontend/svelte.config.js` に依存しているため、コミット必須。

## セキュリティ対策

- **パストラバーサル防止:** `isValidNoteID()` で UUID 形式のみ許可
- **XSS 防止:** `Preview.svelte` で `DOMPurify.sanitize(marked(...))` を使用
- **front matter インジェクション:** タイトル・タグは `%q`（Go クォート）で出力

## コーディング規約

- Go: 標準フォーマット（`gofmt`）
- Svelte 5（runes）: props は `$props()`、状態は `$state`/`$derived`/`$effect`、親への通知はコールバック props（`onXxx`）、イベントは `onclick` 等のネイティブ属性
- コミットメッセージ: `feat:` / `fix:` / `chore:` プレフィックス
- 言語: コード内コメントは日本語 OK、識別子は英語

## 公開・ライセンス

- ライセンス: **MIT**（`LICENSE`、著作権者 morststs）
- **`certs/`（秘密鍵・PFX・署名スクリプト）は公開しない。** `.gitignore` 済み。鍵をコミットしないこと
- サードパーティライセンスは `THIRD_PARTY_LICENSES.md` を参照
```
