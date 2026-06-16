# CLAUDE.md — wails01 メモアプリ

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

### Docker 必須

ホストに Go/Node/Wails はインストールしない。全てのビルド・テストは Docker コンテナ内で実行する。

```bash
# Docker イメージのビルド（初回 or Dockerfile 変更時）
docker build -t wails-dev .

# Go コマンド実行
docker run --rm -v $(pwd):/app -w /app wails-dev go test -v ./...

# Wails ビルド（Linux）
docker run --rm -v $(pwd):/app -w /app wails-dev wails build

# Wails ビルド（Windows）
docker run --rm -v $(pwd):/app -w /app wails-dev wails build -platform windows/amd64

# フロントエンド npm コマンド
docker run --rm -v $(pwd):/app -w /app/frontend wails-dev npm install <package>

# Docker 実行後のファイル権限修正（必要に応じて）
docker run --rm -v $(pwd):/app -w /app wails-dev chown -R $(id -u):$(id -g) /app
```

### Docker イメージ内容 (wails-dev)

- Go 1.23, Node.js 22 LTS（NodeSource）, Wails CLI v2.12
- libgtk-3-dev, libwebkit2gtk-4.0-dev（Linux ビルド用）
- gcc-mingw-w64-x86-64, nsis（Windows クロスコンパイル用）

> 注意: Svelte 5 / Vite 7 系は Node 20.19+ / 22.12+ を要求するため、イメージは Node 22 を使用。

## プロジェクト構成

```
wails01/
├── main.go                  # Wails エントリポイント、NoteService 初期化
├── app.go                   # App 構造体（Wails ライフサイクル）
├── note_service.go          # メモ CRUD ロジック（7メソッド）
├── note_service_test.go     # Go テスト（11テスト）
├── Dockerfile               # 開発用 Docker イメージ
├── wails.json               # Wails 設定
├── frontend/
│   ├── src/
│   │   ├── main.js          # Svelte マウント
│   │   ├── style.css        # グローバルスタイル
│   │   ├── App.svelte       # ルート（runes 状態管理 + Wails統合 + スプリッター）
│   │   ├── Sidebar.svelte   # タグフィルタ + メモ一覧（Flowbite Accordion）
│   │   ├── NoteToolbar.svelte # タイトル・タグ入力（削除はアイコンボタン）
│   │   ├── Editor.svelte    # マークダウンテキストエディタ
│   │   └── Preview.svelte   # マークダウンプレビュー（DOMPurify済み・文字サイズ可変）
│   ├── vite.config.js       # Vite + svelte + @tailwindcss/vite
│   └── wailsjs/             # Wails 自動生成バインディング（編集不可）
├── build/bin/               # ビルド出力先（sirusita / sirusita.exe）
├── LICENSE                  # MIT
└── docs/superpowers/
    ├── specs/               # 設計書
    └── plans/               # 実装計画
```

## Go Backend API (NoteService)

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
docker run --rm -v $(pwd):/app -w /app wails-dev go test -v ./...

# Linux ビルド
docker run --rm -v $(pwd):/app -w /app wails-dev wails build

# Windows ビルド
docker run --rm -v $(pwd):/app -w /app wails-dev wails build -platform windows/amd64

# Wails バインディング再生成（Go API 変更時）
docker run --rm -v $(pwd):/app -w /app wails-dev wails generate module
```

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
