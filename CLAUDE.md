# CLAUDE.md — Sirusita メモアプリ

## プロジェクト概要

Wails v2 + Svelte 5 で構築されたマークダウンベースのメモアプリ（アプリ名: Sirusita）。
メモは `~/.sirusita/notes/{UUID}.md` に YAML front matter 付きで保存される。

## 技術スタック

- **バックエンド:** Go 1.23 + Wails v2.12
- **フロントエンド:** Svelte 5（runes）+ Vite 7
- **UIフレームワーク:** Flowbite Svelte 1.x + TailwindCSS 4（`@tailwindcss/vite`）
- **Go依存:** `github.com/adrg/frontmatter`, `github.com/google/uuid`, `oss.terrastruct.com/d2`(D2図のSVG描画)
- **JS依存:** `monaco-editor`(編集), `marked`, `marked-katex-extension`, `katex`(数式), `mermaid`(図), `marked-highlight`+`highlight.js`(コードハイライト), `dompurify`, `flowbite-svelte`, `flowbite-svelte-icons`

## 開発環境

### Docker 必須（コンテナ内で完結）

ホストに Go/Node/Wails はインストールしない。全てのビルド・テストは Docker コンテナ内で実行する。
Windows 用 exe のクロスビルドまでコンテナ内で完結し、ホストの Docker ソケットの共有や
ネストした daemon（docker-out-of-docker / dind）には依存しない。

コンテナ定義は 2 つある:

- **ルート `Dockerfile`** … 最小構成のビルド用イメージ（下記コマンドが使う `wails-dev`）。
- **`.devcontainer/`** … devcontainer。Claude Code CLI 同梱・非 root の `dev` ユーザー・
  `updateRemoteUserUID` でホスト UID に合わせ所有権ズレを解消。詳細は
  `.devcontainer/README.md` を参照。VS Code / devcontainer CLI を使う場合はこちらが推奨。

```bash
# Docker イメージのビルド（初回 or Dockerfile 変更時）
docker build -t wails-dev .

# Go コマンド実行
docker run --rm -v "$PWD":/app -w /app wails-dev go test -v ./...

# Wails ビルド（Linux）
docker run --rm -v "$PWD":/app -w /app wails-dev wails build

# Wails ビルド（Windows）
docker run --rm -v "$PWD":/app -w /app wails-dev wails build -platform windows/amd64

# フロントエンド npm コマンド
docker run --rm -v "$PWD":/app -w /app/frontend wails-dev npm install <package>
```

> `wails-dev` イメージは root で動くため、Linux ホストでは生成物（`build/bin/`・
> `frontend/dist/`・`frontend/node_modules/` 等）が root 所有になる。必要なら
> `sudo chown -R "$(id -u):$(id -g)" build frontend` で戻す（Docker Desktop の
> macOS / Windows では不要。`.devcontainer` を使えば発生しない）。

> SELinux が有効なホスト（Fedora / RHEL 等）ではマウントを `-v "$PWD":/app:Z` にする。

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
├── d2_render.go             # D2 ソース → SVG 変換（RenderD2、Go ネイティブ）
├── note_service.go          # メモ CRUD ロジック
├── Dockerfile               # ビルド用イメージ（Docker でビルド）
├── wails.json               # Wails 設定（outputfilename: sirusita）
├── .devcontainer/           # Docker 前提の devcontainer（Claude Code 同梱）
│   ├── Dockerfile
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
│   │   ├── markdown.js      # marked 設定（見出しに連番 id 付与 + KaTeX 数式 + highlight.js コードハイライト）+ 見出し抽出ユーティリティ
│   │   ├── monaco.js        # Monaco Editor のスリム構成（エディタ + Markdown + Worker 設定）
│   │   ├── App.svelte       # ルート（状態管理 + Wails統合 + スプリッター + Import/Export + スクロール同期 + タブ/分割表示切替）
│   │   ├── Sidebar.svelte   # 新規/インポートボタン + 階層タグツリー（開閉・件数・タグ名変更）+ メモ一覧
│   │   ├── NoteToolbar.svelte # タイトル・タグ入力 + エクスポート/削除ボタン
│   │   ├── Editor.svelte    # Monaco Editor によるマークダウン編集（スクロール位置を親へ通知）
│   │   ├── Preview.svelte   # マークダウンプレビュー（DOMPurify済み・文字サイズ可変・見出しジャンプ・Mermaid/D2図描画）
│   │   ├── Toc.svelte       # 見出し一覧パネル（クリックでプレビューの該当箇所へジャンプ）
│   │   └── tagTree.js       # 階層タグ（"親/子"）ユーティリティ: 正規化・前方一致・ツリー構築・リネーム計算（node --test でテスト）
│   └── wailsjs/             # Wails 自動生成バインディング（編集不可・ビルド時に再生成）
├── contents/                # 配布用サンプルメモ集（題名がそのままファイル名。
│                            #   sirusita 形式。release で別 ZIP として配布）
├── build/bin/               # ビルド出力先（sirusita / sirusita.exe）
├── LICENSE                  # MIT
└── THIRD_PARTY_LICENSES.md
```

## Go Backend API

### App（app.go）

| メソッド | 説明 |
|---------|------|
| `ExportNote(title, body)` | 開いているメモを H1 見出し付きマークダウンとして保存（保存ダイアログ） |
| `ImportNote()` | マークダウン / ZIP を取り込み（複数選択可）。front matter→H1→ファイル名 でタイトル決定。`.zip` は中の `.md`/`.markdown` を一括取り込み。sirusita 形式なら日時も保持 |
| `ImportFiles(paths)` | ドラッグ&ドロップ用。`.md`/`.markdown`/`.zip` を受け付ける |
| `OpenURL(url)` | OS 既定のブラウザで URL を開く |
| `RenderD2(source)` | D2 ソースを SVG へ変換（`d2_render.go`・完全オフライン・panic は recover でエラー化） |

### NoteService（note_service.go）

| メソッド | 説明 |
|---------|------|
| `NewNoteService(notesDir)` | コンストラクタ、ディレクトリ自動作成 |
| `CreateNote(title, body, tags)` | 新規メモ作成（UUID ファイル名） |
| `CreateImported(title, body, tags, created, modified)` | 作成/更新日時を指定して作成（インポート用。空なら現在時刻） |
| `GetNote(id)` | メモ取得（front matter パース） |
| `ListNotes()` | 全メモ一覧（更新日時降順） |
| `UpdateNote(id, title, body, tags)` | メモ更新（created 保持） |
| `DeleteNote(id)` | メモ削除 |
| `ListTags()` | 全タグ一覧（重複排除、ソート済） |
| `RenameTag(old, new)` | タグとその配下（`old/…`）を一括で付け替え。既存タグとは統合。作成/更新日時は保持。更新件数を返す |
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
sirusita: "1"
---

本文（マークダウン）
```

`sirusita: "1"` は **sirusita 形式マーカー**（`note_service.go` の `sirusitaFormatVersion`）。
このアプリが保存したメモであることを示し、インポート時にこのキーがあれば
タイトル・タグだけでなく作成/更新日時もそのまま引き継ぐ。外部から取り込んだ
マーカー無しのマークダウンは、作成/更新日時を取り込み時の現在時刻にする。

タグは `/` 区切りで階層を表す（例: `プログラミング/Go`）。保存・読み込み時に
`NormalizeTag` でセグメント前後の空白と空セグメントを除去する。サイドバーで親タグを
選ぶと配下のタグが付いたメモも表示される。

## よく使うコマンド

```bash
# テスト実行
docker run --rm -v "$PWD":/app -w /app wails-dev go test -v ./...

# Linux ビルド
docker run --rm -v "$PWD":/app -w /app wails-dev wails build

# Windows ビルド（出力: build/bin/sirusita.exe）
docker run --rm -v "$PWD":/app -w /app wails-dev wails build -platform windows/amd64

# フロントの純粋関数テスト（tagTree.js）
docker run --rm -v "$PWD":/app -w /app wails-dev node --test frontend/src/tagTree.test.js

# Wails バインディング再生成（Go API 変更時）
docker run --rm -v "$PWD":/app -w /app wails-dev wails generate module
```

## ビルド注意点（svelte.config.js）

`frontend/svelte.config.js` は **必須**。`vitePreprocess({ script: true })` を有効化している。
flowbite-svelte は TypeScript 入りの `.svelte` を配布しており、Svelte 5 の組み込み TS 除去では
一部の型注釈（例: アロー関数の戻り値型）が残って Rollup ビルドが失敗する。esbuild による
script トランスパイルを明示することで取り込めるようにしている。この設定を削除するとビルドが壊れる。

## リリース

- `.github/workflows/release.yml` が `v*` タグ（例: `v1.0.0`）の push で起動。
- `windows-latest` 上で `wails build -platform windows/amd64` を実行し、exe を
  `sirusita-windows-amd64.zip`（LICENSE / THIRD_PARTY_LICENSES.md / README.md 同梱）に
  圧縮して Release に添付する（`workflow_dispatch` でも手動実行可）。zip 化は
  PowerShell の `Compress-Archive` を使用。
- 同じワークフローで `contents/*.md` を `sirusita-contents.zip` に固めて **exe とは別の ZIP**
  として Release に添付する。利用者はアプリの「インポート」からこの ZIP をそのまま取り込める。
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
