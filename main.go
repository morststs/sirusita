package main

import (
	"embed"
	"net/http"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

// noCacheMiddleware はフロントエンド資産に no-store を付与する。
// WebView2 が index.html / JS をキャッシュすると、exe を更新しても古い画面が
// 表示され続ける（実際に発生）。毎回必ず再取得させてこれを防ぐ。
func noCacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		next.ServeHTTP(w, r)
	})
}

func main() {
	app := NewApp()

	homeDir, _ := os.UserHomeDir()
	notesDir := filepath.Join(homeDir, ".sirusita", "notes")
	app.NoteService = NewNoteService(notesDir)

	err := wails.Run(&options.App{
		Title:  "Sirusita",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:     assets,
			Middleware: noCacheMiddleware,
		},
		BackgroundColour: &options.RGBA{R: 30, G: 30, B: 30, A: 1},
		// マークダウンファイルのドラッグ&ドロップ取り込みを有効化する
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop: true,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
			app.NoteService,
		},
		Windows: &windows.Options{
			Theme: windows.Dark,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar:          windows.RGB(30, 30, 30),
				DarkModeTitleBarInactive:  windows.RGB(37, 37, 38),
				DarkModeTitleText:         windows.RGB(204, 204, 204),
				DarkModeTitleTextInactive: windows.RGB(150, 150, 150),
				DarkModeBorder:            windows.RGB(60, 60, 60),
				DarkModeBorderInactive:    windows.RGB(60, 60, 60),
			},
		},
		Linux: &linux.Options{
			ProgramName: "Sirusita",
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
