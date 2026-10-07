#!/bin/sh
# Web 版で使う Go の wasm（D2 描画・インポート解析。wasm_main.go）をビルドし、
# Go に付属するローダー wasm_exec.js と一緒に frontend/src/backend/generated/ へ出力する。
# 出力は生成物なので .gitignore 済み。`npm run build:web` から呼ばれる。
set -eu
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/frontend/src/backend/generated"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"
GOOS=js GOARCH=wasm go build -trimpath -ldflags="-s -w" -o "$OUT_DIR/sirusita.wasm" .
# wasm_exec.js はビルドに使った Go と同じバージョンのものでなければならない
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" "$OUT_DIR/wasm_exec.js"
