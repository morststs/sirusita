// デスクトップ版（Wails）のバックエンド。Go のバインディングをそのまま公開する。
// Web 版は web.js で、どちらを使うかは vite.config.js の '$backend' エイリアスで
// ビルド時に切り替える（App.svelte などは '$backend' から import するだけ）。
import { ImportFiles } from '../../wailsjs/go/main/App';
import { OnFileDrop, OnFileDropOff } from '../../wailsjs/runtime/runtime';

export { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from '../../wailsjs/go/main/NoteService';
export { ExportNote, ImportNote, RenderD2, OpenURL } from '../../wailsjs/go/main/App';

// Web 版にだけ出すもの（ブラウザ保存の案内など）の切り替えに使う。
export const IS_WEB = false;

// ファイルのドラッグ&ドロップ取り込み。cb には「取り込みを実行する関数」を渡す
// （App 側で未保存の本文を保存してから実行できるようにするため）。
export function OnImportDrop(cb) {
  // 第 2 引数 false でウィンドウ全体をドロップ対象にする
  OnFileDrop((x, y, paths) => {
    if (paths && paths.length > 0) cb(() => ImportFiles(paths));
  }, false);
}

export function OffImportDrop() {
  OnFileDropOff();
}
