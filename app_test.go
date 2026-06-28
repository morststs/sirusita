package main

import (
	"archive/zip"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// newTestApp はテスト用に一時ディレクトリへ書き出す App を返す。
func newTestApp(t *testing.T) *App {
	t.Helper()
	dir := t.TempDir()
	return &App{NoteService: NewNoteService(dir)}
}

// 保存したメモの front matter に sirusita 形式マーカーが入ることを確認する。
func TestWriteNoteIncludesSirusitaMarker(t *testing.T) {
	svc := NewNoteService(t.TempDir())
	note, err := svc.CreateNote("タイトル", "本文", []string{"tag1"})
	if err != nil {
		t.Fatalf("CreateNote: %v", err)
	}
	data, err := os.ReadFile(filepath.Join(svc.notesDir, note.ID+".md"))
	if err != nil {
		t.Fatalf("ReadFile: %v", err)
	}
	if !strings.Contains(string(data), "sirusita: \"1\"") {
		t.Errorf("front matter に sirusita マーカーが無い:\n%s", data)
	}
}

// sirusita 形式のマークダウンは題名・タグ・作成/更新日時をそのまま取り込む。
func TestParseMarkdownImportSirusita(t *testing.T) {
	md := []byte(`---
title: "見本"
tags:
  - "A"
  - "B"
created: 2025-01-02T03:04:05+09:00
modified: 2025-06-07T08:09:10+09:00
sirusita: "1"
---

本文テキスト
`)
	doc := parseMarkdownImport(md, "ignored.md")
	if doc.title != "見本" {
		t.Errorf("title = %q, want 見本", doc.title)
	}
	if strings.Join(doc.tags, ",") != "A,B" {
		t.Errorf("tags = %v, want [A B]", doc.tags)
	}
	if doc.created != "2025-01-02T03:04:05+09:00" {
		t.Errorf("created = %q（sirusita 形式では保持されるべき）", doc.created)
	}
	if doc.modified != "2025-06-07T08:09:10+09:00" {
		t.Errorf("modified = %q（sirusita 形式では保持されるべき）", doc.modified)
	}
}

// sirusita マーカーが無い front matter では日時を引き継がない（取り込み時に現在時刻になる）。
func TestParseMarkdownImportNonSirusita(t *testing.T) {
	md := []byte(`---
title: "外部メモ"
created: 2020-01-01T00:00:00+09:00
---

本文
`)
	doc := parseMarkdownImport(md, "ignored.md")
	if doc.title != "外部メモ" {
		t.Errorf("title = %q", doc.title)
	}
	if doc.created != "" {
		t.Errorf("created = %q（非 sirusita 形式では引き継がない）", doc.created)
	}
}

// ZIP に含まれる複数の .md を一括で取り込めることを確認する。
func TestImportZip(t *testing.T) {
	app := newTestApp(t)
	zipPath := filepath.Join(t.TempDir(), "bundle.zip")

	f, err := os.Create(zipPath)
	if err != nil {
		t.Fatalf("Create zip: %v", err)
	}
	zw := zip.NewWriter(f)
	files := map[string]string{
		"a.md":       "---\ntitle: \"A\"\nsirusita: \"1\"\n---\n\n本文A\n",
		"sub/b.md":   "# B見出し\n\n本文B\n",
		"readme.txt": "無視されるべき\n",
		"c.markdown": "---\ntitle: \"C\"\n---\n\n本文C\n",
	}
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
	f.Close()

	notes, err := app.importZip(zipPath)
	if err != nil {
		t.Fatalf("importZip: %v", err)
	}
	// .md / .markdown の 3 件のみ取り込まれ、.txt は無視される。
	if len(notes) != 3 {
		t.Fatalf("取り込み件数 = %d, want 3", len(notes))
	}
	titles := map[string]bool{}
	for _, n := range notes {
		titles[n.Title] = true
	}
	for _, want := range []string{"A", "B見出し", "C"} {
		if !titles[want] {
			t.Errorf("タイトル %q が取り込まれていない: %v", want, titles)
		}
	}
}

// 配布用コンテンツ（contents/*.md）が全て sirusita 形式として正しく解析できることを保証する。
func TestContentsLibraryIsValid(t *testing.T) {
	paths, err := filepath.Glob(filepath.Join("contents", "*.md"))
	if err != nil {
		t.Fatalf("Glob: %v", err)
	}
	if len(paths) == 0 {
		t.Skip("contents ディレクトリが無いためスキップ")
	}
	for _, p := range paths {
		data, err := os.ReadFile(p)
		if err != nil {
			t.Fatalf("ReadFile %s: %v", p, err)
		}
		doc := parseMarkdownImport(data, p)
		if strings.TrimSpace(doc.title) == "" {
			t.Errorf("%s: title が空（front matter が壊れている可能性）", p)
		}
		// sirusita 形式なら created が引き継がれる。
		if doc.created == "" {
			t.Errorf("%s: sirusita マーカー or created が欠落している", p)
		}
		if strings.TrimSpace(doc.body) == "" {
			t.Errorf("%s: 本文が空", p)
		}
	}
}
