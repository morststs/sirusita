# Web 版（GitHub Pages）と Microsoft Store 公開 設計

- 日付: 2026-10-07
- ステータス: 承認済み（実装前）
- 参考: `morststs/shiboq`（同じ構成で Web 版と MSIX を実装済み。`/workspaces/shiboq`）

## 目的

1. 同じフロントエンドをブラウザで動かす Web 版を `https://sirusita.e17.click/` で公開する。
2. 未署名 exe が Windows 11 のスマート アプリ コントロールにブロックされる問題を、
   Microsoft Store（MSIX、Store が署名）経由の配布で回避する。

## 決定事項（ユーザー回答）

- Web 版 URL: `sirusita.e17.click`（Route53 `e17.click` に CNAME、Pages の独自ドメイン）。
- Partner Center の製品は作成済み（2026-10-07、ユーザー提供のスクリーンショット）:
  Name `morststs.sirusita`、Publisher `CN=CE782894-A6A6-48CC-8F6D-36D71DA87B9A`、
  PublisherDisplayName `morststs`、PFN `morststs.sirusita_q9kp0rnkmck24`、Store ID `9PPT0S6GKBLW`。
  ディープリンク / Web ストア URL は「製品が有効になると利用可能」（未公開）。
- Web 版の D2: wasm を**必要になったときだけ**読み込む（gzip 後約 7.2MB、Node で動作確認済み）。
- Google Fonts の CDN 読み込みは**外す**（OS フォントにフォールバック）。

## 1. バックエンド抽象化（`$backend`）

`vite.config.js` の `$backend` エイリアスで切り替える（shiboq と同じ）。

- 通常（デスクトップ）: `frontend/src/backend/wails.js` … wailsjs の再 export ＋薄いラッパ
- `--mode web`: `frontend/src/backend/web.js`
- Web ビルドは `base: './'`、出力 `frontend/dist-web`（`go:embed` される `frontend/dist` を上書きしない）

両者が提供する API（すべて Promise を返す。エラーは reject）:

| 名前 | 説明 |
|---|---|
| `ListNotes()` / `GetNote(id)` / `CreateNote(title, body, tags)` / `UpdateNote(id, title, body, tags)` / `DeleteNote(id)` / `ListTags()` / `RenameTag(old, new)` | NoteService と同じ意味 |
| `ExportNote(title, body)` | デスクトップ: 保存ダイアログ→パス。Web: `.md` をダウンロードしファイル名を返す |
| `ImportNote()` | デスクトップ: ファイル選択ダイアログ。Web: `<input type=file multiple>`。作成した `Note[]`（キャンセルは `[]`/`null`） |
| `OnImportDrop(cb)` / `OffImportDrop()` | ファイルのドロップ。`cb(runImport)` を呼び、`runImport()` が `Promise<Note[]>` を返す（App 側で保存待ちを flush してから実行できるように関数で渡す） |
| `RenderD2(source)` | SVG 文字列 |
| `OpenURL(url)` | 外部ブラウザで開く（Web は `window.open(url, '_blank', 'noopener')`） |
| `IS_WEB` | `false` / `true` |

## 2. Go 側の整理（デスクトップ・wasm 共用）

- `import_parse.go`（ビルドタグなし）: `importedDoc` / `importFrontMatter` / `parseMarkdownImport` を
  `app.go` から移し、`parseImportFile(name string, data []byte) ([]importedDoc, error)` を追加
  （`.zip` は中の `.md`/`.markdown` を全て、それ以外は 1 件として解析）。
  `app.go` の取り込みはこれを使う形に置き換える（挙動は従来どおり）。
- `d2_render.go`（ビルドタグなし）: 本体を `renderD2(source string) (string, error)` にし、
  `App.RenderD2` は `app.go` 側の 1 行ラッパにする（バインディングは不変）。
- `main.go`・`app.go`・`note_service.go` とそのテストは `//go:build !js`。
- `web_bridge.go`（ビルドタグなし・テスト可能）: `callWeb(method, argsJSON string) (string, error)`
  - `RenderD2` `[source]` → SVG 文字列（JSON 文字列）
  - `ParseImport` `[name, base64Data]` → `[{title, body, tags, created, modified}]`
- `wasm_main.go`（`//go:build js && wasm`）: グローバル `sirusitaCall(method, argsJSON, callback)` を登録。
  処理は goroutine で行い `callback(resultJSON, errorMessage)`（shiboq と同じ）。

## 3. Web 版のメモ保存（IndexedDB）

- DB `sirusita`、ストア `notes`（keyPath `id`）。値は `Note` と同じ形
  `{id, title, tags, created, modified, body}`。
- 振る舞いは `note_service.go` と同じ: UUID 発行、タグ正規化（`tagTree.js` の `normalizeTag` を再利用）、
  `created` は更新で保持、`modified` は RFC3339（ローカルのオフセット付き・秒精度。Go の
  `time.Now().Format(time.RFC3339)` と同形）、一覧は `modified` 降順（文字列比較）、
  `ListTags` は重複除去・ソート、`RenameTag` は配下ごと付け替え＋統合・日時保持・変更件数を返す、
  不正 ID（UUID でない）はエラー。
- 純粋ロジックは `frontend/src/backend/noteLogic.js`（`node --test` でテスト）、
  IndexedDB 層は `frontend/src/backend/webNotes.js`。

## 4. Web 版の wasm 読み込み

- `scripts/build-wasm.sh` が `GOOS=js GOARCH=wasm go build` で `frontend/src/backend/generated/sirusita.wasm`
  を作り、`$(go env GOROOT)/lib/wasm/wasm_exec.js` をコピーする（生成物は `.gitignore`）。
- `frontend/src/backend/wasm.js`: 初回呼び出し時に wasm をコンパイルし Worker（`sirusita.worker.js`）で起動。
  呼び出しは id で対応付ける。1 呼び出し 30 秒でタイムアウトし Worker を作り直す
  （wasm はプリエンプションが無く、Go 側で打ち切れないため）。
- 呼び出すのは D2 描画とインポート解析のときだけ（初回表示では読み込まない）。

## 5. UI の変更

- `App.svelte` / `Preview.svelte` は `$backend` から import する。ファイルドロップは `OnImportDrop`。
- Web 版だけ、サイドバー下部に「データはこのブラウザ内に保存されます」と、
  `STORE_URL` が設定されていれば「Windows アプリ版（Microsoft Store）」リンクを表示する
  （Store で公開されるまでは `STORE_URL = ''` で非表示。公開後に
  `https://apps.microsoft.com/detail/9PPT0S6GKBLW` を設定する。公式バッジ等の外部スクリプトは使わない）。
- Google Fonts の `<link>` を削除し、フォント指定から `"Noto Sans JP"` / `"Source Code Pro"` を外して
  OS フォントのスタック（`-apple-system, BlinkMacSystemFont, "Segoe UI", "Yu Gothic UI", Meiryo,
  "Hiragino Sans", Roboto, sans-serif` / 等幅は `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`）にする。

## 6. 公開（GitHub Pages）

- `.github/workflows/pages.yml`: main への push と手動実行。Go 1.23 / Node 22、
  `GOOS=js GOARCH=wasm go vet .`、`npm ci`、`npm run build:web`、`LICENSE`・`THIRD_PARTY_LICENSES.md`・
  `PRIVACY.md` を `dist-web` に同梱、Pages へデプロイ（アクションは Node 24 版）。
- リポジトリの Pages 設定（Source: GitHub Actions）、Route53 の CNAME（`sirusita` → `morststs.github.io`、TTL 300）、
  Pages のカスタムドメイン設定・HTTPS 強制は、マージ後にコントローラーが行う。

## 7. Microsoft Store（MSIX、半自動運用）

- `build/msix/AppxManifest.xml`: shiboq と同構成（runFullTrust、Windows 11 以上、ja-JP、
  DisplayName `Sirusita`、Executable `sirusita.exe`）。Identity は上記の製品 ID の値
  （`REPLACE_WITH_` の仮値が残っていたらスクリプトはエラーで止まる仕組みは残す）。
- `scripts/build-msix.ps1 -Version X.Y.Z`（ASCII のみ・未署名・ロゴは `build/appicon.png` から生成）。
- `.github/workflows/msix.yml`: `v*` タグ push と手動実行（`version` 入力）。MSIX バージョンは
  タグの `X.Y.Z` をそのまま使う（sirusita のタグは 1.x 以上）。Artifact `sirusita-msix`。
  Store への自動申請はしない（ユーザーが Artifact を Partner Center に手でアップロードする）。
- `docs/store-submission.md`: 製品 ID の控え、初回提出の手順、提出内容の下書き
  （説明文・キーワード・runFullTrust の理由・IARC・プロパティ等。shiboq の控えを踏襲）。
- `PRIVACY.md`（英日、デスクトップ版と Web 版）。
- `release.yml` の Release 本文に Web 版へのリンクを入れる。Store 版のリンク
  （`https://apps.microsoft.com/detail/9PPT0S6GKBLW`）は**公開後**に有効化する（それまでは入れない）。
- README・CLAUDE.md を更新。

## テスト

- Go: `import_parse` / `web_bridge`（RenderD2・ParseImport・不正入力）、既存テストの維持。
- JS: `noteLogic.test.js`（`node --test`）。
- wasm を Node（`wasm_exec_node.js` 相当の読み込み）で起動し `sirusitaCall` の RenderD2・ParseImport を確認。
- `npm run build`（デスクトップ）と `npm run build:web` が通ること。
- 可能ならヘッドレス Chromium で Web 版の作成・保存・リロード後の復元・インポート・D2 表示を確認。
