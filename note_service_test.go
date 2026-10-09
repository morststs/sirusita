//go:build !js

package main

import (
	"reflect"
	"testing"
)

func TestNormalizeTag(t *testing.T) {
	cases := map[string]string{
		"Go":           "Go",
		" a / b// c/ ": "a/b/c",
		"/":            "",
		"":             "",
		"  ":           "",
		"プログラミング / Go": "プログラミング/Go",
		"Markdown":     "Markdown",
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

// 配下タグの改名先が既存タグと衝突しても統合されること。
func TestRenameTagDescendantCollisionMerges(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	id := mustCreate(t, svc, "c", "a/x", "図表/a/x")
	count, err := svc.RenameTag("a", "図表/a")
	if err != nil {
		t.Fatalf("RenameTag: %v", err)
	}
	if count != 1 {
		t.Errorf("count = %d, want 1", count)
	}
	if got, want := mustGet(t, svc, id).Tags, []string{"図表/a/x"}; !reflect.DeepEqual(got, want) {
		t.Errorf("tags = %v, want %v", got, want)
	}
}

// 自身の子への改名（a -> a/b）。
func TestRenameTagIntoOwnChild(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	first := mustCreate(t, svc, "first", "a")
	second := mustCreate(t, svc, "second", "a/b")
	count, err := svc.RenameTag("a", "a/b")
	if err != nil {
		t.Fatalf("RenameTag: %v", err)
	}
	if count != 2 {
		t.Errorf("count = %d, want 2", count)
	}
	if got, want := mustGet(t, svc, first).Tags, []string{"a/b"}; !reflect.DeepEqual(got, want) {
		t.Errorf("first tags = %v, want %v", got, want)
	}
	if got, want := mustGet(t, svc, second).Tags, []string{"a/b/b"}; !reflect.DeepEqual(got, want) {
		t.Errorf("second tags = %v, want %v", got, want)
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

// EditTags: 完全一致のタグだけ外し、追加は末尾へ（重複は除く）。日時は保持し、変わったメモだけ数える。
func TestEditTagsAddRemove(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	a := mustCreate(t, svc, "a", "x", "x/y", "keep")
	b := mustCreate(t, svc, "b", "keep", "new")
	c := mustCreate(t, svc, "c", "other") // 対象外
	before := mustGet(t, svc, a)

	count, err := svc.EditTags([]string{a, b}, []string{" new ", "z/ w"}, []string{"x"})
	if err != nil {
		t.Fatalf("EditTags: %v", err)
	}
	if count != 2 {
		t.Errorf("count = %d, want 2", count)
	}
	checks := map[string][]string{
		a: {"x/y", "keep", "new", "z/w"},
		b: {"keep", "new", "z/w"},
		c: {"other"},
	}
	for id, want := range checks {
		if got := mustGet(t, svc, id).Tags; !reflect.DeepEqual(got, want) {
			t.Errorf("%s tags = %v, want %v", mustGet(t, svc, id).Title, got, want)
		}
	}
	after := mustGet(t, svc, a)
	if after.Created != before.Created || after.Modified != before.Modified {
		t.Errorf("日時が変わった: %s/%s -> %s/%s", before.Created, before.Modified, after.Created, after.Modified)
	}

	// 変化が無ければ 0 件
	if count, err := svc.EditTags([]string{b}, []string{"new"}, []string{"absent"}); err != nil || count != 0 {
		t.Errorf("no-op count = %d, err = %v", count, err)
	}
}

func TestEditTagsRejectsInvalidID(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	if _, err := svc.EditTags([]string{"../x"}, []string{"a"}, nil); err == nil {
		t.Error("不正な ID でエラーにならない")
	}
}
