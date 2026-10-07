// Web 版（GitHub Pages）のバックエンド。wails.js と同じ関数を同じ形で提供する。
// - メモ: IndexedDB（webNotes.js）
// - D2 描画・インポート解析: Go を wasm にしたもの（wasm.js。必要になったときだけ読み込む）
// - インポート: <input type="file"> / ウィンドウへのドロップ
// - エクスポート: .md ファイルのダウンロード
import { CreateImported } from './webNotes.js';
import { callWasm } from './wasm.js';
import { exportMarkdown, exportFilename } from './noteLogic.js';

export { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag } from './webNotes.js';

export const IS_WEB = true;

const IMPORT_EXTS = ['.md', '.markdown', '.zip'];
const isImportable = (name) => IMPORT_EXTS.some((ext) => name.toLowerCase().endsWith(ext));

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

// .md / .markdown / .zip を取り込む（他は無視）。解析は wasm（app.go と同じ規則）。
async function importFiles(files) {
  const created = [];
  for (const file of files) {
    if (!isImportable(file.name)) continue;
    const docs = await callWasm('ParseImport', [file.name, toBase64(await file.arrayBuffer())]);
    for (const d of docs) {
      created.push(await CreateImported(d.title, d.body, d.tags, d.created, d.modified));
    }
  }
  return created;
}

export function ImportNote() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.md,.markdown,.zip';
    input.addEventListener('cancel', () => resolve([]));
    input.addEventListener('change', () => {
      importFiles([...(input.files || [])]).then(resolve, reject);
    });
    input.click();
  });
}

// .md をダウンロードさせ、ファイル名を返す（デスクトップ版は保存先パスを返す）。
export async function ExportNote(title, body) {
  const name = exportFilename(title || '');
  const blob = new Blob([exportMarkdown(title || '', body || '')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return name;
}

export function RenderD2(source) {
  return callWasm('RenderD2', [source]);
}

export async function OpenURL(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

let dropHandlers = null;

export function OnImportDrop(cb) {
  OffImportDrop();
  const over = (e) => {
    if (e.dataTransfer?.types?.includes('Files')) e.preventDefault();
  };
  const drop = (e) => {
    const files = [...(e.dataTransfer?.files || [])];
    if (files.length === 0) return;
    e.preventDefault();
    cb(() => importFiles(files));
  };
  window.addEventListener('dragover', over);
  window.addEventListener('drop', drop);
  dropHandlers = { over, drop };
}

export function OffImportDrop() {
  if (!dropHandlers) return;
  window.removeEventListener('dragover', dropHandlers.over);
  window.removeEventListener('drop', dropHandlers.drop);
  dropHandlers = null;
}
