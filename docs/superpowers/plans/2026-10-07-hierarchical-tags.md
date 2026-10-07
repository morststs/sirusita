# 階層タグ（スラッシュ区切り）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `親/子` 形式のタグをサイドバーでツリー表示し、親選択で子孫も絞り込めるようにし、配下ごとのタグ一括リネーム（統合含む）を提供する。

**Architecture:** 保存形式は従来どおり front matter の文字列配列。Go 側でタグを正規化（読み込み時・保存時）し、`RenameTag` API を追加する。フロントは純粋関数モジュール `tagTree.js` でツリー構築・前方一致判定・リネーム計算を行い、`Sidebar.svelte` がツリーとリネーム用 Modal を描画、`App.svelte` が API 呼び出しと状態追従を担う。

**Tech Stack:** Go 1.23 + Wails v2.12、Svelte 5（runes）、Flowbite Svelte 1.x（`Modal`, `Button`）、Node 22 組み込みの `node --test`（tagTree.js の単体テストのみ。依存追加なし）。

設計書: `docs/superpowers/specs/2026-10-07-hierarchical-tags-design.md`

## Global Constraints

- 保存形式（front matter・`sirusita: "1"` マーカー）は変更しない。
- `/` は常に階層区切り。エスケープ記法は設けない。大文字小文字は変更しない。
- `RenameTag` は `created` / `modified` / タイトル / 本文を保持する。
- Svelte 5 runes 規約: props は `$props()`、状態は `$state`/`$derived`/`$effect`、親への通知はコールバック props（`onXxx`）、イベントは `onclick` 等のネイティブ属性。
- localStorage の読み書きは必ず try/catch。キーは `sirusita.tagTree.expanded`。
- npm 依存は追加しない。
- コマンドは CLAUDE.md の Podman 形式（`podman run --rm -v "$PWD":/app:Z -w /app wails-dev ...`）。devcontainer 内（go/node が直接ある環境）ではプレフィックスを外して直接実行してよい。
- コミットメッセージは `feat:` / `fix:` / `chore:` プレフィックス。末尾に `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`。
- 作業ブランチ: `feat/hierarchical-tags`（作成済み）。

## File Structure

| ファイル | 種別 | 責務 |
|---|---|---|
| `note_service.go` | Modify | `NormalizeTag` / `normalizeTags` / `renameTagPath` / `RenameTag` 追加、`CreateImported`・`UpdateNote`・`GetNote` で正規化 |
| `note_service_test.go` | Create | 上記の Go 単体テスト |
| `frontend/wailsjs/go/main/NoteService.{js,d.ts}` | Regenerate | `RenameTag` バインディング |
| `frontend/src/tagTree.js` | Create | 純粋関数: `normalizeTag`, `matchesTag`, `renameTagPath`, `renameTags`, `allTagPaths`, `buildTagTree` |
| `frontend/src/tagTree.test.js` | Create | `node --test` 用テスト（Vite バンドルには含まれない） |
| `frontend/src/Sidebar.svelte` | Modify | ツリー描画・開閉保持・前方一致フィルタ・リネーム Modal |
| `frontend/src/NoteToolbar.svelte` | Modify | `note.tags` 変化時にタグ入力欄を再同期（リネーム後に古いタグを書き戻さないため） |
| `frontend/src/App.svelte` | Modify | `handleRenameTag`、選択タグ追従、開いているメモのタグをローカル更新 |
| `CLAUDE.md` | Modify | API 表・構成・タグ仕様の追記 |

---

### Task 1: Go — タグ正規化

**Files:**
- Modify: `note_service.go`（`CreateImported` 内 `if tags == nil {...}`、`GetNote` 内 `if meta.Tags == nil {...}`、`UpdateNote` の `Tags: tags`）
- Create: `note_service_test.go`

**Interfaces:**
- Produces: `func NormalizeTag(tag string) string`、`func normalizeTags(tags []string) []string`（非 nil、空・重複除去、出現順保持）

- [ ] **Step 1: 失敗するテストを書く** — `note_service_test.go` を新規作成:

```go
package main

import (
	"reflect"
	"testing"
)

func TestNormalizeTag(t *testing.T) {
	cases := map[string]string{
		"Go":              "Go",
		" a / b// c/ ":    "a/b/c",
		"/":               "",
		"":                "",
		"  ":              "",
		"プログラミング / Go": "プログラミング/Go",
		"Markdown":        "Markdown",
	}
	for in, want := range cases {
		if got := NormalizeTag(in); got != want {
			t.Errorf("NormalizeTag(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestNormalizeTags(t *testing.T) {
	got := normalizeTags([]string{"b", " a / x ", "", "/", "a/x", "b"})
	want := []string{"b", "a/x"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("normalizeTags = %v, want %v", got, want)
	}
	if got := normalizeTags(nil); got == nil || len(got) != 0 {
		t.Errorf("normalizeTags(nil) = %#v, want 空スライス", got)
	}
}

// 作成・更新・読み込みのいずれでもタグが正規化されることを確認する。
func TestTagsNormalizedOnSaveAndLoad(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	note, err := svc.CreateNote("t", "body", []string{" a / b ", "a/b", ""})
	if err != nil {
		t.Fatalf("CreateNote: %v", err)
	}
	if want := []string{"a/b"}; !reflect.DeepEqual(note.Tags, want) {
		t.Errorf("CreateNote tags = %v, want %v", note.Tags, want)
	}
	updated, err := svc.UpdateNote(note.ID, "t", "body", []string{"x//y", "x/y "})
	if err != nil {
		t.Fatalf("UpdateNote: %v", err)
	}
	if want := []string{"x/y"}; !reflect.DeepEqual(updated.Tags, want) {
		t.Errorf("UpdateNote tags = %v, want %v", updated.Tags, want)
	}
	got, err := svc.GetNote(note.ID)
	if err != nil {
		t.Fatalf("GetNote: %v", err)
	}
	if want := []string{"x/y"}; !reflect.DeepEqual(got.Tags, want) {
		t.Errorf("GetNote tags = %v, want %v", got.Tags, want)
	}
}

// 機能追加前に保存された未正規化タグも、読み込み時に正規化される。
func TestGetNoteNormalizesLegacyTags(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	note, err := svc.CreateNote("t", "body", nil)
	if err != nil {
		t.Fatalf("CreateNote: %v", err)
	}
	// writeNote は正規化しないので、旧データを直接書き込める
	note.Tags = []string{" a / b ", "a/b"}
	if err := svc.writeNote(note); err != nil {
		t.Fatalf("writeNote: %v", err)
	}
	got, err := svc.GetNote(note.ID)
	if err != nil {
		t.Fatalf("GetNote: %v", err)
	}
	if want := []string{"a/b"}; !reflect.DeepEqual(got.Tags, want) {
		t.Errorf("GetNote tags = %v, want %v", got.Tags, want)
	}
}
```

- [ ] **Step 2: 失敗を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test -run 'Normalize|TagsNormalized' ./...`
Expected: コンパイルエラー `undefined: NormalizeTag` / `undefined: normalizeTags`

- [ ] **Step 3: 実装** — `note_service.go` の `writeNote` の直前に追加:

```go
// NormalizeTag は階層タグ（"親/子"）を正規化する。
// "/" で区切った各セグメントの前後空白を除き、空セグメントを捨てて再結合する。
func NormalizeTag(tag string) string {
	var segs []string
	for _, seg := range strings.Split(tag, "/") {
		if seg = strings.TrimSpace(seg); seg != "" {
			segs = append(segs, seg)
		}
	}
	return strings.Join(segs, "/")
}

// normalizeTags は各タグを正規化し、空タグと重複を除く（出現順は保持）。
func normalizeTags(tags []string) []string {
	out := []string{}
	seen := make(map[string]bool)
	for _, tag := range tags {
		tag = NormalizeTag(tag)
		if tag == "" || seen[tag] {
			continue
		}
		seen[tag] = true
		out = append(out, tag)
	}
	return out
}
```

`CreateImported` 内の

```go
	if tags == nil {
		tags = []string{}
	}
```

を `tags = normalizeTags(tags)` に置換。

`GetNote` 内の

```go
	if meta.Tags == nil {
		meta.Tags = []string{}
	}
```

を `meta.Tags = normalizeTags(meta.Tags)` に置換。

`UpdateNote` の `NoteMeta{ID: id, Title: title, Tags: tags, ...}` を `Tags: normalizeTags(tags)` に変更。

- [ ] **Step 4: 全テスト通過を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test ./...`
Expected: `ok`（既存の app_test.go / d2_render_test.go も含め全 PASS）

- [ ] **Step 5: コミット**

```bash
gofmt -l . # 出力が空であること
git add note_service.go note_service_test.go
git commit -m "feat: 階層タグの正規化（保存・読み込み時）

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Go — `RenameTag` API とバインディング

**Files:**
- Modify: `note_service.go`（`ListTags` の直後に追加）
- Modify: `note_service_test.go`
- Regenerate: `frontend/wailsjs/go/main/NoteService.js`, `frontend/wailsjs/go/main/NoteService.d.ts`

**Interfaces:**
- Consumes: Task 1 の `NormalizeTag`, `normalizeTags`
- Produces: `func (s *NoteService) RenameTag(oldTag, newTag string) (int, error)`。JS 側 `RenameTag(arg1: string, arg2: string): Promise<number>`（`../wailsjs/go/main/NoteService` から import）

- [ ] **Step 1: 失敗するテストを追記** — `note_service_test.go` の末尾に追加:

```go
// テスト用: 固定日時でメモを作り ID を返す。
func mustCreate(t *testing.T, svc *NoteService, title string, tags ...string) string {
	t.Helper()
	n, err := svc.CreateImported(title, "本文 "+title, tags,
		"2026-01-01T00:00:00+09:00", "2026-01-02T00:00:00+09:00")
	if err != nil {
		t.Fatalf("CreateImported: %v", err)
	}
	return n.ID
}

func mustGet(t *testing.T, svc *NoteService, id string) Note {
	t.Helper()
	n, err := svc.GetNote(id)
	if err != nil {
		t.Fatalf("GetNote: %v", err)
	}
	return n
}

func TestRenameTagExactAndDescendants(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	a := mustCreate(t, svc, "a", "a", "other")
	ax := mustCreate(t, svc, "ax", "a/x", "a/x/y")
	ab := mustCreate(t, svc, "ab", "ab") // 前方一致の誤マッチ対象
	none := mustCreate(t, svc, "none", "other")

	count, err := svc.RenameTag("a", "図表/a")
	if err != nil {
		t.Fatalf("RenameTag: %v", err)
	}
	if count != 2 {
		t.Errorf("count = %d, want 2", count)
	}
	checks := map[string][]string{
		a:    {"図表/a", "other"},
		ax:   {"図表/a/x", "図表/a/x/y"},
		ab:   {"ab"},
		none: {"other"},
	}
	for id, want := range checks {
		if got := mustGet(t, svc, id).Tags; !reflect.DeepEqual(got, want) {
			t.Errorf("%s tags = %v, want %v", mustGet(t, svc, id).Title, got, want)
		}
	}
}

// 既存タグと統合されたとき重複しないこと。
func TestRenameTagMergeDedupes(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	id := mustCreate(t, svc, "m", "PlantUML", "図表")
	count, err := svc.RenameTag("PlantUML", "図表")
	if err != nil {
		t.Fatalf("RenameTag: %v", err)
	}
	if count != 1 {
		t.Errorf("count = %d, want 1", count)
	}
	if got, want := mustGet(t, svc, id).Tags, []string{"図表"}; !reflect.DeepEqual(got, want) {
		t.Errorf("tags = %v, want %v", got, want)
	}
}

// 日時・タイトル・本文が保持されること。
func TestRenameTagPreservesMeta(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	id := mustCreate(t, svc, "keep", "old")
	if _, err := svc.RenameTag(" old ", "new"); err != nil {
		t.Fatalf("RenameTag: %v", err)
	}
	n := mustGet(t, svc, id)
	if n.Created != "2026-01-01T00:00:00+09:00" || n.Modified != "2026-01-02T00:00:00+09:00" {
		t.Errorf("日時が変わった: created=%q modified=%q", n.Created, n.Modified)
	}
	if n.Title != "keep" || n.Body != "本文 keep" {
		t.Errorf("タイトル/本文が変わった: %q / %q", n.Title, n.Body)
	}
	if want := []string{"new"}; !reflect.DeepEqual(n.Tags, want) {
		t.Errorf("tags = %v, want %v", n.Tags, want)
	}
}

func TestRenameTagInvalid(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	mustCreate(t, svc, "x", "a")
	for _, c := range [][2]string{{"", "b"}, {"a", " / "}} {
		if _, err := svc.RenameTag(c[0], c[1]); err == nil {
			t.Errorf("RenameTag(%q, %q) にエラーが無い", c[0], c[1])
		}
	}
	if count, err := svc.RenameTag("a", "a"); err != nil || count != 0 {
		t.Errorf("同名リネーム = (%d, %v), want (0, nil)", count, err)
	}
}
```

- [ ] **Step 2: 失敗を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test -run RenameTag ./...`
Expected: コンパイルエラー `svc.RenameTag undefined`

- [ ] **Step 3: 実装** — `note_service.go` の `ListTags` の直後に追加:

```go
// renameTagPath は tag が oldTag 自身または配下なら newTag 側へ付け替えた値を返す。
// "ab" は "a" の配下ではない（"/" 境界で判定）。
func renameTagPath(tag, oldTag, newTag string) string {
	if tag == oldTag {
		return newTag
	}
	if strings.HasPrefix(tag, oldTag+"/") {
		return newTag + tag[len(oldTag):]
	}
	return tag
}

// RenameTag は oldTag とその配下のタグを newTag へ付け替え、更新したメモ件数を返す。
// 既存タグと重なった場合は統合（重複除去）する。作成/更新日時は保持する。
func (s *NoteService) RenameTag(oldTag, newTag string) (int, error) {
	oldTag, newTag = NormalizeTag(oldTag), NormalizeTag(newTag)
	if oldTag == "" || newTag == "" {
		return 0, fmt.Errorf("tag must not be empty")
	}
	if oldTag == newTag {
		return 0, nil
	}
	metas, err := s.ListNotes()
	if err != nil {
		return 0, err
	}
	count := 0
	for _, meta := range metas {
		renamed := make([]string, len(meta.Tags))
		changed := false
		for i, tag := range meta.Tags {
			renamed[i] = renameTagPath(tag, oldTag, newTag)
			if renamed[i] != tag {
				changed = true
			}
		}
		if !changed {
			continue
		}
		note, err := s.GetNote(meta.ID)
		if err != nil {
			return count, err
		}
		note.Tags = normalizeTags(renamed)
		if err := s.writeNote(note); err != nil {
			return count, fmt.Errorf("failed to rename tag: %w", err)
		}
		count++
	}
	return count, nil
}
```

（`ListNotes` → `GetNote` 経由で `meta.Tags` は Task 1 により正規化済みなので、旧データの `" a / b "` も `"a/b"` として一致する。）

- [ ] **Step 4: 全テスト通過を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test ./...`
Expected: `ok`

- [ ] **Step 5: バインディング再生成**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails generate module`
Expected: `frontend/wailsjs/go/main/NoteService.js` に以下が追加される（`git diff frontend/wailsjs` で確認。差分は RenameTag の追加のみであること）:

```js
export function RenameTag(arg1, arg2) {
  return window['go']['main']['NoteService']['RenameTag'](arg1, arg2);
}
```

`NoteService.d.ts` に `export function RenameTag(arg1:string,arg2:string):Promise<number>;`

wails CLI が使えない環境では、上記 2 つを既存エントリのアルファベット順（`ListTags` と `SearchNotes` の間）に手で追記してよい（生成結果と同一内容）。

- [ ] **Step 6: コミット**

```bash
gofmt -l .
git add note_service.go note_service_test.go frontend/wailsjs/go/main/NoteService.js frontend/wailsjs/go/main/NoteService.d.ts
git commit -m "feat: タグの一括リネーム API（RenameTag）を追加

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: フロント — `tagTree.js` とサイドバーのツリー表示

**Files:**
- Create: `frontend/src/tagTree.js`
- Create: `frontend/src/tagTree.test.js`
- Modify: `frontend/src/Sidebar.svelte`（script 全体・タグフィルタ部・style）

**Interfaces:**
- Produces（`./tagTree.js` から export。Task 4 が使用）:
  - `normalizeTag(tag: string): string` — Go の `NormalizeTag` と同規則
  - `matchesTag(noteTags: string[] | null, selected: string): boolean`
  - `renameTagPath(path: string, oldPath: string, newPath: string): string | null` — 対象外なら `null`
  - `renameTags(tags: string[], oldPath: string, newPath: string): string[]` — Go の `RenameTag` 1 メモ分と同結果
  - `allTagPaths(tags: string[]): Set<string>` — 中間ノード込みの全パス
  - `buildTagTree(tags: string[], notes: {tags: string[]}[]): Node[]`、`Node = {name, path, count, children: Node[]}`

- [ ] **Step 1: 失敗するテストを書く** — `frontend/src/tagTree.test.js`:

```js
// node --test frontend/src/tagTree.test.js で実行（Vite のバンドルには含まれない）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTag, matchesTag, renameTagPath, renameTags, allTagPaths, buildTagTree } from './tagTree.js';

test('normalizeTag', () => {
  assert.equal(normalizeTag(' a / b// c/ '), 'a/b/c');
  assert.equal(normalizeTag('/'), '');
  assert.equal(normalizeTag('Go'), 'Go');
});

test('matchesTag は自身と配下に一致し、前方一致の誤マッチをしない', () => {
  assert.equal(matchesTag(['a'], 'a'), true);
  assert.equal(matchesTag(['a/x/y'], 'a'), true);
  assert.equal(matchesTag(['ab'], 'a'), false);
  assert.equal(matchesTag([], 'a'), false);
  assert.equal(matchesTag(null, 'a'), false);
});

test('renameTagPath / renameTags', () => {
  assert.equal(renameTagPath('a', 'a', 'z'), 'z');
  assert.equal(renameTagPath('a/x', 'a', 'z/q'), 'z/q/x');
  assert.equal(renameTagPath('ab', 'a', 'z'), null);
  assert.deepEqual(renameTags(['PlantUML', '図表', 'x'], 'PlantUML', '図表'), ['図表', 'x']);
});

test('allTagPaths は中間ノードを補完する', () => {
  assert.deepEqual([...allTagPaths(['a/b/c', 'd'])].sort(), ['a', 'a/b', 'a/b/c', 'd']);
});

test('buildTagTree は階層・件数（子孫込み・1メモ1件）・名前順を作る', () => {
  const notes = [
    { tags: ['p/Go', 'p/Rust'] },
    { tags: ['p/Go'] },
    { tags: ['c'] },
    { tags: [] },
  ];
  const tree = buildTagTree(['p/Rust', 'p/Go', 'c'], notes);
  assert.deepEqual(tree.map(n => n.path), ['c', 'p']);
  const p = tree[1];
  assert.equal(p.name, 'p');
  assert.equal(p.count, 2);
  assert.deepEqual(p.children.map(n => [n.name, n.path, n.count]), [['Go', 'p/Go', 2], ['Rust', 'p/Rust', 1]]);
});
```

- [ ] **Step 2: 失敗を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev node --test frontend/src/tagTree.test.js`
Expected: FAIL（`Cannot find module .../tagTree.js`）

- [ ] **Step 3: 実装** — `frontend/src/tagTree.js`:

```js
// 階層タグ（"親/子"）ユーティリティ。正規化・リネーム規則は Go 側（note_service.go）と同じ。

export function normalizeTag(tag) {
  return tag.split('/').map(s => s.trim()).filter(s => s.length > 0).join('/');
}

// メモのタグのいずれかが selected 自身または配下なら true（"ab" は "a" の配下ではない）。
export function matchesTag(noteTags, selected) {
  return (noteTags || []).some(t => t === selected || t.startsWith(selected + '/'));
}

// path が oldPath 自身または配下なら newPath 側へ付け替えた値を、対象外なら null を返す。
export function renameTagPath(path, oldPath, newPath) {
  if (path === oldPath) return newPath;
  if (path.startsWith(oldPath + '/')) return newPath + path.slice(oldPath.length);
  return null;
}

// 1 メモ分のタグ列にリネームを適用し、重複を除く（出現順保持）。
export function renameTags(tags, oldPath, newPath) {
  const renamed = tags.map(t => renameTagPath(t, oldPath, newPath) ?? t);
  return [...new Set(renamed)];
}

// 中間ノードを含む全パス（"a/b/c" → "a", "a/b", "a/b/c"）。
export function allTagPaths(tags) {
  const paths = new Set();
  for (const tag of tags) {
    const segs = tag.split('/');
    for (let i = 1; i <= segs.length; i++) paths.add(segs.slice(0, i).join('/'));
  }
  return paths;
}

// サイドバー表示用のツリーを作る。count は子孫込みで該当するメモ数。
export function buildTagTree(tags, notes) {
  const roots = [];
  const byPath = new Map();
  // 浅い順に処理すれば親ノードが必ず先に存在する
  const paths = [...allTagPaths(tags)].sort((a, b) => a.split('/').length - b.split('/').length);
  for (const path of paths) {
    const i = path.lastIndexOf('/');
    const node = {
      name: path.slice(i + 1),
      path,
      count: notes.filter(n => matchesTag(n.tags, path)).length,
      children: [],
    };
    byPath.set(path, node);
    (i < 0 ? roots : byPath.get(path.slice(0, i)).children).push(node);
  }
  const sortRec = list => {
    list.sort((a, b) => a.name.localeCompare(b.name));
    list.forEach(n => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}
```

- [ ] **Step 4: テスト通過を確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev node --test frontend/src/tagTree.test.js`
Expected: `# pass 5` / `# fail 0`

- [ ] **Step 5: Sidebar をツリー表示に変更** — `frontend/src/Sidebar.svelte` の `<script>` を以下に置換:

```svelte
<script>
  import { Accordion, AccordionItem } from 'flowbite-svelte';
  import { buildTagTree, matchesTag } from './tagTree.js';

  let {
    notes = [],
    tags = [],
    selectedTag = null,
    selectedNote = null,
    onCreateNote,
    onImport,
    onSelectTag,
    onSelectNote
  } = $props();

  // 「タグ無し」フィルタ用のセンチネル（実在タグ文字列と衝突しない Symbol）。
  const UNTAGGED = Symbol('untagged');

  // タグツリーの展開状態（path の集合）。localStorage は使えない環境もあるので失敗時は全て閉じる。
  const EXPANDED_KEY = 'sirusita.tagTree.expanded';
  function loadExpanded() {
    try {
      const raw = localStorage.getItem(EXPANDED_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }
  let expanded = $state(loadExpanded());

  function toggleExpanded(path) {
    const next = new Set(expanded);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    expanded = next;
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...next]));
    } catch {
      // 保存できなくても動作は継続
    }
  }

  let tagTree = $derived(buildTagTree(tags, notes));

  let filteredNotes = $derived(
    selectedTag === null
      ? notes
      : selectedTag === UNTAGGED
        ? notes.filter(n => !n.tags || n.tags.length === 0)
        : notes.filter(n => matchesTag(n.tags, selectedTag))
  );
</script>
```

`</script>` の直後（`<div class="sidebar-content">` の前）に再帰 snippet を追加:

```svelte
{#snippet tagNode(node, depth)}
  <div class="tag-row" style="padding-left: {depth * 12}px">
    {#if node.children.length > 0}
      <button class="tag-toggle"
        onclick={() => toggleExpanded(node.path)}
        title={expanded.has(node.path) ? '折りたたむ' : '展開する'}>
        {expanded.has(node.path) ? '▾' : '▸'}
      </button>
    {:else}
      <span class="tag-toggle-spacer"></span>
    {/if}
    <button
      class="tag-item"
      class:active={selectedTag === node.path}
      onclick={() => onSelectTag?.(node.path)}
      title={node.path}>
      {node.name} <span class="tag-count">({node.count})</span>
    </button>
  </div>
  {#if node.children.length > 0 && expanded.has(node.path)}
    {#each node.children as child (child.path)}
      {@render tagNode(child, depth + 1)}
    {/each}
  {/if}
{/snippet}
```

タグフィルタ内の

```svelte
        {#each tags as tag}
          <button
            class="tag-item"
            class:active={selectedTag === tag}
            onclick={() => onSelectTag?.(tag)}>
            {tag}
          </button>
        {/each}
```

を以下に置換:

```svelte
        {#each tagTree as node (node.path)}
          {@render tagNode(node, 0)}
        {/each}
```

`<style>` の `.note-item {` の直前に追加:

```css
  .tag-row {
    display: flex;
    align-items: center;
  }
  .tag-row .tag-item {
    flex: 1;
    min-width: 0;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tag-toggle, .tag-toggle-spacer {
    flex: none;
    width: 18px;
  }
  .tag-toggle {
    padding: 0;
    border: none;
    background: none;
    color: #888888;
    cursor: pointer;
    font-size: 11px;
  }
  .tag-toggle:hover {
    color: #ffffff;
  }
  .tag-count {
    color: #777777;
    font-size: 11px;
  }
```

- [ ] **Step 6: フロントのビルド確認**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build`
Expected: ビルド成功（`build/bin/sirusita` 生成）。Svelte の警告に `Sidebar.svelte` 由来の新規エラーが無いこと。

- [ ] **Step 7: コミット**

```bash
git add frontend/src/tagTree.js frontend/src/tagTree.test.js frontend/src/Sidebar.svelte
git commit -m "feat: サイドバーのタグを階層ツリー表示・前方一致フィルタに

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: フロント — リネーム UI・状態追従・ドキュメント

**Files:**
- Modify: `frontend/src/Sidebar.svelte`（import・props・リネーム状態・snippet に ✎ ボタン・Modal・style）
- Modify: `frontend/src/NoteToolbar.svelte:9-17`（`$effect`）
- Modify: `frontend/src/App.svelte`（import 行 `:9`、`handleSelectTag` 付近にハンドラ追加、`<Sidebar ...>` に prop 追加）
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: Task 2 の `RenameTag(old, new): Promise<number>`、Task 3 の `normalizeTag`, `allTagPaths`, `renameTagPath`, `renameTags`
- Produces: Sidebar prop `onRenameTag(oldPath: string, newPath: string)`（`newPath` は正規化済み）

- [ ] **Step 1: NoteToolbar のタグ欄再同期** — `frontend/src/NoteToolbar.svelte` の

```js
  let currentNoteId = null;

  $effect(() => {
    if (note && note.id !== currentNoteId) {
      currentNoteId = note.id;
      title = note.title || '';
      tagsInput = (note.tags || []).join(', ');
    }
  });
```

を以下に置換（メモ切替時に加え、保存後の正規化やリネームで `note.tags` が変わったときもタグ欄を更新する。変わっていなければ入力中の内容は上書きしない）:

```js
  let currentNoteId = null;
  let lastTagsText = null;

  $effect(() => {
    if (!note) return;
    if (note.id !== currentNoteId) {
      currentNoteId = note.id;
      title = note.title || '';
    }
    const tagsText = (note.tags || []).join(', ');
    if (tagsText !== lastTagsText) {
      lastTagsText = tagsText;
      tagsInput = tagsText;
    }
  });
```

- [ ] **Step 2: Sidebar にリネーム UI を追加** — `frontend/src/Sidebar.svelte`:

import を変更:

```js
  import { Accordion, AccordionItem, Modal, Button } from 'flowbite-svelte';
  import { buildTagTree, matchesTag, normalizeTag, allTagPaths } from './tagTree.js';
```

props に `onRenameTag` を追加（`onSelectNote` の後ろ）:

```js
    onSelectNote,
    onRenameTag
```

`filteredNotes` の後ろに追加:

```js
  // タグ名変更モーダルの状態
  let renameOpen = $state(false);
  let renameFrom = $state('');
  let renameTo = $state('');
  let renameTarget = $derived(normalizeTag(renameTo));
  let renameDisabled = $derived(renameTarget === '' || renameTarget === renameFrom);
  // 自分自身・自分の配下以外の既存タグ（中間ノード含む）と一致すれば統合になる
  let renameMerge = $derived(
    !renameDisabled &&
      !(renameTarget === renameFrom || renameTarget.startsWith(renameFrom + '/')) &&
      allTagPaths(tags).has(renameTarget)
  );

  function openRename(path) {
    renameFrom = path;
    renameTo = path;
    renameOpen = true;
  }

  function submitRename() {
    if (renameDisabled) return;
    onRenameTag?.(renameFrom, renameTarget);
    renameOpen = false;
  }
```

snippet `tagNode` 内、`tag-item` ボタンの直後（`</div>` の前）に追加:

```svelte
    <button class="tag-rename" onclick={() => openRename(node.path)} title="タグ名を変更">✎</button>
```

`</Accordion>` の直後（`</div>` の前）に追加:

```svelte
  <Modal title="タグ名を変更" bind:open={renameOpen} size="xs">
    <p class="rename-hint">「/」で区切ると階層になります。配下のタグもまとめて変更されます。</p>
    <input
      class="rename-input"
      bind:value={renameTo}
      onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitRename(); } }} />
    {#if renameMerge}
      <p class="rename-merge">既存タグ「{renameTarget}」と統合されます</p>
    {/if}
    {#snippet footer()}
      <Button type="button" disabled={renameDisabled} onclick={submitRename}>変更</Button>
      <Button type="button" color="alternative" onclick={() => (renameOpen = false)}>キャンセル</Button>
    {/snippet}
  </Modal>
```

`<style>` の `.tag-count {` ブロックの後ろに追加:

```css
  .tag-rename {
    flex: none;
    visibility: hidden;
    padding: 0 4px;
    border: none;
    background: none;
    color: #888888;
    cursor: pointer;
    font-size: 12px;
  }
  .tag-row:hover .tag-rename {
    visibility: visible;
  }
  .tag-rename:hover {
    color: #ffffff;
  }
  .rename-hint {
    font-size: 12px;
    color: #999999;
    margin-bottom: 8px;
  }
  .rename-input {
    width: 100%;
    padding: 6px 8px;
    background: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 4px;
    color: #ffffff;
    font-size: 13px;
  }
  .rename-input:focus {
    outline: none;
    border-color: #0e639c;
  }
  .rename-merge {
    margin-top: 8px;
    font-size: 12px;
    color: #e0a040;
  }
```

- [ ] **Step 3: App.svelte にハンドラを追加**

`frontend/src/App.svelte:9` の import に `RenameTag` を追加:

```js
  import { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from '../wailsjs/go/main/NoteService';
  import { renameTagPath, renameTags } from './tagTree.js';
```

`handleSelectTag` の直後に追加:

```js
  async function handleRenameTag(oldTag, newTag) {
    // 開いているメモのタグは先にローカルで付け替える。GetNote で読み直すと未保存の本文編集を
    // 失い、また旧タグのまま自動保存されるとリネームが巻き戻るため。
    const prevTags = selectedNote?.tags;
    if (selectedNote) selectedNote.tags = renameTags(selectedNote.tags || [], oldTag, newTag);
    try {
      const count = await RenameTag(oldTag, newTag);
      if (typeof selectedTag === 'string') {
        selectedTag = renameTagPath(selectedTag, oldTag, newTag) ?? selectedTag;
      }
      await refreshList();
      showToast(count + '件のマークダウンを更新しました');
    } catch (err) {
      if (selectedNote && prevTags) selectedNote.tags = prevTags;
      await refreshList();
      showToast('タグの変更に失敗しました');
    }
  }
```

`<Sidebar ...>` に prop を追加:

```svelte
    <Sidebar {notes} {tags} {selectedTag} {selectedNote}
      onSelectNote={handleSelectNote}
      onSelectTag={handleSelectTag}
      onCreateNote={handleCreateNote}
      onImport={handleImport}
      onRenameTag={handleRenameTag} />
```

- [ ] **Step 4: CLAUDE.md 更新**

- プロジェクト構成の `Toc.svelte` 行の後に追加:
  `│   │   ├── tagTree.js       # 階層タグ（"親/子"）ユーティリティ: 正規化・前方一致・ツリー構築・リネーム計算（node --test でテスト）`
- `Sidebar.svelte` の説明を `# 新規/インポートボタン + 階層タグツリー（開閉・件数・タグ名変更）+ メモ一覧` に変更
- NoteService 表の `ListTags()` 行の後に追加:
  `| `RenameTag(old, new)` | タグとその配下（`old/…`）を一括で付け替え。既存タグとは統合。作成/更新日時は保持。更新件数を返す |`
- 「メモファイル形式」節の末尾に追加:

```markdown
タグは `/` 区切りで階層を表す（例: `プログラミング/Go`）。保存・読み込み時に
`NormalizeTag` でセグメント前後の空白と空セグメントを除去する。サイドバーで親タグを
選ぶと配下のタグが付いたメモも表示される。
```

- 「よく使うコマンド」に追加:

```bash
# フロントの純粋関数テスト（tagTree.js）
podman run --rm -v "$PWD":/app:Z -w /app wails-dev node --test frontend/src/tagTree.test.js
```

- [ ] **Step 5: テストとビルド**

Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev go test ./...` → `ok`
Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev node --test frontend/src/tagTree.test.js` → `# fail 0`
Run: `podman run --rm -v "$PWD":/app:Z -w /app wails-dev wails build` → 成功

- [ ] **Step 6: 実機での動作確認**（`build/bin/sirusita` を起動。確認できない環境ではその旨を報告）

1. タグ `プログラミング/Go` と `プログラミング/Rust` のメモを作る → ツリーに `▸ プログラミング (2)` が出る
2. ▸ で展開 → `Go (1)` `Rust (1)`。アプリ再起動後も展開状態が保たれる
3. `プログラミング` を選択 → 両メモが一覧に出る
4. タグ欄に ` a / b ` と入力して blur → タグ欄が `a/b` に再表示される
5. `プログラミング` 選択中に ✎ → `言語` に変更 → トースト「2件の…」、ツリーが `言語/Go` `言語/Rust`、選択が `言語` に追従、開いているメモのタグ欄も更新
6. 既存タグ名に変更しようとすると「既存タグ『…』と統合されます」が出る。空・同名では「変更」が押せない
7. メモの更新日時（一覧の並び）がリネームで変わらない

- [ ] **Step 7: コミット**

```bash
git add frontend/src/Sidebar.svelte frontend/src/NoteToolbar.svelte frontend/src/App.svelte CLAUDE.md
git commit -m "feat: タグ名の一括変更 UI（配下ごと移動・統合）

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
