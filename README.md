# Sirusita

マークダウンで書ける、シンプルなデスクトップメモアプリです。
メモは YAML front matter 付きのマークダウンファイルとしてローカルに保存され、
タグでの分類・全文検索・プレビュー表示に対応しています。

## 主な機能

- **マークダウン編集とプレビュー** — 編集タブとプレビュータブを切り替え。プレビューは文字サイズを可変。
- **タグ管理** — メモにタグを付与し、サイドバーのタグフィルタで絞り込み。
- **全文検索** — タイトル・本文を対象に検索。
- **インポート / エクスポート**
  - エクスポート: 開いているメモを H1 見出し付きのマークダウンとして保存。
  - インポート: マークダウン（複数選択可）/ ZIP を取り込み。タイトルは
    front matter → 先頭の H1 見出し → ファイル名 の優先順で決定。**ZIP** を選ぶと
    中の `.md` をまとめて一括取り込み。**sirusita 形式**（`sirusita:` マーカー付き）の
    ファイルはタイトル・タグに加え作成/更新日時もそのまま引き継ぎます。
- **サンプルコンテンツ集** — プログラミング言語・各種図（PlantUML / Mermaid / D2）・
  コマンド（bash / docker / sed / git）・正規表現などのチートシートを `contents/` に同梱。
  Release では exe とは別の `sirusita-contents.zip` として配布し、アプリのインポートから
  そのまま取り込めます。
- **サイドバー幅・プレビュー文字サイズの記憶** — `localStorage` に保持。

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

## ダウンロード（Windows）

ビルド済みの Windows 向け実行ファイルは GitHub Releases から入手できます。

- 最新リリース: https://github.com/morststs/sirusita/releases/latest

`v*` タグ（例: `v1.0.0`）を push すると GitHub Actions が Windows 用 exe を
ビルドし、Release に `sirusita-windows-amd64.zip`（exe 本体）と
`sirusita-contents.zip`（サンプルコンテンツ集）を自動添付します。

## 開発（Podman でコンテナ内完結）

ホストに Go / Node / Wails を入れず、すべてのビルド・テストをコンテナ内で行います。
詳細な手順とコマンドは [`CLAUDE.md`](./CLAUDE.md) と
[`.devcontainer/README.md`](./.devcontainer/README.md) を参照してください。

```bash
# 開発用イメージをビルド
podman build -t wails-dev .

# Windows 用 exe をビルド（出力: build/bin/sirusita.exe）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev \
    wails build -platform windows/amd64
```

## ライセンス

MIT License（著作権者: morststs）。詳細は [`LICENSE`](./LICENSE) を参照。
サードパーティライセンスは [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) を参照してください。
