# Sirusita

マークダウンで書ける、シンプルなデスクトップメモアプリです。
メモは YAML front matter 付きのマークダウンファイルとしてローカルに保存され、
タグでの分類・プレビュー表示に対応しています。

## 使い方

- **Web 版:** <https://sirusita.e17.click/> を開くだけで使えます（インストール不要）。
  メモはお使いのブラウザ内に保存されます。
- **Windows 版:** [Microsoft Store](https://apps.microsoft.com/detail/9PPT0S6GKBLW) からインストールできます（無料。自動更新されます）。
  署名の無い exe も [GitHub Releases](https://github.com/morststs/sirusita/releases/latest) に置いています
  （[ダウンロード](#ダウンロードwindows)参照）。

## 主な機能

- **マークダウン編集とプレビュー** — 編集タブとプレビュータブを切り替え。プレビューは文字サイズを可変。
- **使い方ヘルプ** — サイドバー上部の「?」ボタンで、アプリ内に使い方を表示（内容は `frontend/src/help.md`）。
- **タグ管理** — メモにタグを付与し、サイドバーのタグフィルタで絞り込み。
  `/` 区切りで階層タグにでき、親タグを選ぶと配下のメモもまとめて表示（[階層タグ](#階層タグ)）。
- **インポート / エクスポート**
  - エクスポート: 開いているメモを H1 見出し付きのマークダウンとして保存。
  - インポート: マークダウン（複数選択可）/ ZIP を取り込み。タイトルは
    front matter → 先頭の H1 見出し → ファイル名 の優先順で決定。**ZIP** を選ぶと
    中の `.md` をまとめて一括取り込み。**sirusita 形式**（`sirusita:` マーカー付き）の
    ファイルはタイトル・タグに加え作成/更新日時もそのまま引き継ぎます。
- **サンプルコンテンツ集** — プログラミング言語・各種図（Mermaid / D2 は実際に描画される例付き。PlantUML は記法のみ）・
  コマンド（bash / docker / sed / git）・正規表現などのチートシートを `contents/` に同梱。
  アプリにも同梱しており、サイドバーの「サンプル集から追加」ボタンで必要なものを選んで
  メモとして追加できます（Web 版も同様）。Release では exe とは別の `sirusita-contents.zip`
  としても配布し、アプリのインポートからそのまま取り込めます。
- **サイドバー幅・プレビュー文字サイズの記憶** — `localStorage` に保持。

## 階層タグ

タグを `/` で区切ると階層として扱われます。タグが増えても、分類ごとにまとめて選べます。

### タグを付ける

ツールバーのタグ欄に、カンマ区切りで入力します（入力欄からフォーカスを外すと保存）。

```
プログラミング/Go, コマンド/git
```

サイドバーのタグフィルタは次のようなツリーになります（数字は配下を含むメモ数）。

```
▾ プログラミング (14)
    Go (3)
    Rust (2)
▸ コマンド (11)
```

- **▸ / ▾** で開閉します。開閉状態はアプリを再起動しても保持されます。
- **親タグを選ぶ**と、配下のタグが付いたメモもまとめて表示されます
  （`プログラミング` を選ぶと `プログラミング/Go` のメモも表示）。
- 途中の階層だけのタグを付ける必要はありません。`a/b/c` を付ければ `a`・`a/b` も自動でツリーに出ます。
- 保存時に余分な空白やスラッシュは取り除かれます（`a / b` → `a/b`、`a//b` → `a/b`）。

### タグ名を変更する・既存タグを階層へ移す

タグにマウスを乗せると表示される **✎** から、タグ名を一括で変更できます。

- 配下のタグもまとめて付け替わります。
  例: `PlantUML` を `図表/PlantUML` に変更すると、既存のタグを `図表` の下へ移せます。
- 変更先が既存のタグと同じ名前なら、2 つのタグは統合されます（変更画面に表示されます）。
  `Markdown` / `markdown` のような表記ゆれの統一にも使えます。
- タグ名を変更しても、メモの作成日時・更新日時は変わりません。

> `TCP/IP` のように `/` を含むタグも階層として扱われます。

## データの保存場所

メモは次のディレクトリに `{UUID}.md` として保存されます。

```
~/.sirusita/notes/{UUID}.md
```

ファイル形式（YAML front matter + マークダウン本文）:

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

`sirusita: "1"` はこのアプリが付与する形式マーカーです。インポート時にこのキーがあると、
作成/更新日時もそのまま引き継がれます。

## 技術スタック

- **バックエンド:** Go 1.23 + [Wails](https://wails.io) v2.12
- **フロントエンド:** Svelte 5（runes）+ Vite 7
- **UI:** Flowbite Svelte + TailwindCSS 4
- ライセンス: MIT

## Web 版

デスクトップ版と同じ画面がブラウザで動きます。メモはブラウザの IndexedDB に保存され、
サーバーには送信されません（ブラウザのデータを消去するとメモも消えるため、
大事なメモはエクスポートしてください）。D2 図の描画とインポートの解析は、
Go を WebAssembly にしたものをブラウザ内で実行しています。

## ダウンロード（Windows）

**[Microsoft Store](https://apps.microsoft.com/detail/9PPT0S6GKBLW)** からインストールしてください
（Microsoft が署名しているため、Windows 11 のスマート アプリ コントロールにブロックされません）。

署名の無い exe 単体も GitHub Releases から入手できます。

- 最新リリース: https://github.com/morststs/sirusita/releases/latest

`v*` タグ（例: `v1.0.0`）を push すると GitHub Actions が Windows 用 exe を
ビルドし、Release に `sirusita-windows-amd64.zip`（exe 本体）と
`sirusita-contents.zip`（サンプルコンテンツ集）を自動添付します。

## 開発（Docker でコンテナ内完結）

ホストに Go / Node / Wails を入れず、すべてのビルド・テストをコンテナ内で行います。
詳細な手順とコマンドは [`CLAUDE.md`](./CLAUDE.md) と
[`.devcontainer/README.md`](./.devcontainer/README.md) を参照してください。

```bash
# 開発用イメージをビルド
docker build -t wails-dev .

# Windows 用 exe をビルド（出力: build/bin/sirusita.exe）
docker run --rm -v "$PWD":/app -w /app wails-dev \
    wails build -platform windows/amd64
```

## Web 版のビルド・プレビュー

```bash
# Web 版をビルド（出力: frontend/dist-web。Go の wasm のビルドを含む）
docker run --rm -v "$PWD":/app -w /app/frontend wails-dev npm run build:web

# ビルドしたものをプレビュー
docker run --rm -v "$PWD":/app -w /app/frontend -p 4173:4173 wails-dev npm run preview:web -- --host
```

main への push で GitHub Actions が Web 版を GitHub Pages へ公開します。

## プライバシー

プライバシーポリシーは [`PRIVACY.md`](./PRIVACY.md) を参照してください。

## ライセンス

MIT License（著作権者: morststs）。詳細は [`LICENSE`](./LICENSE) を参照。
サードパーティライセンスは [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) を参照してください。
