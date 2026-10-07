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
