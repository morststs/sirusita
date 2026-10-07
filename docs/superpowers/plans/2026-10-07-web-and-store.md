# Web 版（GitHub Pages）と Microsoft Store 公開 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 同じフロントエンドをブラウザで動かす Web 版（`https://sirusita.e17.click/`）と、Microsoft Store 提出用 MSIX のビルドを追加する。

**Architecture:** `vite.config.js` の `$backend` エイリアスで、デスクトップ版（wailsjs）と Web 版（IndexedDB ＋ Go を wasm にしたもの）を切り替える。Go のインポート解析と D2 描画は Wails に依存しない関数に切り出し、デスクトップと wasm で共用する。wasm は D2 描画・インポートのときだけ Worker で遅延読み込みする。MSIX は shiboq と同じ構成で、タグの push で Artifact を作る半自動運用。

**Tech Stack:** Go 1.23（`GOOS=js GOARCH=wasm`）+ Wails v2.12、Svelte 5 runes + Vite 7、IndexedDB、Web Worker、GitHub Actions（Pages / windows-latest）、Windows SDK MakeAppx。

設計書: `docs/superpowers/specs/2026-10-07-web-and-store-design.md`
参考実装（読み取り専用。コピー元として参照してよい）: `/workspaces/shiboq`（`frontend/src/backend/{web.js,wails.js,jq.worker.js,webSaved.js}`、`frontend/vite.config.js`、`scripts/{build-wasm.sh,build-msix.ps1}`、`build/msix/AppxManifest.xml`、`.github/workflows/{pages.yml,msix.yml}`、`PRIVACY.md`、`docs/store-submission.md`）

## Global Constraints

- 作業ブランチ: `feat/web-and-store`。
- 環境: `go`（1.26、go.mod は `go 1.23.0`）と `node` 22 が直接使える。wails / docker / podman は無い。
  `frontend/node_modules` はインストール済み。デスクトップ用 `frontend/dist` は `npm run build` で生成できる（`go test` は `go:embed all:frontend/dist` のため `frontend/dist` を要求する）。
- Web 版の URL: `https://sirusita.e17.click/`。
- Partner Center の製品 ID（秘密情報ではない）: Name `morststs.sirusita` / Publisher `CN=CE782894-A6A6-48CC-8F6D-36D71DA87B9A` / PublisherDisplayName `morststs` / PFN `morststs.sirusita_q9kp0rnkmck24` / Store ID `9PPT0S6GKBLW`。Store のページ URL `https://apps.microsoft.com/detail/9PPT0S6GKBLW` は**製品の公開後に有効**になるため、UI と Release 本文にはまだ出さない。
- 外部 CDN・外部スクリプトを読み込まない（Google Fonts も削除する）。npm 依存は追加しない。
- Svelte 5 runes 規約（`$props`/`$state`/`$derived`/`$effect`、コールバック props `onXxx`、`onclick` 等）。
- Go は gofmt。コメントは日本語、識別子は英語。PowerShell スクリプトは **ASCII のみ**。
- コミットメッセージは `feat:` / `fix:` / `chore:` / `docs:`、末尾に `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`。
- `frontend/dist`・`frontend/dist-web`・`frontend/src/backend/generated/`・`node_modules` はコミットしない。

## File Structure

| ファイル | 種別 | 責務 |
|---|---|---|
| `import_parse.go` | Create | `importedDoc`・`importFrontMatter`・`parseMarkdownImport`（app.go から移動）＋ `parseImportFile`（md / zip） |
| `import_parse_test.go` | Create | `parseImportFile` のテスト（app_test.go の ZIP テストを移す） |
| `d2_render.go` | Modify | `renderD2(source)`（レシーバなし） |
| `d2_render_test.go` | Modify | `renderD2` を直接テスト |
| `app.go` | Modify | `//go:build !js`、`importPaths` を `parseImportFile` 経由に、`RenderD2` ラッパ |
| `main.go` / `note_service.go` / `app_test.go` / `note_service_test.go` | Modify | `//go:build !js` |
| `web_bridge.go` / `web_bridge_test.go` | Create | `callWeb(method, argsJSON)`（RenderD2 / ParseImport） |
| `wasm_main.go` | Create | `//go:build js && wasm`、`sirusitaCall` を登録 |
| `scripts/build-wasm.sh` | Create | wasm と `wasm_exec.js` を `frontend/src/backend/generated/` へ |
| `scripts/wasm-smoke.mjs` | Create | Node で wasm を起動し RenderD2 / ParseImport を確認 |
| `frontend/src/backend/noteLogic.js` / `noteLogic.test.js` | Create | Web 版メモ保存の純粋ロジック |
| `frontend/src/backend/webNotes.js` | Create | IndexedDB の NoteService 相当 |
| `frontend/src/backend/wails.js` | Create | デスクトップ版バックエンド |
| `frontend/src/backend/wasm.js` / `sirusita.worker.js` | Create | wasm の遅延読み込みと Worker 呼び出し |
| `frontend/src/backend/web.js` | Create | Web 版バックエンド |
| `frontend/vite.config.js` / `frontend/package.json` | Modify | `$backend`・`--mode web`・スクリプト |
| `frontend/src/links.js` | Create | `STORE_URL`（公開まで空） |
| `frontend/src/App.svelte` / `Preview.svelte` / `Sidebar.svelte` | Modify | `$backend` 化・ドロップ・Web 版の案内 |
| `frontend/index.html` / CSS 各所 | Modify | Google Fonts 削除・フォントスタック |
| `.gitignore` | Modify | `frontend/dist-web`・`frontend/src/backend/generated/`・`tmp/` |
| `.github/workflows/pages.yml` | Create | Pages 公開 |
| `PRIVACY.md` | Create | プライバシーポリシー（英日） |
| `build/msix/AppxManifest.xml` / `scripts/build-msix.ps1` / `.github/workflows/msix.yml` | Create | MSIX |
| `docs/store-submission.md` | Create | Partner Center 提出内容の控え |
| `.github/workflows/release.yml` / `README.md` / `CLAUDE.md` | Modify | 案内・ドキュメント |

---

### Task 1: Go — 共用関数の切り出し・web bridge・wasm

**Files:** Create `import_parse.go`, `import_parse_test.go`, `web_bridge.go`, `web_bridge_test.go`, `wasm_main.go`, `scripts/build-wasm.sh`, `scripts/wasm-smoke.mjs`; Modify `app.go`, `d2_render.go`, `d2_render_test.go`, `main.go`, `note_service.go`, `app_test.go`, `note_service_test.go`, `.gitignore`

**Interfaces:**
- Produces: `parseImportFile(name string, data []byte) ([]importedDoc, error)`、`renderD2(source string) (string, error)`、`callWeb(method, argsJSON string) (string, error)`、wasm のグローバル `sirusitaCall(method: string, argsJSON: string, cb: (resultJSON|null, errorMessage|null) => void)`。
  - `RenderD2` の引数 `[source]`、結果は SVG 文字列（JSON 文字列としてエンコード）。
  - `ParseImport` の引数 `[fileName, base64Data]`、結果は `[{title, body, tags, created, modified}]`（`tags` は常に配列）。
- 出力ファイル: `frontend/src/backend/generated/sirusita.wasm` と `frontend/src/backend/generated/wasm_exec.js`。

- [ ] **Step 1: `import_parse.go` を作る** — `app.go` から `importedDoc`・`importFrontMatter`・`parseMarkdownImport` を**そのまま**移し（コメント含む）、以下を追加する:

```go
// parseImportFile は取り込む 1 ファイル分のデータを解析する。
// 名前が .zip なら中の .md / .markdown をすべて（ディレクトリと他の拡張子は無視）、
// それ以外はマークダウン 1 件として扱う。デスクトップ版（app.go）と Web 版
// （web_bridge.go）で共用する。
func parseImportFile(name string, data []byte) ([]importedDoc, error) {
	if !strings.EqualFold(filepath.Ext(name), ".zip") {
		return []importedDoc{parseMarkdownImport(data, name)}, nil
	}
	r, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return nil, err
	}
	docs := make([]importedDoc, 0, len(r.File))
	for _, f := range r.File {
		if f.FileInfo().IsDir() {
			continue
		}
		switch strings.ToLower(filepath.Ext(f.Name)) {
		case ".md", ".markdown":
		default:
			continue
		}
		rc, err := f.Open()
		if err != nil {
			return nil, err
		}
		b, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			return nil, err
		}
		docs = append(docs, parseMarkdownImport(b, f.Name))
	}
	return docs, nil
}
```

（import: `archive/zip`, `bytes`, `io`, `path/filepath`, `strings`, `github.com/adrg/frontmatter`。ZIP は全件解析してから作成するため、途中で壊れたエントリがあればその ZIP からは 1 件も作らない — 従来の「途中まで作成」より安全。）

- [ ] **Step 2: `app.go` を整理** — 先頭に `//go:build !js` と空行を追加。`importZip`・`createFromMarkdown` を削除し、`importPaths` を次に置換:

```go
// importPaths は各パスを解析して新規メモを作成する共通処理。
// .zip は中の .md / .markdown をまとめて取り込む（解析は import_parse.go）。
func (a *App) importPaths(paths []string) ([]Note, error) {
	created := make([]Note, 0, len(paths))
	for _, path := range paths {
		data, err := os.ReadFile(path)
		if err != nil {
			return created, err
		}
		docs, err := parseImportFile(path, data)
		if err != nil {
			return created, err
		}
		for _, doc := range docs {
			note, err := a.NoteService.CreateImported(doc.title, doc.body, doc.tags, doc.created, doc.modified)
			if err != nil {
				return created, err
			}
			created = append(created, note)
		}
	}
	return created, nil
}
```

`OpenURL` の後ろに追加:

```go
// RenderD2 は D2 のソースを SVG 文字列へ変換する（本体は d2_render.go の renderD2）。
// フロントエンドの ```d2 コードブロックから呼び出される。
func (a *App) RenderD2(source string) (string, error) {
	return renderD2(source)
}
```

不要になった import（`archive/zip`, `bytes`, `io`, `frontmatter` など）は削除する。`sanitizeFilename` は app.go に残す。

- [ ] **Step 3: `d2_render.go`** — `func (a *App) RenderD2(source string) (svg string, err error)` を `func renderD2(source string) (svg string, err error)` に変更（本体・recover はそのまま）。冒頭コメントを「Wails に依存しないのでデスクトップ版（App.RenderD2）と Web 版（web_bridge.go）で共用する」旨に更新。`d2_render_test.go` は `a.RenderD2(...)` を `renderD2(...)` に置換し、`App` の生成を削除。

- [ ] **Step 4: ビルドタグ** — `main.go`・`note_service.go`・`app_test.go`・`note_service_test.go` の先頭に `//go:build !js` と空行を追加。

- [ ] **Step 5: `import_parse_test.go`** — `app_test.go` の `TestImportZip` を削除し、代わりに `import_parse_test.go` へ次を作る（`TestParseMarkdownImport*` と `TestContentsLibraryIsValid` は app_test.go に残してよい）:

```go
package main

import (
	"archive/zip"
	"bytes"
	"testing"
)

// zipBytes はテスト用の ZIP をメモリ上に作る。
func zipBytes(t *testing.T, files map[string]string) []byte {
	t.Helper()
	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)
	for name, content := range files {
		w, err := zw.Create(name)
		if err != nil {
			t.Fatalf("zip Create %s: %v", name, err)
		}
		if _, err := w.Write([]byte(content)); err != nil {
			t.Fatalf("zip Write %s: %v", name, err)
		}
	}
	if err := zw.Close(); err != nil {
		t.Fatalf("zip Close: %v", err)
	}
	return buf.Bytes()
}

// ZIP に含まれる .md / .markdown だけを解析し、他の拡張子は無視する。
func TestParseImportFileZip(t *testing.T) {
	data := zipBytes(t, map[string]string{
		"a.md":       "---\ntitle: \"A\"\nsirusita: \"1\"\ncreated: 2025-01-01T00:00:00+09:00\nmodified: 2025-01-02T00:00:00+09:00\n---\n\n本文A\n",
		"sub/b.md":   "# B見出し\n\n本文B\n",
		"readme.txt": "無視されるべき\n",
		"c.markdown": "---\ntitle: \"C\"\n---\n\n本文C\n",
	})
	docs, err := parseImportFile("bundle.ZIP", data)
	if err != nil {
		t.Fatalf("parseImportFile: %v", err)
	}
	if len(docs) != 3 {
		t.Fatalf("件数 = %d, want 3", len(docs))
	}
	byTitle := map[string]importedDoc{}
	for _, d := range docs {
		byTitle[d.title] = d
	}
	for _, want := range []string{"A", "B見出し", "C"} {
		if _, ok := byTitle[want]; !ok {
			t.Errorf("タイトル %q が無い: %v", want, byTitle)
		}
	}
	if a := byTitle["A"]; a.created != "2025-01-01T00:00:00+09:00" || a.modified != "2025-01-02T00:00:00+09:00" {
		t.Errorf("sirusita 形式の日時が引き継がれていない: %+v", a)
	}
}

// .zip 以外は 1 件のマークダウンとして解析する。
func TestParseImportFileMarkdown(t *testing.T) {
	docs, err := parseImportFile("dir/メモ.md", []byte("本文だけ\n"))
	if err != nil {
		t.Fatalf("parseImportFile: %v", err)
	}
	if len(docs) != 1 || docs[0].title != "メモ" || docs[0].body != "本文だけ" {
		t.Errorf("docs = %+v", docs)
	}
}

func TestParseImportFileBrokenZip(t *testing.T) {
	if _, err := parseImportFile("x.zip", []byte("not a zip")); err == nil {
		t.Error("壊れた ZIP でエラーにならない")
	}
}
```

デスクトップ版の取り込み経路が壊れていないことを `app_test.go` に追加して確認する:

```go
// ImportFiles は .md / .zip を取り込み、他の拡張子は無視する。
func TestImportFilesMixed(t *testing.T) {
	app := newTestApp(t)
	dir := t.TempDir()
	mdPath := filepath.Join(dir, "one.md")
	if err := os.WriteFile(mdPath, []byte("# One\n\n本文\n"), 0644); err != nil {
		t.Fatal(err)
	}
	zipPath := filepath.Join(dir, "two.zip")
	if err := os.WriteFile(zipPath, zipBytes(t, map[string]string{"x.md": "# X\n", "y.md": "# Y\n"}), 0644); err != nil {
		t.Fatal(err)
	}
	notes, err := app.ImportFiles([]string{mdPath, zipPath, filepath.Join(dir, "skip.txt")})
	if err != nil {
		t.Fatalf("ImportFiles: %v", err)
	}
	if len(notes) != 3 {
		t.Fatalf("件数 = %d, want 3", len(notes))
	}
	list, err := app.NoteService.ListNotes()
	if err != nil || len(list) != 3 {
		t.Fatalf("ListNotes = %d件, err=%v", len(list), err)
	}
}
```

（`zipBytes` は `import_parse_test.go` にあり、同一パッケージなので app_test.go から使える。app_test.go の不要になった import は削除する。）

- [ ] **Step 6: `web_bridge.go`**:

```go
package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
)

// webImportedDoc は Web 版へ返すインポート解析結果（importedDoc の JSON 版）。
type webImportedDoc struct {
	Title    string   `json:"title"`
	Body     string   `json:"body"`
	Tags     []string `json:"tags"`
	Created  string   `json:"created"`
	Modified string   `json:"modified"`
}

// callWeb は Web 版（wasm_main.go）からの呼び出しを振り分ける。argsJSON は文字列引数の
// JSON 配列、戻り値は結果の JSON 文字列。syscall/js に依存しない形でここに切り出し、
// 通常の go test で検証できるようにしている（wasm_main.go は GOOS=js でしかビルドされない）。
//   - RenderD2    [source]           → SVG 文字列
//   - ParseImport [name, base64Data] → []webImportedDoc
func callWeb(method, argsJSON string) (string, error) {
	var args []string
	if err := json.Unmarshal([]byte(argsJSON), &args); err != nil {
		return "", fmt.Errorf("引数の解析に失敗しました: %w", err)
	}
	arg := func(i int) (string, error) {
		if i >= len(args) {
			return "", fmt.Errorf("%s: 引数が不足しています", method)
		}
		return args[i], nil
	}

	var out any
	switch method {
	case "RenderD2":
		source, err := arg(0)
		if err != nil {
			return "", err
		}
		svg, err := renderD2(source)
		if err != nil {
			return "", err
		}
		out = svg
	case "ParseImport":
		name, err := arg(0)
		if err != nil {
			return "", err
		}
		encoded, err := arg(1)
		if err != nil {
			return "", err
		}
		data, err := base64.StdEncoding.DecodeString(encoded)
		if err != nil {
			return "", fmt.Errorf("ParseImport: データの復号に失敗しました: %w", err)
		}
		docs, err := parseImportFile(name, data)
		if err != nil {
			return "", err
		}
		res := make([]webImportedDoc, 0, len(docs))
		for _, d := range docs {
			tags := d.tags
			if tags == nil {
				tags = []string{}
			}
			res = append(res, webImportedDoc{Title: d.title, Body: d.body, Tags: tags, Created: d.created, Modified: d.modified})
		}
		out = res
	default:
		return "", fmt.Errorf("未知のメソッドです: %s", method)
	}

	data, err := json.Marshal(out)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
```

- [ ] **Step 7: `web_bridge_test.go`**:

```go
package main

import (
	"encoding/base64"
	"encoding/json"
	"strings"
	"testing"
)

func argsJSON(t *testing.T, args ...string) string {
	t.Helper()
	b, err := json.Marshal(args)
	if err != nil {
		t.Fatal(err)
	}
	return string(b)
}

func TestCallWebRenderD2(t *testing.T) {
	out, err := callWeb("RenderD2", argsJSON(t, "x -> y"))
	if err != nil {
		t.Fatalf("callWeb: %v", err)
	}
	var svg string
	if err := json.Unmarshal([]byte(out), &svg); err != nil {
		t.Fatalf("結果が JSON 文字列ではない: %v", err)
	}
	if !strings.Contains(svg, "<svg") {
		t.Errorf("SVG ではない: %.80s", svg)
	}
}

func TestCallWebParseImport(t *testing.T) {
	md := "---\ntitle: \"T\"\ntags:\n  - \"a / b\"\nsirusita: \"1\"\ncreated: 2025-01-01T00:00:00+09:00\nmodified: 2025-01-02T00:00:00+09:00\n---\n\n本文\n"
	out, err := callWeb("ParseImport", argsJSON(t, "t.md", base64.StdEncoding.EncodeToString([]byte(md))))
	if err != nil {
		t.Fatalf("callWeb: %v", err)
	}
	var docs []webImportedDoc
	if err := json.Unmarshal([]byte(out), &docs); err != nil {
		t.Fatal(err)
	}
	if len(docs) != 1 {
		t.Fatalf("件数 = %d", len(docs))
	}
	d := docs[0]
	if d.Title != "T" || d.Body != "本文" || len(d.Tags) != 1 || d.Created != "2025-01-01T00:00:00+09:00" || d.Modified != "2025-01-02T00:00:00+09:00" {
		t.Errorf("doc = %+v", d)
	}
}

// タグが無いときも JSON では空配列（null ではない）。
func TestCallWebParseImportEmptyTags(t *testing.T) {
	out, err := callWeb("ParseImport", argsJSON(t, "x.md", base64.StdEncoding.EncodeToString([]byte("# X\n"))))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(out, `"tags":[]`) {
		t.Errorf("tags が空配列でない: %s", out)
	}
}

func TestCallWebErrors(t *testing.T) {
	cases := []struct{ method, args string }{
		{"Nope", `[]`},
		{"RenderD2", `[]`},
		{"ParseImport", `["x.md"]`},
		{"ParseImport", `["x.md","%%%"]`},
		{"RenderD2", `not json`},
		{"RenderD2", `["a -> b {"]`},
	}
	for _, c := range cases {
		if _, err := callWeb(c.method, c.args); err == nil {
			t.Errorf("callWeb(%q, %s) にエラーが無い", c.method, c.args)
		}
	}
}
```

- [ ] **Step 8: `wasm_main.go`**:

```go
//go:build js && wasm

package main

import "syscall/js"

// Web 版（GitHub Pages）のエントリポイント。GOOS=js GOARCH=wasm でビルドし、
// フロントエンドの Web Worker（frontend/src/backend/sirusita.worker.js）内で動かす。
//
// グローバル関数 sirusitaCall(method, argsJSON, callback) を登録する。
// 結果は callback(resultJSON, errorMessage) で非同期に返す。
// js.FuncOf のコールバック内でブロックするとデッドロックするため
// （syscall/js の制約）、処理は必ず別 goroutine で行う。
func main() {
	js.Global().Set("sirusitaCall", js.FuncOf(func(this js.Value, args []js.Value) any {
		method := args[0].String()
		argsJSON := args[1].String()
		callback := args[2]
		go func() {
			result, err := callWeb(method, argsJSON)
			if err != nil {
				callback.Invoke(js.Null(), err.Error())
				return
			}
			callback.Invoke(result, js.Null())
		}()
		return nil
	}))
	select {}
}
```

- [ ] **Step 9: `scripts/build-wasm.sh`**（実行権限を付ける: `chmod +x`）:

```sh
#!/bin/sh
# Web 版で使う Go の wasm（D2 描画・インポート解析。wasm_main.go）をビルドし、
# Go に付属するローダー wasm_exec.js と一緒に frontend/src/backend/generated/ へ出力する。
# 出力は生成物なので .gitignore 済み。`npm run build:web` から呼ばれる。
set -eu
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/frontend/src/backend/generated"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"
GOOS=js GOARCH=wasm go build -trimpath -ldflags="-s -w" -o "$OUT_DIR/sirusita.wasm" .
# wasm_exec.js はビルドに使った Go と同じバージョンのものでなければならない
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" "$OUT_DIR/wasm_exec.js"
```

- [ ] **Step 10: `scripts/wasm-smoke.mjs`**:

```js
// Web 版の wasm（scripts/build-wasm.sh の出力）を Node で起動し、
// RenderD2 と ParseImport が動くことを確かめる。
//   sh scripts/build-wasm.sh && node scripts/wasm-smoke.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../frontend/src/backend/generated/', import.meta.url);
await import(new URL('wasm_exec.js', dir).href); // globalThis.Go を定義する
const go = new globalThis.Go();
const { instance } = await WebAssembly.instantiate(readFileSync(new URL('sirusita.wasm', dir)), go.importObject);
go.run(instance); // main() が select{} でブロックした時点で sirusitaCall は登録済み

const call = (method, args) =>
  new Promise((resolve, reject) =>
    globalThis.sirusitaCall(method, JSON.stringify(args), (result, error) =>
      error != null ? reject(new Error(error)) : resolve(JSON.parse(result))));

const svg = await call('RenderD2', ['a -> b']);
assert.ok(svg.includes('<svg'), 'RenderD2 が SVG を返さない');

const md = Buffer.from('# タイトル\n\n本文\n').toString('base64');
const docs = await call('ParseImport', ['x.md', md]);
assert.equal(docs.length, 1);
assert.equal(docs[0].title, 'タイトル');
assert.deepEqual(docs[0].tags, []);

await assert.rejects(call('Nope', []));
console.log('wasm smoke: ok');
process.exit(0);
```

- [ ] **Step 11: `.gitignore`** に追加（`tmp/` はユーザーが追加済み。重複させない）:

```
frontend/dist-web
frontend/src/backend/generated/
```

- [ ] **Step 12: 検証**

```bash
cd /workspaces/sirusita && gofmt -l . && go vet ./... && go test ./...
GOOS=js GOARCH=wasm go vet .
sh scripts/build-wasm.sh && node scripts/wasm-smoke.mjs   # → "wasm smoke: ok"
```

Expected: gofmt 出力なし、全テスト PASS、`wasm smoke: ok`。（D2 の `WARN missing slog.Logger` のログは既知で無害）

- [ ] **Step 13: コミット**（`git status` で generated/ が含まれないことを確認）

```bash
git add import_parse.go import_parse_test.go web_bridge.go web_bridge_test.go wasm_main.go scripts/build-wasm.sh scripts/wasm-smoke.mjs app.go d2_render.go d2_render_test.go main.go note_service.go app_test.go note_service_test.go .gitignore
git commit -m "feat: インポート解析と D2 描画を共用化し、Web 版用の wasm を追加

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Web 版のメモ保存（noteLogic.js / webNotes.js）

**Files:** Create `frontend/src/backend/noteLogic.js`, `frontend/src/backend/noteLogic.test.js`, `frontend/src/backend/webNotes.js`

**Interfaces:**
- Consumes: `frontend/src/tagTree.js` の `normalizeTag(tag)`, `renameTags(tags, old, new)`。
- Produces（`noteLogic.js`）: `UUID_RE`, `normalizeTags(tags)`, `formatRFC3339(date)`, `buildNote({id,title,body,tags,created,modified}, now)`, `applyUpdate(existing, {title,body,tags}, now)`, `toMeta(note)`, `sortByModifiedDesc(metas)`, `collectTags(notes)`, `planRename(notes, oldTag, newTag)`, `exportMarkdown(title, body)`, `sanitizeFilename(name)`, `exportFilename(title)`。
- Produces（`webNotes.js`、すべて async）: `ListNotes()`, `GetNote(id)`, `CreateNote(title, body, tags)`, `CreateImported(title, body, tags, created, modified)`, `UpdateNote(id, title, body, tags)`, `DeleteNote(id)`, `ListTags()`, `RenameTag(oldTag, newTag)`。戻り値の形は Go の `Note`（`{id,title,tags,created,modified,body}`）/ `NoteMeta`（body なし）と同じ。

- [ ] **Step 1: 失敗するテスト** — `frontend/src/backend/noteLogic.test.js`:

```js
// node --test frontend/src/backend/noteLogic.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UUID_RE, normalizeTags, formatRFC3339, buildNote, applyUpdate, toMeta,
  sortByModifiedDesc, collectTags, planRename, exportMarkdown, sanitizeFilename, exportFilename,
} from './noteLogic.js';

const NOW = new Date(2026, 9, 7, 9, 5, 3); // ローカル時刻 2026-10-07 09:05:03

test('UUID_RE', () => {
  assert.ok(UUID_RE.test('0b6f9a8e-1c2d-4e5f-8a9b-0c1d2e3f4a5b'));
  assert.ok(!UUID_RE.test('../etc/passwd'));
});

test('normalizeTags は正規化・空除去・重複除去（出現順）', () => {
  assert.deepEqual(normalizeTags(['b', ' a / x ', '', '/', 'a/x', 'b']), ['b', 'a/x']);
  assert.deepEqual(normalizeTags(null), []);
});

test('formatRFC3339 は Go の time.RFC3339 と同じ形', () => {
  const s = formatRFC3339(NOW);
  assert.match(s, /^2026-10-07T09:05:03(Z|[+-]\d{2}:\d{2})$/);
  const off = -NOW.getTimezoneOffset();
  if (off === 0) assert.ok(s.endsWith('Z'));
});

test('buildNote は日時が空なら現在時刻、タグは正規化', () => {
  const n = buildNote({ id: 'id1', title: 't', body: 'b', tags: [' a / b '], created: '', modified: '' }, NOW);
  assert.equal(n.created, formatRFC3339(NOW));
  assert.equal(n.modified, n.created);
  assert.deepEqual(n.tags, ['a/b']);
  const kept = buildNote({ id: 'id2', title: 't', body: '', tags: null, created: 'C', modified: 'M' }, NOW);
  assert.equal(kept.created, 'C');
  assert.equal(kept.modified, 'M');
  assert.deepEqual(kept.tags, []);
});

test('applyUpdate は created を保持し modified を更新', () => {
  const ex = { id: 'x', title: 'old', tags: [], created: 'C0', modified: 'M0', body: 'old' };
  const u = applyUpdate(ex, { title: 'new', body: 'nb', tags: ['x//y'] }, NOW);
  assert.deepEqual(u, { id: 'x', title: 'new', tags: ['x/y'], created: 'C0', modified: formatRFC3339(NOW), body: 'nb' });
});

test('toMeta は body を除く', () => {
  assert.deepEqual(toMeta({ id: 'x', title: 't', tags: ['a'], created: 'c', modified: 'm', body: 'b' }),
    { id: 'x', title: 't', tags: ['a'], created: 'c', modified: 'm' });
});

test('sortByModifiedDesc', () => {
  const r = sortByModifiedDesc([{ modified: '2026-01-01' }, { modified: '2026-03-01' }, { modified: '2026-02-01' }]);
  assert.deepEqual(r.map(n => n.modified), ['2026-03-01', '2026-02-01', '2026-01-01']);
});

test('collectTags は重複除去してソート', () => {
  assert.deepEqual(collectTags([{ tags: ['b', 'a'] }, { tags: ['a', ' c '] }, { tags: [] }]), ['a', 'b', 'c']);
});

test('planRename は配下ごと付け替え・統合・日時保持、無関係は含めない', () => {
  const notes = [
    { id: '1', tags: ['a', 'other'], created: 'c1', modified: 'm1' },
    { id: '2', tags: ['a/x', '図表/a/x'], created: 'c2', modified: 'm2' },
    { id: '3', tags: ['ab'], created: 'c3', modified: 'm3' },
  ];
  const changed = planRename(notes, 'a', '図表/a');
  assert.deepEqual(changed.map(n => n.id), ['1', '2']);
  assert.deepEqual(changed[0].tags, ['図表/a', 'other']);
  assert.deepEqual(changed[1].tags, ['図表/a/x']);
  assert.equal(changed[0].modified, 'm1');
  assert.deepEqual(planRename(notes, 'a', 'a'), []);
  assert.throws(() => planRename(notes, '', 'b'));
  assert.throws(() => planRename(notes, 'a', ' / '));
});

test('exportMarkdown / exportFilename', () => {
  assert.equal(exportMarkdown('T', 'body'), '# T\n\nbody\n');
  assert.equal(exportMarkdown('  ', 'body\n'), 'body\n');
  assert.equal(sanitizeFilename(' a/b:c*?"<>|\td '), 'a-b-c------ d');
  assert.equal(exportFilename(''), 'note.md');
  assert.equal(exportFilename('メモ/1'), 'メモ-1.md');
});
```

- [ ] **Step 2: 失敗を確認** — `node --test frontend/src/backend/noteLogic.test.js` → `Cannot find module`。

- [ ] **Step 3: `noteLogic.js`**:

```js
// Web 版のメモ保存ロジック（note_service.go / app.go と同じ振る舞い）。
// IndexedDB に依存しない純粋関数だけを置き、node --test で検証する（webNotes.js が使う）。
import { normalizeTag, renameTags } from '../tagTree.js';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// note_service.go の normalizeTags と同じ（正規化・空除去・重複除去・出現順保持）。
export function normalizeTags(tags) {
  const out = [];
  const seen = new Set();
  for (const tag of tags || []) {
    const t = normalizeTag(tag);
    if (t === '' || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

const pad = (n) => String(n).padStart(2, '0');

// Go の time.Now().Format(time.RFC3339) と同じ形（秒精度・ローカルのオフセット。UTC は "Z"）。
// 一覧の並び（modified の文字列比較）をデスクトップ版と揃えるため。
export function formatRFC3339(date) {
  const off = -date.getTimezoneOffset();
  const tz = off === 0 ? 'Z' : `${off > 0 ? '+' : '-'}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${tz}`;
}

// CreateImported 相当。created / modified が空なら現在時刻。
export function buildNote({ id, title, body, tags, created, modified }, now) {
  const ts = formatRFC3339(now);
  return { id, title: title ?? '', tags: normalizeTags(tags), created: created || ts, modified: modified || ts, body: body ?? '' };
}

// UpdateNote 相当。created は保持し、modified を現在時刻にする。
export function applyUpdate(existing, { title, body, tags }, now) {
  return { id: existing.id, title: title ?? '', tags: normalizeTags(tags), created: existing.created, modified: formatRFC3339(now), body: body ?? '' };
}

export function toMeta(note) {
  const { body, ...meta } = note;
  return meta;
}

// ListNotes と同じく modified の降順（文字列比較）。
export function sortByModifiedDesc(metas) {
  return [...metas].sort((a, b) => (a.modified < b.modified ? 1 : a.modified > b.modified ? -1 : 0));
}

// ListTags 相当（重複除去・ソート）。
export function collectTags(notes) {
  return [...new Set(notes.flatMap(n => normalizeTags(n.tags)))].sort();
}

// RenameTag 相当。タグが変わるメモだけを（日時・本文はそのまま）新しい値で返す。
export function planRename(notes, oldTag, newTag) {
  const from = normalizeTag(oldTag);
  const to = normalizeTag(newTag);
  if (from === '' || to === '') throw new Error('tag must not be empty');
  if (from === to) return [];
  const changed = [];
  for (const note of notes) {
    const tags = normalizeTags(note.tags);
    const renamed = normalizeTags(renameTags(tags, from, to));
    if (renamed.length !== tags.length || renamed.some((t, i) => t !== tags[i])) {
      changed.push({ ...note, tags: renamed });
    }
  }
  return changed;
}

// app.go の ExportNote と同じ本文（タイトルを H1 として付け、末尾は改行）。
export function exportMarkdown(title, body) {
  let s = '';
  if (title.trim() !== '') s += `# ${title}\n\n`;
  s += body;
  if (!s.endsWith('\n')) s += '\n';
  return s;
}

// app.go の sanitizeFilename と同じ置換。
export function sanitizeFilename(name) {
  return name.trim().replace(/[/\\:*?"<>|]/g, '-').replace(/[\n\r\t]/g, ' ').trim();
}

export function exportFilename(title) {
  const name = sanitizeFilename(title);
  return (name === '' ? 'note' : name) + '.md';
}
```

- [ ] **Step 4: テスト通過** — `node --test frontend/src/backend/noteLogic.test.js` → fail 0。既存 `node --test frontend/src/tagTree.test.js` も fail 0。

- [ ] **Step 5: `webNotes.js`**:

```js
// Web 版のメモ保存（デスクトップ版の note_service.go に相当）。IndexedDB に保存する。
// localStorage は容量が約 5MB しかなく、メモ本文を丸ごと置くと溢れるため使わない。
// 振る舞いは noteLogic.js（= note_service.go と同じ規則）に従う。
import {
  UUID_RE, normalizeTags, buildNote, applyUpdate, toMeta, sortByModifiedDesc, collectTags, planRename,
} from './noteLogic.js';

const DB_NAME = 'sirusita';
const STORE = 'notes';

let dbPromise = null;
function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    // 失敗したら次回の呼び出しで開き直せるようにする
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}

// 1 トランザクションを実行する。fn がリクエストを返せばその結果を、返さなければ undefined を、
// トランザクション完了後に返す（書き込みは完了まで待ってから成功とみなす）。
async function run(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    let value;
    if (req) req.onsuccess = () => { value = req.result; };
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function checkId(id) {
  if (typeof id !== 'string' || !UUID_RE.test(id)) throw new Error(`invalid note ID: ${id}`);
}

// 読み込み時の整形（GetNote と同じく、タグを正規化し本文の前後の空白を除く）。
function toNote(rec) {
  return { ...rec, tags: normalizeTags(rec.tags), body: (rec.body ?? '').trim() };
}

async function allNotes() {
  const all = (await run('readonly', (s) => s.getAll())) ?? [];
  return all.filter((r) => UUID_RE.test(r.id)).map(toNote);
}

export async function ListNotes() {
  return sortByModifiedDesc((await allNotes()).map(toMeta));
}

export async function GetNote(id) {
  checkId(id);
  const rec = await run('readonly', (s) => s.get(id));
  if (!rec) throw new Error(`note not found: ${id}`);
  return toNote(rec);
}

export async function CreateImported(title, body, tags, created, modified) {
  const note = buildNote({ id: crypto.randomUUID(), title, body, tags, created, modified }, new Date());
  await run('readwrite', (s) => s.put(note));
  return note;
}

export function CreateNote(title, body, tags) {
  return CreateImported(title, body, tags, '', '');
}

export async function UpdateNote(id, title, body, tags) {
  const existing = await GetNote(id);
  const note = applyUpdate(existing, { title, body, tags }, new Date());
  await run('readwrite', (s) => s.put(note));
  return note;
}

export async function DeleteNote(id) {
  await GetNote(id); // 存在しなければ "note not found"
  await run('readwrite', (s) => s.delete(id));
}

export async function ListTags() {
  return collectTags(await allNotes());
}

export async function RenameTag(oldTag, newTag) {
  const changed = planRename(await allNotes(), oldTag, newTag);
  if (changed.length > 0) {
    await run('readwrite', (s) => {
      for (const note of changed) s.put(note);
    });
  }
  return changed.length;
}
```

- [ ] **Step 6: コミット**

```bash
git add frontend/src/backend/noteLogic.js frontend/src/backend/noteLogic.test.js frontend/src/backend/webNotes.js
git commit -m "feat: Web 版のメモ保存（IndexedDB）を追加

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: バックエンドの切り替え（`$backend`）と wasm の遅延読み込み

**Files:** Create `frontend/src/backend/wails.js`, `frontend/src/backend/wasm.js`, `frontend/src/backend/sirusita.worker.js`, `frontend/src/backend/web.js`; Modify `frontend/vite.config.js`, `frontend/package.json`

**Interfaces:**
- Consumes: Task 1 の wasm（`generated/sirusita.wasm`・`generated/wasm_exec.js`・`sirusitaCall`）、Task 2 の `webNotes.js` / `noteLogic.js`。
- Produces（`$backend` = `wails.js` / `web.js`、同じ名前・同じ形）:
  `ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag, ExportNote(title, body): Promise<string>, ImportNote(): Promise<Note[]|null>, RenderD2(source): Promise<string>, OpenURL(url), OnImportDrop(cb: (runImport: () => Promise<Note[]|null>) => void), OffImportDrop(), IS_WEB: boolean`。

- [ ] **Step 1: `wails.js`**:

```js
// デスクトップ版（Wails）のバックエンド。Go のバインディングをそのまま公開する。
// Web 版は web.js で、どちらを使うかは vite.config.js の '$backend' エイリアスで
// ビルド時に切り替える（App.svelte などは '$backend' から import するだけ）。
import { ImportFiles } from '../../wailsjs/go/main/App';
import { OnFileDrop, OnFileDropOff } from '../../wailsjs/runtime/runtime';

export { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from '../../wailsjs/go/main/NoteService';
export { ExportNote, ImportNote, RenderD2, OpenURL } from '../../wailsjs/go/main/App';

// Web 版にだけ出すもの（ブラウザ保存の案内など）の切り替えに使う。
export const IS_WEB = false;

// ファイルのドラッグ&ドロップ取り込み。cb には「取り込みを実行する関数」を渡す
// （App 側で未保存の本文を保存してから実行できるようにするため）。
export function OnImportDrop(cb) {
  // 第 2 引数 false でウィンドウ全体をドロップ対象にする
  OnFileDrop((x, y, paths) => {
    if (paths && paths.length > 0) cb(() => ImportFiles(paths));
  }, false);
}

export function OffImportDrop() {
  OnFileDropOff();
}
```

- [ ] **Step 2: `sirusita.worker.js`**:

```js
// Web 版の wasm（wasm_main.go。D2 描画・インポート解析）を動かす Worker。
// コンパイル済みの WebAssembly.Module はメインスレッドから 'init' で受け取る
// （Worker を作り直すたびにダウンロード・コンパイルし直さないため。wasm.js 参照）。
import './generated/wasm_exec.js';

let ready = null;

async function start(module) {
  const go = new Go();
  const instance = await WebAssembly.instantiate(module, go.importObject);
  // go.run() は main() がブロックするまで同期的に実行するので、戻った時点で
  // sirusitaCall は登録済み。run 自体の Promise はプロセス終了まで解決しない。
  go.run(instance);
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === 'init') {
    ready = start(msg.module);
    return;
  }
  try {
    await ready;
  } catch (err) {
    self.postMessage({ id: msg.id, error: `wasm を起動できませんでした: ${err?.message || err}` });
    return;
  }
  self.sirusitaCall(msg.method, JSON.stringify(msg.args), (result, error) => {
    self.postMessage({ id: msg.id, result, error });
  });
};
```

- [ ] **Step 3: `wasm.js`**:

```js
// Web 版: Go を wasm にしたもの（wasm_main.go）を Worker で動かし、D2 描画と
// インポート解析に使う。wasm は gzip 後でも約 7MB あるため、最初に呼ばれたときに
// 初めてダウンロードする（メモを開くだけなら読み込まない）。
import wasmUrl from './generated/sirusita.wasm?url';
import SirusitaWorker from './sirusita.worker.js?worker';

// wasm にはプリエンプションが無く Go 側で打ち切れないため、メインスレッドで
// 時間を区切り、超えたら Worker ごと作り直す。
const CALL_TIMEOUT_MS = 30000;

let modulePromise = null;
function compiledModule() {
  if (!modulePromise) {
    modulePromise = (async () => {
      try {
        return await WebAssembly.compileStreaming(fetch(wasmUrl));
      } catch {
        // MIME タイプが application/wasm でないサーバー向けのフォールバック
        const res = await fetch(wasmUrl);
        return WebAssembly.compile(await res.arrayBuffer());
      }
    })();
    // 失敗したら次回の呼び出しで取得し直せるようにする
    modulePromise.catch(() => {
      modulePromise = null;
    });
  }
  return modulePromise;
}

let worker = null;
const pending = new Map();
let nextId = 0;

// Worker を破棄し、応答待ちの呼び出しをすべて err で失敗させる。
function resetWorker(err) {
  if (worker) worker.terminate();
  worker = null;
  const list = [...pending.values()];
  pending.clear();
  for (const p of list) {
    clearTimeout(p.timer);
    p.reject(err);
  }
}

async function ensureWorker() {
  if (worker) return worker;
  const module = await compiledModule();
  if (worker) return worker;
  const w = new SirusitaWorker();
  w.onmessage = (e) => {
    const { id, result, error } = e.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    clearTimeout(p.timer);
    if (error != null) p.reject(new Error(error));
    else p.resolve(JSON.parse(result));
  };
  w.onerror = () => resetWorker(new Error('wasm の実行中にエラーが発生しました'));
  w.postMessage({ type: 'init', module });
  worker = w;
  return w;
}

// method を wasm で実行する。args は文字列の配列（web_bridge.go の callWeb 参照）。
export async function callWasm(method, args) {
  const w = await ensureWorker();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(
      () => resetWorker(new Error('処理がタイムアウトしました（30 秒以内に完了しませんでした）')),
      CALL_TIMEOUT_MS,
    );
    pending.set(id, { resolve, reject, timer });
    w.postMessage({ type: 'call', id, method, args });
  });
}
```

- [ ] **Step 4: `web.js`**:

```js
// Web 版（GitHub Pages）のバックエンド。wails.js と同じ関数を同じ形で提供する。
// - メモ: IndexedDB（webNotes.js）
// - D2 描画・インポート解析: Go を wasm にしたもの（wasm.js。必要になったときだけ読み込む）
// - インポート: <input type="file"> / ウィンドウへのドロップ
// - エクスポート: .md ファイルのダウンロード
import { CreateImported } from './webNotes.js';
import { callWasm } from './wasm.js';
import { exportMarkdown, exportFilename } from './noteLogic.js';

export { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from './webNotes.js';

export const IS_WEB = true;

const IMPORT_EXTS = ['.md', '.markdown', '.zip'];
const isImportable = (name) => IMPORT_EXTS.some((ext) => name.toLowerCase().endsWith(ext));

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

// .md / .markdown / .zip を取り込む（他は無視）。解析は wasm（app.go と同じ規則）。
async function importFiles(files) {
  const created = [];
  for (const file of files) {
    if (!isImportable(file.name)) continue;
    const docs = await callWasm('ParseImport', [file.name, toBase64(await file.arrayBuffer())]);
    for (const d of docs) {
      created.push(await CreateImported(d.title, d.body, d.tags, d.created, d.modified));
    }
  }
  return created;
}

export function ImportNote() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.md,.markdown,.zip';
    input.addEventListener('cancel', () => resolve([]));
    input.addEventListener('change', () => {
      importFiles([...(input.files || [])]).then(resolve, reject);
    });
    input.click();
  });
}

// .md をダウンロードさせ、ファイル名を返す（デスクトップ版は保存先パスを返す）。
export async function ExportNote(title, body) {
  const name = exportFilename(title || '');
  const blob = new Blob([exportMarkdown(title || '', body || '')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return name;
}

export function RenderD2(source) {
  return callWasm('RenderD2', [source]);
}

export async function OpenURL(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

let dropHandlers = null;

export function OnImportDrop(cb) {
  OffImportDrop();
  const over = (e) => {
    if (e.dataTransfer?.types?.includes('Files')) e.preventDefault();
  };
  const drop = (e) => {
    const files = [...(e.dataTransfer?.files || [])];
    if (files.length === 0) return;
    e.preventDefault();
    cb(() => importFiles(files));
  };
  window.addEventListener('dragover', over);
  window.addEventListener('drop', drop);
  dropHandlers = { over, drop };
}

export function OffImportDrop() {
  if (!dropHandlers) return;
  window.removeEventListener('dragover', dropHandlers.over);
  window.removeEventListener('drop', dropHandlers.drop);
  dropHandlers = null;
}
```

- [ ] **Step 5: `vite.config.js`** を置換:

```js
import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from 'node:url'

// `--mode web` で Web 版（GitHub Pages）をビルドする。それ以外はデスクトップ版（Wails）。
// App.svelte などは '$backend' から import し、ここでどちらの実装を使うか切り替える。
export default defineConfig(({mode}) => {
  const web = mode === 'web'
  return {
    plugins: [tailwindcss(), svelte()],
    // 独自ドメインのルートでも github.io のサブパスでも動くよう相対パスにする
    base: web ? './' : '/',
    resolve: {
      alias: {
        $backend: fileURLToPath(new URL(web ? './src/backend/web.js' : './src/backend/wails.js', import.meta.url)),
      },
    },
    build: {
      // Wails が go:embed する frontend/dist を上書きしないよう出力先を分ける
      outDir: web ? 'dist-web' : 'dist',
    },
  }
})
```

- [ ] **Step 6: `package.json` の scripts** に追加（既存の dev/build/preview は維持）:

```json
    "build:wasm": "sh ../scripts/build-wasm.sh",
    "dev:web": "npm run build:wasm && vite --mode web",
    "build:web": "npm run build:wasm && vite build --mode web",
    "preview:web": "vite preview --mode web"
```

- [ ] **Step 7: 検証** — この時点ではまだ UI が `$backend` を使っていないが、両ビルドが通ることを確認する:

```bash
cd /workspaces/sirusita/frontend && npm run build && npm run build:web
ls dist-web/assets | grep -E '\.wasm$'   # wasm が出力されていること
cd .. && node --test frontend/src/tagTree.test.js frontend/src/backend/noteLogic.test.js
```

- [ ] **Step 8: コミット**

```bash
git add frontend/src/backend/wails.js frontend/src/backend/wasm.js frontend/src/backend/sirusita.worker.js frontend/src/backend/web.js frontend/vite.config.js frontend/package.json
git commit -m "feat: デスクトップ版と Web 版のバックエンドを \$backend で切り替える

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: UI を `$backend` へ・Web 版の案内・フォント

**Files:** Create `frontend/src/links.js`; Modify `frontend/src/App.svelte`, `frontend/src/Preview.svelte`, `frontend/src/Sidebar.svelte`, `frontend/index.html`, `frontend/src/style.css`, `frontend/src/Editor.svelte`, `frontend/src/NoteToolbar.svelte`, `frontend/src/Toc.svelte`

**Interfaces:**
- Consumes: Task 3 の `$backend` API。
- Produces: `frontend/src/links.js` の `STORE_URL`（現在は `''`）。

- [ ] **Step 1: `links.js`**:

```js
// 外部への案内リンク。
// Microsoft Store のページ（https://apps.microsoft.com/detail/9PPT0S6GKBLW）は製品が
// Store で公開されるまで開けないため、公開を確認してから設定する（空のあいだは非表示）。
export const STORE_URL = '';
```

- [ ] **Step 2: `App.svelte` の import** — 次の 3 行

```js
  import { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from '../wailsjs/go/main/NoteService';
  import { ExportNote, ImportNote, ImportFiles } from '../wailsjs/go/main/App';
  import { OnFileDrop, OnFileDropOff } from '../wailsjs/runtime/runtime';
```

を次に置換:

```js
  import {
    ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag,
    ExportNote, ImportNote, OnImportDrop, OffImportDrop,
  } from '$backend';
```

`onMount` 内の

```js
    // マークダウンファイルをウィンドウへドラッグ&ドロップで取り込む
    // （第2引数 false でウィンドウ全体をドロップ対象にする）
    OnFileDrop((x, y, paths) => { handleFileDrop(paths); }, false);
```

を

```js
    // マークダウン / ZIP をウィンドウへドラッグ&ドロップで取り込む
    OnImportDrop(handleFileDrop);
```

に、`onDestroy` の `OnFileDropOff();` を `OffImportDrop();` に置換。`handleFileDrop` を次に置換:

```js
  // runImport は取り込みを実行する関数（$backend の OnImportDrop 参照）。
  async function handleFileDrop(runImport) {
    await flushPendingSave();
    try {
      const imported = await runImport();
      if (imported && imported.length > 0) {
        await refreshList();
        selectedNote = imported[imported.length - 1];
        navView('edit');
        showToast(imported.length + '件のマークダウンをインポートしました');
      } else {
        showToast('マークダウンファイル (.md) が見つかりませんでした');
      }
    } catch (err) {
      showToast('インポートに失敗しました');
    }
  }
```

- [ ] **Step 3: `Preview.svelte`** — `import { OpenURL, RenderD2 } from '../wailsjs/go/main/App';` を `import { OpenURL, RenderD2 } from '$backend';` に置換。

- [ ] **Step 4: `Sidebar.svelte` に Web 版の案内** — script に追加:

```js
  import { IS_WEB } from '$backend';
  import { STORE_URL } from './links.js';
```

`</Accordion>` の直後（Modal の前）に追加:

```svelte
  {#if IS_WEB}
    <div class="web-note">
      <p>メモはこのブラウザ内（IndexedDB）にだけ保存されます。サイトデータを消去すると失われるので、必要なメモはエクスポートしてください。</p>
      {#if STORE_URL}
        <a href={STORE_URL} target="_blank" rel="noopener noreferrer" title="Microsoft Store を開きます">Windows アプリ版（Microsoft Store） ↗</a>
      {/if}
    </div>
  {/if}
```

style に追加:

```css
  .web-note {
    margin-top: 16px;
    padding: 8px;
    border-top: 1px solid #333333;
    font-size: 11px;
    line-height: 1.6;
    color: #888888;
  }
  .web-note a {
    display: inline-block;
    margin-top: 6px;
    color: #4fa3e0;
  }
```

- [ ] **Step 5: フォント** — `frontend/index.html` の Google Fonts の `<link>` 3 行（`preconnect` ×2 と `css2?family=...`）を削除。フォント指定を置換する（外部 CDN を使わず OS のフォントに任せる）:
  - `"Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`（style.css）→
    `-apple-system, BlinkMacSystemFont, "Segoe UI", "Yu Gothic UI", Meiryo, "Hiragino Sans", Roboto, sans-serif`
  - 各 `.svelte` の `font-family: "Noto Sans JP", sans-serif;` → `font-family: inherit;`
  - `Preview.svelte` の `"Source Code Pro", "SFMono-Regular", Consolas, monospace` → `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`
  - `Editor.svelte` の `fontFamily: '"Source Code Pro", "SFMono-Regular", ...'` → `fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'`
  - 確認: `grep -rn "Noto Sans JP\|Source Code Pro\|googleapis\|gstatic" frontend/index.html frontend/src` が 0 件。

- [ ] **Step 6: 検証**

```bash
cd /workspaces/sirusita && grep -rn "wailsjs" frontend/src --include=*.svelte   # 0 件（wailsjs を直接 import しない）
cd frontend && npm run build && npm run build:web     # 既知の警告以外が増えないこと
cd .. && go test ./... && node --test frontend/src/tagTree.test.js frontend/src/backend/noteLogic.test.js
```

既知の警告: flowbite Datepicker の sourcemap、chunk サイズ、`App.svelte` のスプリッター div と削除確認モーダルの a11y、`Preview.svelte` のクリック可能な div の a11y。

- [ ] **Step 7: ブラウザでの確認（可能なら）** — `npx vite preview --mode web --port 4173`（`frontend/` で）を起動し、Chromium（`playwright-core` は依存に**追加しない**。`npx -y playwright-core` や一時ディレクトリでの利用、または利用不可なら省略して報告）で次を確認: 新規作成→本文入力→リロード後も残る、タグ付け→ツリー表示、`contents/` の .md を ZIP 化してインポート、D2 ブロックを含むメモで SVG が表示される、エクスポートでダウンロードが起きる。実施できなければ「未実施」と明記する。

- [ ] **Step 8: コミット**

```bash
git add frontend/src/links.js frontend/src/App.svelte frontend/src/Preview.svelte frontend/src/Sidebar.svelte frontend/index.html frontend/src/style.css frontend/src/Editor.svelte frontend/src/NoteToolbar.svelte frontend/src/Toc.svelte
git commit -m "feat: 画面を \$backend 経由にし、Web 版の案内を追加・Google Fonts を廃止

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: GitHub Pages の公開ワークフローとプライバシーポリシー

**Files:** Create `.github/workflows/pages.yml`, `PRIVACY.md`

- [ ] **Step 1: `.github/workflows/pages.yml`**:

```yaml
name: Deploy Web to GitHub Pages

# main への push で Web 版（Svelte のフロントエンド + Go を wasm にした D2 描画・インポート解析）を
# ビルドし、GitHub Pages（https://sirusita.e17.click/）へ公開する。
# デスクトップ版の release.yml / msix.yml とは独立している。
on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# 公開が重なったときは後から来たものを待たせる（実行中の公開は中断しない）
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Go
        uses: actions/setup-go@v7
        with:
          go-version: '1.23'

      - name: Setup Node
        uses: actions/setup-node@v7
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      # go test は Wails（GTK/WebKit の cgo）と frontend/dist を要求するためここでは
      # 実行しない（release.yml と開発用コンテナで実行する）。wasm 向けの vet のみ行う。
      - name: Vet wasm build
        run: GOOS=js GOARCH=wasm go vet .

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Unit tests (JS)
        run: node --test frontend/src/tagTree.test.js frontend/src/backend/noteLogic.test.js

      - name: Build web
        working-directory: frontend
        run: npm run build:web

      # 著作権表示の保持が再頒布条件なので、ライセンス表示物を公開物に同梱する。
      - name: Add license files
        run: cp LICENSE THIRD_PARTY_LICENSES.md PRIVACY.md frontend/dist-web/

      - name: Configure Pages
        uses: actions/configure-pages@v6

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: frontend/dist-web

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

（`frontend/package-lock.json` が存在することを確認する。無ければ `cache` 2 行を削除。`release.yml` の Node / Go と揃っていることも確認する。）

- [ ] **Step 2: `PRIVACY.md`** — `/workspaces/shiboq/PRIVACY.md` と同じ構成（English / 日本語、最終更新日 2026-10-07）で、sirusita に合わせて書く。必ず含める事実:
  - 収集する情報なし。開発者・第三者のサーバーと通信しない。アカウント・解析・広告・クラッシュレポートなし。外部フォントも読み込まない。
  - 端末に保存されるデータ: メモは `.sirusita/notes`（Windows `C:\Users\<name>\.sirusita\notes`、Linux/macOS `~/.sirusita/notes`）。表示設定（サイドバー幅・文字サイズ・タグツリーの開閉）は端末内（localStorage）。アプリ内の削除または `.sirusita` フォルダーの削除で消去できる。
  - ファイル: インポート / エクスポートのダイアログ（またはドラッグ&ドロップ）で利用者が選んだファイルだけを読み書きする。メモ内のリンクはクリックしたときだけ既定のブラウザで開く。
  - Windows では Microsoft Edge WebView2 ランタイムを使う（Microsoft へ診断データを送る場合があり、Microsoft のプライバシーに関する声明に従う）。
  - Web 版（<https://sirusita.e17.click/>）: メモはブラウザ内（IndexedDB・localStorage）にのみ保存し送信しない。D2 描画とインポート解析はブラウザ内の WebAssembly で行う。GitHub Pages で配信（GitHub が通常のリクエスト情報を受け取る。GitHub のプライバシーに関する声明）、DNS は Amazon Route 53（DNS のみ）。GitHub 以外から何も読み込まない。
  - 変更時の告知方法、問い合わせ先 <https://github.com/morststs/sirusita/issues>。

- [ ] **Step 3: 検証** — `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/pages.yml'))"`（PyYAML が無ければ `node -e` で `js-yaml` を使わず目視確認で可）。`PRIVACY.md` の英日の内容が一致していること。

- [ ] **Step 4: コミット**

```bash
git add .github/workflows/pages.yml PRIVACY.md
git commit -m "feat: Web 版を GitHub Pages へ公開するワークフローとプライバシーポリシーを追加

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: MSIX・Store 提出の控え・ドキュメント

**Files:** Create `build/msix/AppxManifest.xml`, `scripts/build-msix.ps1`, `.github/workflows/msix.yml`, `docs/store-submission.md`; Modify `.github/workflows/release.yml`, `README.md`, `CLAUDE.md`

- [ ] **Step 1: `build/msix/AppxManifest.xml`** — `/workspaces/shiboq/build/msix/AppxManifest.xml` をコピーし、次を変更:
  - `Identity Name="morststs.sirusita"`、`Publisher="CN=CE782894-A6A6-48CC-8F6D-36D71DA87B9A"`（同じ値）、`PublisherDisplayName` は `morststs`
  - `DisplayName` 2 か所を `Sirusita`、`Application Id="Sirusita"`、`Executable="sirusita.exe"`
  - `Description="マークダウンで書けるシンプルなメモアプリ。タグ・階層タグでの整理、数式・図（Mermaid / D2）のプレビューに対応"`
  - 冒頭コメントの shiboq 固有の記述を sirusita に合わせる（値は設定済みである旨）。

- [ ] **Step 2: `scripts/build-msix.ps1`** — `/workspaces/shiboq/scripts/build-msix.ps1` をコピーし、`shiboq` を `sirusita` に置換（`ExePath = 'build/bin/sirusita.exe'`、`OutPath = 'build/bin/sirusita.msix'`、ステージングでコピーする exe 名）。README.md もステージングに同梱する（`Copy-Item 'README.md' $staging`）。**ASCII のみ**であることを `LC_ALL=C grep -nP '[^\x00-\x7F]' scripts/build-msix.ps1` が 0 件で確認。

- [ ] **Step 3: `.github/workflows/msix.yml`** — shiboq の msix.yml の `build-msix` ジョブだけを移植する（`publish-store` ジョブは**入れない**。Entra テナントが無く自動申請を使わないため）。変更点:
  - Go は `'1.23'`。
  - Decide version: push 時はタグ `vX.Y.Z` の `X.Y.Z` を**そのまま**使う（`^v([0-9]+)\.([0-9]+)\.([0-9]+)$` に合わなければエラー）。手動実行は `version` 入力（`publish` 入力は無し）。
  - Build Windows binary → Run tests（`go test ./...`）→ `./scripts/build-msix.ps1 -Version $env:MSIX_VERSION` → `actions/upload-artifact@v7`（name `sirusita-msix`、path `build/bin/sirusita.msix`）。
  - 冒頭コメント: タグ push で MSIX を作り Artifact に置くだけ。Store への申請は利用者が Partner Center で行う（半自動）。

- [ ] **Step 4: `release.yml`** — `Upload zip to Release` の `with:` に `body` を追加（Store 版のリンクは公開後に追加する旨をコメントに）:

```yaml
          # Store 版（https://apps.microsoft.com/detail/9PPT0S6GKBLW）のリンクは、
          # Store での公開を確認してから追加する（CLAUDE.md「Microsoft Store」参照）。
          body: |
            **ブラウザ: [Web 版](https://sirusita.e17.click/)**（インストール不要。メモはブラウザ内に保存）

            **Windows:** `sirusita-windows-amd64.zip` を展開して `sirusita.exe` を実行してください。
            未署名のため、Windows 11 のスマート アプリ コントロールにブロックされることがあります。
```

- [ ] **Step 5: `docs/store-submission.md`** — `/workspaces/shiboq/docs/store-submission.md` の構成を踏襲し、sirusita 用に書く:
  - 製品 ID の表（Global Constraints の 5 値。最初の 3 つはマニフェストに設定済み）。
  - 初回提出の手順: msix.yml を手動実行（`gh workflow run msix.yml -f version=1.5.0`）→ `gh run download <run-id> -n sirusita-msix` → Partner Center の「パッケージ」にアップロード（警告「restricted capabilities require approval: runFullTrust」は想定どおり）。
  - 価格と提供状況・プロパティ（カテゴリ: 仕事効率化。Web サイト `https://github.com/morststs/sirusita`、サポート `https://github.com/morststs/sirusita/issues`、プライバシーポリシー URL `https://sirusita.e17.click/PRIVACY.md`、電話番号・住所は空欄）・年齢区分（すべて「いいえ」）・パッケージ（Windows 10/11 Desktop のみ）。shiboq の注意点（製品の種類は必ず「MSIX または PWA アプリ」、runFullTrust の理由は 500 文字まで、キーワード、OneDrive バックアップを外す理由＝データは `%USERPROFILE%\.sirusita`）も反映。
  - Store 登録情報の下書き（日本語）: 説明（README の主な機能をもとに、オフラインで動作・データは PC 内のみ）、短い説明、機能（箇条書き 10 個以内）、キーワード（7 個以内、`マークダウン メモ` 等の組み合わせ）、runFullTrust の理由（500 文字以内。Wails/WebView2 のデスクトップアプリで、ユーザーのホーム配下 `.sirusita\notes` へのメモ保存とファイルのインポート/エクスポートのために通常のデスクトップアプリとして動作する必要がある旨）、スクリーンショットの用意（1366x768 以上）。
  - 公開後にやること: `frontend/src/links.js` の `STORE_URL` と release.yml の `body` に Store のリンクを追加、README に Store 版を追記。

- [ ] **Step 6: `README.md`** —
  - 冒頭の説明の後に「使い方」の入口として: **Web 版**（<https://sirusita.e17.click/>、インストール不要、メモはブラウザ内に保存）と **Windows 版**（GitHub Releases。Microsoft Store 版は準備中）を追加。
  - 「技術スタック」の後に「Web 版」の短い説明（同じ画面がブラウザで動く／D2 とインポートは WebAssembly／データはブラウザの IndexedDB）。
  - 「開発」節に Web 版のビルド・プレビューコマンドを追加（`docker run --rm -v "$PWD":/app -w /app/frontend wails-dev npm run build:web` など）。
  - プライバシーポリシー（`PRIVACY.md`）へのリンクを「ライセンス」節の近くに追加。

- [ ] **Step 7: `CLAUDE.md`** —
  - 概要に Web 版（URL）と Microsoft Store 版（準備中）を 1〜2 行。
  - 「よく使うコマンド」に `npm run build:web`、`sh scripts/build-wasm.sh && node scripts/wasm-smoke.mjs`、`node --test frontend/src/backend/noteLogic.test.js`（Docker 形式で）。
  - プロジェクト構成に追加ファイル（import_parse.go、web_bridge.go、wasm_main.go、scripts/*、frontend/src/backend/*、links.js、build/msix、workflows、PRIVACY.md、docs/store-submission.md）。
  - Go Backend API の `RenderD2` の行を「本体は `renderD2`（d2_render.go）。Web 版と共用」に、`ImportNote` の行に「解析は `parseImportFile`（import_parse.go）」を追記。
  - 新しい節「Web 版（GitHub Pages）」: `$backend` の仕組み、IndexedDB（DB `sirusita` / ストア `notes`）、wasm（遅延読み込み・Worker・30 秒タイムアウト）、ビルドタグ（`!js` / `js && wasm`）、公開（pages.yml、Pages の Source は GitHub Actions）、独自ドメイン（Route53 `e17.click` の CNAME `sirusita` → `morststs.github.io`、Pages 設定側が正）、外部 CDN を使わない方針（Google Fonts を廃止した理由）。
  - 新しい節「MSIX / Microsoft Store」: マニフェスト（製品 ID 設定済み）、build-msix.ps1（ASCII のみ・未署名・Windows 専用）、msix.yml（タグ push で Artifact、半自動）、バージョン（タグの X.Y.Z をそのまま。更新ごとに上げる）、Store 公開後に `STORE_URL` と release.yml の body を更新すること、`docs/store-submission.md` への参照。
  - リリース節に「`v*` タグの push で release.yml と msix.yml が同時に動く」を追記。

- [ ] **Step 8: 検証** — ワークフロー YAML が構文的に正しいこと（PyYAML があれば `yaml.safe_load`）、`LC_ALL=C grep -nP '[^\x00-\x7F]' scripts/build-msix.ps1` が 0 件、XML が整形式（`python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('build/msix/AppxManifest.xml')"`）、README / CLAUDE.md のリンク先ファイルが存在すること。

- [ ] **Step 9: コミット**

```bash
git add build/msix/AppxManifest.xml scripts/build-msix.ps1 .github/workflows/msix.yml .github/workflows/release.yml docs/store-submission.md README.md CLAUDE.md
git commit -m "feat: Microsoft Store 提出用の MSIX ビルドと提出内容の控えを追加

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## マージ後にコントローラーが行うこと（実装タスク外・外部への操作）

1. main を push → Pages の Source を GitHub Actions に設定（`gh api -X POST repos/morststs/sirusita/pages -f build_type=workflow`、既にあれば PUT）→ pages.yml の成功を確認。
2. Route53（aws-mcp）: ホストゾーン `e17.click` に `sirusita` CNAME `morststs.github.io`（TTL 300）を追加。
3. `gh api -X PUT repos/morststs/sirusita/pages -f cname=sirusita.e17.click`、証明書発行後に `https_enforced=true`。リポジトリの Website 欄を設定。
4. msix.yml を手動実行（`version=1.5.0`）して MSIX の Artifact ができることを確認し、Partner Center への提出をユーザーに依頼する。
