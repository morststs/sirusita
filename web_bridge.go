package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
)

// webImportedDoc は Web 版へ返すインポート解析結果（importedDoc の JSON 版）。
type webImportedDoc struct {
	Title    string   `json:"title"`
	Body     string   `json:"body"`
	Tags     []string `json:"tags"`
	Created  string   `json:"created"`
	Modified string   `json:"modified"`
}

// callWeb は Web 版（wasm_main.go）からの呼び出しを振り分ける。argsJSON は文字列引数の
// JSON 配列、戻り値は結果の JSON 文字列。syscall/js に依存しない形でここに切り出し、
// 通常の go test で検証できるようにしている（wasm_main.go は GOOS=js でしかビルドされない）。
//   - RenderD2    [source]           → SVG 文字列
//   - ParseImport [name, base64Data] → []webImportedDoc
func callWeb(method, argsJSON string) (string, error) {
	var args []string
	if err := json.Unmarshal([]byte(argsJSON), &args); err != nil {
		return "", fmt.Errorf("引数の解析に失敗しました: %w", err)
	}
	arg := func(i int) (string, error) {
		if i >= len(args) {
			return "", fmt.Errorf("%s: 引数が不足しています", method)
		}
		return args[i], nil
	}

	var out any
	switch method {
	case "RenderD2":
		source, err := arg(0)
		if err != nil {
			return "", err
		}
		svg, err := renderD2(source)
		if err != nil {
			return "", err
		}
		out = svg
	case "ParseImport":
		name, err := arg(0)
		if err != nil {
			return "", err
		}
		encoded, err := arg(1)
		if err != nil {
			return "", err
		}
		data, err := base64.StdEncoding.DecodeString(encoded)
		if err != nil {
			return "", fmt.Errorf("ParseImport: データの復号に失敗しました: %w", err)
		}
		docs, err := parseImportFile(name, data)
		if err != nil {
			return "", err
		}
		res := make([]webImportedDoc, 0, len(docs))
		for _, d := range docs {
			tags := d.tags
			if tags == nil {
				tags = []string{}
			}
			res = append(res, webImportedDoc{Title: d.title, Body: d.body, Tags: tags, Created: d.created, Modified: d.modified})
		}
		out = res
	default:
		return "", fmt.Errorf("未知のメソッドです: %s", method)
	}

	data, err := json.Marshal(out)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
