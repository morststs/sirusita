package main

import (
	"context"
	"fmt"

	"oss.terrastruct.com/d2/d2graph"
	"oss.terrastruct.com/d2/d2layouts/d2dagrelayout"
	"oss.terrastruct.com/d2/d2lib"
	"oss.terrastruct.com/d2/d2renderers/d2svg"
	"oss.terrastruct.com/d2/d2themes/d2themescatalog"
	"oss.terrastruct.com/d2/lib/textmeasure"
	"oss.terrastruct.com/util-go/go2"
)

// RenderD2 は D2 のソースを SVG 文字列へ変換する（完全オフライン・Go ネイティブ）。
// フロントエンドの ```d2 コードブロックから呼び出される。
// レイアウトは外部依存のない dagre エンジン、テーマは UI に合わせたダーク系を使う。
func (a *App) RenderD2(source string) (svg string, err error) {
	// 不正な D2 ソースは Compile/Layout が panic することがあるため、
	// recover でエラーへ変換し、レンダリング失敗でアプリが落ちないようにする。
	defer func() {
		if r := recover(); r != nil {
			svg = ""
			err = fmt.Errorf("D2 のレンダリングに失敗しました: %v", r)
		}
	}()

	ruler, err := textmeasure.NewRuler()
	if err != nil {
		return "", err
	}

	layoutResolver := func(engine string) (d2graph.LayoutGraph, error) {
		return d2dagrelayout.DefaultLayout, nil
	}

	darkTheme := d2themescatalog.DarkMauve.ID
	renderOpts := &d2svg.RenderOpts{
		Pad:     go2.Pointer(int64(d2svg.DEFAULT_PADDING)),
		ThemeID: &darkTheme,
	}
	compileOpts := &d2lib.CompileOptions{
		LayoutResolver: layoutResolver,
		Ruler:          ruler,
	}

	diagram, _, err := d2lib.Compile(context.Background(), source, compileOpts, renderOpts)
	if err != nil {
		return "", err
	}

	out, err := d2svg.Render(diagram, renderOpts)
	if err != nil {
		return "", err
	}
	return string(out), nil
}
