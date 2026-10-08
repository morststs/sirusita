//go:build js && wasm

package main

import "syscall/js"

// Web 版（GitHub Pages）のエントリポイント。GOOS=js GOARCH=wasm でビルドし、
// フロントエンドの Web Worker（frontend/src/backend/sirusita.worker.js）内で動かす。
//
// グローバル関数 sirusitaCall(method, argsJSON, callback) を登録する。
// 結果は callback(resultJSON, errorMessage) で非同期に返す。
// js.FuncOf のコールバック内でブロックするとデッドロックするため
// （syscall/js の制約）、処理は必ず別 goroutine で行う。
func main() {
	js.Global().Set("sirusitaCall", js.FuncOf(func(this js.Value, args []js.Value) any {
		method := args[0].String()
		argsJSON := args[1].String()
		callback := args[2]
		go func() {
			result, err := callWeb(method, argsJSON)
			if err != nil {
				callback.Invoke(js.Null(), err.Error())
				return
			}
			callback.Invoke(result, js.Null())
		}()
		return nil
	}))
	select {}
}
