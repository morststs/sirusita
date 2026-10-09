# CLAUDE.md — Sirusita メモアプリ

## プロジェクト概要

Wails v2 + Svelte 5 で構築されたマークダウンベースのメモアプリ（アプリ名: Sirusita）。
メモは `~/.sirusita/notes/{UUID}.md` に YAML front matter 付きで保存される。

同じ画面をブラウザで動かす **Web 版**（https://sirusita.e17.click/ ・GitHub Pages・メモはブラウザの
IndexedDB に保存）もある（「Web 版（GitHub Pages）」参照）。**Microsoft Store 版**は準備中
（準備中・未提出。「MSIX / Microsoft Store」参照）。

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
├── d2_render.go             # D2 ソース → SVG 変換（renderD2。デスクトップと wasm で共用）
├── import_parse.go          # インポート解析（parseImportFile。デスクトップと wasm で共用）
├── web_bridge.go            # wasm から呼ぶ JSON 入出力のラッパー（Web 版用。ビルドタグなし）
├── wasm_main.go             # Web 版 wasm のエントリ（`js && wasm`）。JS へ関数を公開
├── note_service.go          # メモ CRUD ロジック
├── PRIVACY.md               # プライバシーポリシー（Web 版と同梱して公開）
├── docs/store-submission.md # Microsoft Store 提出内容の控え
├── scripts/
│   ├── build-wasm.sh        # Go を wasm にビルドし wasm_exec.js と生成先へ出力
│   ├── wasm-smoke.mjs       # 生成した wasm の動作確認（Node）
│   └── build-msix.ps1       # 未署名 MSIX を作る（Windows 専用・ASCII のみ）
├── build/msix/AppxManifest.xml # MSIX マニフェスト（製品 ID 設定済み）
├── Dockerfile               # ビルド用イメージ（Docker でビルド）
├── wails.json               # Wails 設定（outputfilename: sirusita）
├── .devcontainer/           # Docker 前提の devcontainer（Claude Code 同梱）
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── README.md
├── .github/workflows/
│   ├── release.yml          # v* タグ push で Windows exe をビルドし Release へ添付
│   ├── msix.yml             # v* タグ push で MSIX をビルドし Artifact へ（Store 申請は手動）
│   └── pages.yml            # main push で Web 版をビルドし GitHub Pages へ公開
├── frontend/
│   ├── svelte.config.js     # vitePreprocess({ script: true })（後述の「ビルド注意点」参照）
│   ├── vite.config.js       # Vite + svelte + @tailwindcss/vite + samplesPlugin（contents/ を virtual:samples に）
│   ├── src/
│   │   ├── main.js          # Svelte マウント
│   │   ├── links.js         # 外部への案内リンク（STORE_URL。空のあいだ非表示）
│   │   ├── backend/         # `$backend` の実装: wails.js（デスクトップ）/ web.js（Web）、webNotes.js（IndexedDB）、noteLogic.js、wasm.js + sirusita.worker.js（wasm 呼び出し）、generated/（wasm 生成物・gitignore）
│   │   ├── style.css        # グローバルスタイル
│   │   ├── markdown.js      # marked 設定（見出しに連番 id 付与 + KaTeX 数式 + highlight.js コードハイライト）+ 見出し抽出ユーティリティ
│   │   ├── monaco.js        # Monaco Editor のスリム構成（エディタ + Markdown + Worker 設定）
│   │   ├── App.svelte       # ルート（状態管理 + Wails統合 + スプリッター + Import/Export + スクロール同期 + タブ/分割表示切替）
│   │   ├── Sidebar.svelte   # 新規/インポート/サンプル集/ヘルプ（?）ボタン + 階層タグツリー（開閉・件数・タグ名変更）+ メモ一覧
│   │   ├── SampleModal.svelte # サンプル集から追加のモーダル（検索・複数選択して新規メモとして作成）
│   │   ├── samples.js       # 同梱サンプル集（vite.config.js の `virtual:samples` で contents/*.md を取り込み）
│   │   ├── HelpModal.svelte # 使い方ヘルプのモーダル（Preview で help.js の本文を表示）
│   │   ├── help.js          # ヘルプ本文。contents/Sirusita の使い方.md を `?raw` で取り込み front matter を除く
│   │   ├── frontMatter.js   # front matter の除去・title/tags の取り出し（node --test でテスト）
│   │   ├── NoteToolbar.svelte # タイトル・タグ入力 + エクスポート/削除ボタン
│   │   ├── Editor.svelte    # Monaco Editor によるマークダウン編集（スクロール位置を親へ通知）
│   │   ├── Preview.svelte   # マークダウンプレビュー（DOMPurify済み・文字サイズ可変・見出しジャンプ・Mermaid/D2図描画・コードブロックのコピーボタン（$backend の CopyText））
│   │   ├── Toc.svelte       # 見出し一覧パネル（クリックでプレビューの該当箇所へジャンプ）
│   │   └── tagTree.js       # 階層タグ（"親/子"）ユーティリティ: 正規化・前方一致・ツリー構築・リネーム計算（node --test でテスト）
│   └── wailsjs/             # Wails 自動生成バインディング（編集不可・ビルド時に再生成）
├── contents/                # 配布用サンプルメモ集（題名がそのままファイル名。
│                            #   sirusita 形式。release で別 ZIP として配布）
│                            #   アプリにも同梱し「サンプル集から追加」で選んで追加できる
│                            #   （import.meta.glob は「C#」の # で壊れるため samplesPlugin で読む）
│                            #   「Sirusita の使い方.md」はアプリ内ヘルプの本文も兼ねる
│                            #   （```d2 ブロックは contents_test.go が全て描画できるか検証）
├── build/bin/               # ビルド出力先（sirusita / sirusita.exe）
├── LICENSE                  # MIT
└── THIRD_PARTY_LICENSES.md
```

## Go Backend API

### App（app.go）

| メソッド | 説明 |
|---------|------|
| `ExportNote(title, body)` | 開いているメモを H1 見出し付きマークダウンとして保存（保存ダイアログ） |
| `ImportNote()` | マークダウン / ZIP を取り込み（複数選択可）。front matter→H1→ファイル名 でタイトル決定。`.zip` は中の `.md`/`.markdown` を一括取り込み。sirusita 形式なら日時も保持。解析は `parseImportFile`（`import_parse.go`） |
| `ImportFiles(paths)` | ドラッグ&ドロップ用。`.md`/`.markdown`/`.zip` を受け付ける |
| `OpenURL(url)` | OS 既定のブラウザで URL を開く |
| `RenderD2(source)` | D2 ソースを SVG へ変換。本体は `renderD2`（`d2_render.go`）。Web 版と共用（完全オフライン・panic は recover でエラー化） |

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

# フロントの純粋関数テスト（tagTree.js / frontMatter.js）
docker run --rm -v "$PWD":/app -w /app wails-dev node --test frontend/src/tagTree.test.js frontend/src/frontMatter.test.js

# Web 版のビルド（出力: frontend/dist-web。wasm のビルド込み）
docker run --rm -v "$PWD":/app -w /app/frontend wails-dev npm run build:web

# Web 版の wasm のビルドと動作確認
docker run --rm -v "$PWD":/app -w /app wails-dev sh -c 'sh scripts/build-wasm.sh && node scripts/wasm-smoke.mjs'

# IndexedDB 用の純粋ロジックのテスト（noteLogic.js）
docker run --rm -v "$PWD":/app -w /app wails-dev node --test frontend/src/backend/noteLogic.test.js

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
- ヘルプのフッターにバージョンを表示する。`vite.config.js` が `SIRUSITA_VERSION`（release.yml / msix.yml が
  タグ名を渡す）→ `git describe --tags --always` → `dev` の順で決め、`__APP_VERSION__` として埋め込む
  （pages.yml は `fetch-depth: 0` で履歴とタグを取得し `v1.5.0-3-gabc1234` のようになる）。
- CI のフロントエンドビルドも `frontend/svelte.config.js` に依存しているため、コミット必須。
- `v*` タグの push では release.yml と msix.yml が同時に動く（MSIX は Artifact に置かれるだけ）。

## Web 版（GitHub Pages）

- **`$backend`:** `App.svelte` などは `$backend` から import する。`vite.config.js` のエイリアスで、
  通常ビルドは `src/backend/wails.js`（Wails バインディング）、`--mode web` は `src/backend/web.js` に切り替わる。
  `IS_WEB` で Web 版だけの案内（ブラウザ保存の注意・Store 案内）を出し分ける。
- **メモの保存:** IndexedDB（DB 名 `sirusita` / ストア `notes`。`webNotes.js`）。ロジックは `noteLogic.js`。
  データはブラウザごとで、サーバーには送られない。エクスポートは `.md` のダウンロード、
  インポートは `<input type="file">` とウィンドウへのドロップ。
- **wasm:** D2 描画とインポート解析は Go を wasm にして使う（`wasm_main.go` / `web_bridge.go`）。
  必要になるまで読み込まない（遅延読み込み）。Worker（`sirusita.worker.js`）で実行し、1 回の呼び出しは
  30 秒でタイムアウトして Worker を作り直す（`wasm.js`）。`wasm_exec.js` は wasm のビルドに使った Go と同じ版でなければならない（`build-wasm.sh` が同時に出力）。
- **ビルドタグ:** デスクトップ専用の Go ファイル（main.go / app.go / note_service.go とそのテスト）は `//go:build !js`、
  wasm のエントリ（wasm_main.go）は `//go:build js && wasm`。共用部（d2_render.go / import_parse.go / web_bridge.go）はタグなし。
  Go を変えたら `GOOS=js GOARCH=wasm go vet .` が通ることを確認する。
- **公開:** `.github/workflows/pages.yml` が main への push で `npm run build:web` を実行し、
  `frontend/dist-web` に LICENSE / THIRD_PARTY_LICENSES.md / PRIVACY.md を足して Pages へデプロイする。
  Pages の Source は **GitHub Actions**。
- **独自ドメイン:** `sirusita.e17.click`。Route53 のホストゾーン `e17.click` に CNAME `sirusita` → `morststs.github.io`。
  カスタムドメインの設定は GitHub Pages 側（リポジトリの Pages 設定）が正。
- **外部 CDN を使わない:** Web 版はプライバシー上、閲覧時に第三者へ通信しない方針。
  そのため Google Fonts は廃止し、OS のシステムフォントを使う（同梱フォントは KaTeX のもののみ）。

## MSIX / Microsoft Store

- **マニフェスト:** `build/msix/AppxManifest.xml`。製品 ID（Name / Publisher / PublisherDisplayName）は
  Partner Center の値を設定済み（秘密情報ではない）。値は `docs/store-submission.md` の表を参照。
- **`scripts/build-msix.ps1`:** `build/bin/sirusita.exe` から**未署名**の MSIX（`build/bin/sirusita.msix`）を作る。
  Windows と Windows SDK（MakeAppx）が必要で Linux コンテナでは動かない。**ASCII のみ**で書くこと
  （Windows PowerShell 5.1 は BOM なしを ANSI で読むため）。ロゴは `build/appicon.png` から生成。
- **`.github/workflows/msix.yml`:** `v*` タグの push（または手動実行）で MSIX をビルドし、Artifact
  `sirusita-msix` に置くだけ。Store への申請は自動化せず、Partner Center で手動アップロードする（半自動）。
- **バージョン:** タグ `vX.Y.Z` の `X.Y.Z` がそのまま MSIX のバージョン（`X.Y.Z.0`）になる。
  先頭は 0 にできず、更新のたびに公開中より大きくする。
- **公開後:** Store ページ（`https://apps.microsoft.com/detail/9PPT0S6GKBLW`）が開けるようになったら、
  `frontend/src/links.js` の `STORE_URL` と release.yml の `body` にリンクを追加し、README にも追記する。
  公開前は UI・README・Release 本文にこの URL を出さない。
- 提出内容の控えと手順: `docs/store-submission.md`。

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
