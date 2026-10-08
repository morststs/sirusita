//go:build !js

package main

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

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
// .zip は中の .md / .markdown をまとめて取り込む（解析は import_parse.go）。
func (a *App) importPaths(paths []string) ([]Note, error) {
	created := make([]Note, 0, len(paths))
	for _, path := range paths {
		data, err := os.ReadFile(path)
		if err != nil {
			return created, err
		}
		docs, err := parseImportFile(path, data)
		if err != nil {
			return created, err
		}
		for _, doc := range docs {
			note, err := a.NoteService.CreateImported(doc.title, doc.body, doc.tags, doc.created, doc.modified)
			if err != nil {
				return created, err
			}
			created = append(created, note)
		}
	}
	return created, nil
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

// RenderD2 は D2 のソースを SVG 文字列へ変換する（本体は d2_render.go の renderD2）。
// フロントエンドの ```d2 コードブロックから呼び出される。
func (a *App) RenderD2(source string) (string, error) {
	return renderD2(source)
}
