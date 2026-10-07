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
