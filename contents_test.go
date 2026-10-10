//go:build !js

package main

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

// d2FenceRE は行頭の ```d2 〜 ``` を拾う（4 連バッククォートの中に書いた「書き方の例」は対象外）。
// Windows の checkout では改行が CRLF になるため、閉じフェンスの後ろの \r も許す。
var d2FenceRE = regexp.MustCompile("(?m)^```d2[ \t]*\r?\n([\\s\\S]*?)\r?\n```[ \t]*\r?$")

// サンプル集（contents/）とアプリ内ヘルプ（frontend/src/help.md）の D2 の図が、
// すべてアプリで描画できることを確認する。
func TestContentsD2BlocksRender(t *testing.T) {
	files, err := filepath.Glob(filepath.Join("contents", "*.md"))
	if err != nil {
		t.Fatal(err)
	}
	files = append(files, filepath.Join("frontend", "src", "help.md"))
	total := 0
	for _, f := range files {
		data, err := os.ReadFile(f)
		if err != nil {
			t.Fatal(err)
		}
		for i, m := range d2FenceRE.FindAllStringSubmatch(string(data), -1) {
			total++
			svg, err := renderD2(m[1])
			if err != nil {
				t.Errorf("%s の %d 個目の d2 ブロックを描画できない: %v", filepath.Base(f), i+1, err)
				continue
			}
			if !strings.Contains(svg, "<svg") {
				t.Errorf("%s の %d 個目の d2 ブロックの出力が SVG ではない", filepath.Base(f), i+1)
			}
		}
	}
	if total == 0 {
		t.Fatal("contents/ とヘルプに d2 ブロックが 1 つも無い")
	}
	t.Logf("d2 ブロック %d 個を描画", total)
}
