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
