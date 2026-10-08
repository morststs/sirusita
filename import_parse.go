package main

import (
	"archive/zip"
	"bytes"
	"io"
	"path/filepath"
	"strings"

	"github.com/adrg/frontmatter"
)

// importedDoc は取り込むマークダウンの解析結果。
// created / modified は sirusita 形式のときだけ埋まり、それ以外は空文字。
type importedDoc struct {
	title    string
	body     string
	tags     []string
	created  string
	modified string
}

// importFrontMatter は取り込み時に front matter から読み取るフィールド。
// sirusita が空でなければ「sirusita 形式」と判定する。
type importFrontMatter struct {
	Title    string   `yaml:"title"`
	Tags     []string `yaml:"tags"`
	Created  string   `yaml:"created"`
	Modified string   `yaml:"modified"`
	Sirusita string   `yaml:"sirusita"`
}

// parseMarkdownImport は取り込むマークダウンを解析し、タイトル・本文・タグを抽出する。
//  1. YAML front matter があればそれを優先する。sirusita 形式（front matter に sirusita
//     フィールドあり）なら作成/更新日時もそのまま保持する。
//  2. なければ先頭の H1 見出し（# ...）をタイトルとして取り出す。
//  3. いずれも無ければファイル名（拡張子除く）をタイトルにする。
func parseMarkdownImport(data []byte, path string) importedDoc {
	doc := importedDoc{tags: []string{}}

	var fm importFrontMatter
	rest, err := frontmatter.Parse(bytes.NewReader(data), &fm)
	// front matter を含む場合は本文部分のみを残す
	content := string(data)
	if err == nil {
		content = string(rest)
		// sirusita 形式なら作成/更新日時を引き継ぐ
		if strings.TrimSpace(fm.Sirusita) != "" {
			doc.created = strings.TrimSpace(fm.Created)
			doc.modified = strings.TrimSpace(fm.Modified)
		}
		if strings.TrimSpace(fm.Title) != "" {
			if fm.Tags != nil {
				doc.tags = fm.Tags
			}
			doc.title = fm.Title
			doc.body = strings.TrimSpace(content)
			return doc
		}
	}

	content = strings.TrimLeft(content, "\r\n")
	lines := strings.SplitN(content, "\n", 2)
	if len(lines) > 0 && strings.HasPrefix(strings.TrimSpace(lines[0]), "# ") {
		doc.title = strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(lines[0]), "# "))
		if len(lines) > 1 {
			doc.body = strings.TrimSpace(lines[1])
		}
		return doc
	}

	// H1 が無ければファイル名をタイトルにする
	base := filepath.Base(path)
	doc.title = strings.TrimSuffix(base, filepath.Ext(base))
	doc.body = strings.TrimSpace(content)
	return doc
}

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
