package main

import (
	"archive/zip"
	"bytes"
	"context"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/adrg/frontmatter"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx         context.Context
	NoteService *NoteService
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// ExportNote は開いているマークダウンをファイルとして保存する。
// ネイティブの保存ダイアログを表示し、選択されたパスへ書き出す。
// 戻り値は保存先パス（キャンセル時は空文字）。
func (a *App) ExportNote(title, body string) (string, error) {
	// タイトルを H1 見出しとして付与した自己完結的なマークダウンを生成する
	var sb strings.Builder
	if strings.TrimSpace(title) != "" {
		sb.WriteString("# ")
		sb.WriteString(title)
		sb.WriteString("\n\n")
	}
	sb.WriteString(body)
	if !strings.HasSuffix(sb.String(), "\n") {
		sb.WriteString("\n")
	}

	defaultName := sanitizeFilename(title)
	if defaultName == "" {
		defaultName = "note"
	}
	defaultName += ".md"

	path, err := wailsruntime.SaveFileDialog(a.ctx, wailsruntime.SaveDialogOptions{
		Title:           "マークダウンをエクスポート",
		DefaultFilename: defaultName,
		Filters: []wailsruntime.FileFilter{
			{DisplayName: "Markdown (*.md)", Pattern: "*.md"},
			{DisplayName: "All Files (*.*)", Pattern: "*.*"},
		},
	})
	if err != nil {
		return "", err
	}
	if path == "" {
		// ユーザーがキャンセルした
		return "", nil
	}
	if err := os.WriteFile(path, []byte(sb.String()), 0644); err != nil {
		return "", err
	}
	return path, nil
}

// ImportNote はマークダウンファイルを選択してメモとして取り込む。
// ネイティブのファイル選択ダイアログ（複数選択可）を表示し、各ファイルを
// 解析して新規メモを作成する。戻り値は作成されたメモの一覧（キャンセル時は空）。
func (a *App) ImportNote() ([]Note, error) {
	paths, err := wailsruntime.OpenMultipleFilesDialog(a.ctx, wailsruntime.OpenDialogOptions{
		Title: "マークダウン / ZIP をインポート",
		Filters: []wailsruntime.FileFilter{
			{DisplayName: "Markdown / ZIP (*.md;*.markdown;*.zip)", Pattern: "*.md;*.markdown;*.zip"},
			{DisplayName: "All Files (*.*)", Pattern: "*.*"},
		},
	})
	if err != nil {
		return nil, err
	}
	if len(paths) == 0 {
		// ユーザーがキャンセルした
		return nil, nil
	}
	return a.importPaths(paths)
}

// ImportFiles は与えられたパスのマークダウン / ZIP を取り込む（ドラッグ&ドロップ用）。
// .md / .markdown / .zip 以外のパスは無視する。戻り値は作成されたメモの一覧。
func (a *App) ImportFiles(paths []string) ([]Note, error) {
	accepted := make([]string, 0, len(paths))
	for _, p := range paths {
		switch strings.ToLower(filepath.Ext(p)) {
		case ".md", ".markdown", ".zip":
			accepted = append(accepted, p)
		}
	}
	if len(accepted) == 0 {
		return nil, nil
	}
	return a.importPaths(accepted)
}

// importPaths は各パスを解析して新規メモを作成する共通処理。
// .zip は中の .md / .markdown をまとめて取り込む。
func (a *App) importPaths(paths []string) ([]Note, error) {
	created := make([]Note, 0, len(paths))
	for _, path := range paths {
		if strings.EqualFold(filepath.Ext(path), ".zip") {
			notes, err := a.importZip(path)
			if err != nil {
				return created, err
			}
			created = append(created, notes...)
			continue
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return created, err
		}
		note, err := a.createFromMarkdown(data, path)
		if err != nil {
			return created, err
		}
		created = append(created, note)
	}
	return created, nil
}

// importZip は ZIP 内の .md / .markdown エントリをまとめて取り込む。
func (a *App) importZip(path string) ([]Note, error) {
	r, err := zip.OpenReader(path)
	if err != nil {
		return nil, err
	}
	defer r.Close()

	created := make([]Note, 0, len(r.File))
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
			return created, err
		}
		data, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			return created, err
		}
		note, err := a.createFromMarkdown(data, f.Name)
		if err != nil {
			return created, err
		}
		created = append(created, note)
	}
	return created, nil
}

// createFromMarkdown はマークダウンを解析してメモを作成する。
// sirusita 形式なら作成/更新日時もそのまま保持する。
func (a *App) createFromMarkdown(data []byte, path string) (Note, error) {
	doc := parseMarkdownImport(data, path)
	return a.NoteService.CreateImported(doc.title, doc.body, doc.tags, doc.created, doc.modified)
}

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

// sanitizeFilename はタイトルをファイル名に使えるよう不正な文字を除去する。
func sanitizeFilename(name string) string {
	name = strings.TrimSpace(name)
	replacer := strings.NewReplacer(
		"/", "-", "\\", "-", ":", "-", "*", "-",
		"?", "-", "\"", "-", "<", "-", ">", "-", "|", "-",
		"\n", " ", "\r", " ", "\t", " ",
	)
	return strings.TrimSpace(replacer.Replace(name))
}

func (a *App) OpenURL(url string) error {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		cmd = exec.Command("open", url)
	case "linux":
		cmd = exec.Command("xdg-open", url)
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	default:
		return os.ErrInvalid
	}
	return cmd.Run()
}
