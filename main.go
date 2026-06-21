package main

import (
	"embed"
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
			Assets: assets,
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
