package main

import (
	"bytes"
	"context"
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
		Title: "マークダウンをインポート",
		Filters: []wailsruntime.FileFilter{
			{DisplayName: "Markdown (*.md;*.markdown)", Pattern: "*.md;*.markdown"},
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

// ImportFiles は与えられたパスのマークダウンファイルを取り込む（ドラッグ&ドロップ用）。
// .md / .markdown 以外のパスは無視する。戻り値は作成されたメモの一覧。
func (a *App) ImportFiles(paths []string) ([]Note, error) {
	md := make([]string, 0, len(paths))
	for _, p := range paths {
		switch strings.ToLower(filepath.Ext(p)) {
		case ".md", ".markdown":
			md = append(md, p)
		}
	}
	if len(md) == 0 {
		return nil, nil
	}
	return a.importPaths(md)
}

// importPaths は各パスを解析して新規メモを作成する共通処理。
func (a *App) importPaths(paths []string) ([]Note, error) {
	created := make([]Note, 0, len(paths))
	for _, path := range paths {
		data, err := os.ReadFile(path)
		if err != nil {
			return created, err
		}
		title, body, tags := parseMarkdownImport(data, path)
		note, err := a.NoteService.CreateNote(title, body, tags)
		if err != nil {
			return created, err
		}
		created = append(created, note)
	}
	return created, nil
}

// parseMarkdownImport は取り込むマークダウンを解析し、タイトル・本文・タグを抽出する。
// 1) YAML front matter があればそれを優先する。
// 2) なければ先頭の H1 見出し（# ...）をタイトルとして取り出す。
// 3) いずれも無ければファイル名（拡張子除く）をタイトルにする。
func parseMarkdownImport(data []byte, path string) (title, body string, tags []string) {
	tags = []string{}

	var meta NoteMeta
	rest, err := frontmatter.Parse(bytes.NewReader(data), &meta)
	// front matter を含む場合は本文部分のみを残す
	content := string(data)
	if err == nil {
		content = string(rest)
		if strings.TrimSpace(meta.Title) != "" {
			if meta.Tags != nil {
				tags = meta.Tags
			}
			return meta.Title, strings.TrimSpace(content), tags
		}
	}

	content = strings.TrimLeft(content, "\r\n")
	lines := strings.SplitN(content, "\n", 2)
	if len(lines) > 0 && strings.HasPrefix(strings.TrimSpace(lines[0]), "# ") {
		title = strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(lines[0]), "# "))
		if len(lines) > 1 {
			body = strings.TrimSpace(lines[1])
		}
		return title, body, tags
	}

	// H1 が無ければファイル名をタイトルにする
	base := filepath.Base(path)
	title = strings.TrimSuffix(base, filepath.Ext(base))
	return title, strings.TrimSpace(content), tags
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
