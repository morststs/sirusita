// Web 版: Go を wasm にしたもの（wasm_main.go）を Worker で動かし、D2 描画と
// インポート解析に使う。wasm は gzip 後でも約 7MB あるため、最初に呼ばれたときに
// 初めてダウンロードする（メモを開くだけなら読み込まない）。
import wasmUrl from './generated/sirusita.wasm?url';
import SirusitaWorker from './sirusita.worker.js?worker';

// wasm にはプリエンプションが無く Go 側で打ち切れないため、メインスレッドで
// 時間を区切り、超えたら Worker ごと作り直す。
const CALL_TIMEOUT_MS = 30000;

let modulePromise = null;
function compiledModule() {
  if (!modulePromise) {
    modulePromise = (async () => {
      try {
        return await WebAssembly.compileStreaming(fetch(wasmUrl));
      } catch {
        // MIME タイプが application/wasm でないサーバー向けのフォールバック
        const res = await fetch(wasmUrl);
        return WebAssembly.compile(await res.arrayBuffer());
      }
    })();
    // 失敗したら次回の呼び出しで取得し直せるようにする
    modulePromise.catch(() => {
      modulePromise = null;
    });
  }
  return modulePromise;
}

let worker = null;
const pending = new Map();
let nextId = 0;

// Worker を破棄し、応答待ちの呼び出しをすべて err で失敗させる。
function resetWorker(err) {
  if (worker) worker.terminate();
  worker = null;
  const list = [...pending.values()];
  pending.clear();
  for (const p of list) {
    clearTimeout(p.timer);
    p.reject(err);
  }
}

async function ensureWorker() {
  if (worker) return worker;
  const module = await compiledModule();
  if (worker) return worker;
  const w = new SirusitaWorker();
  w.onmessage = (e) => {
    const { id, result, error } = e.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    clearTimeout(p.timer);
    if (error != null) p.reject(new Error(error));
    else p.resolve(JSON.parse(result));
  };
  w.onerror = () => resetWorker(new Error('wasm の実行中にエラーが発生しました'));
  w.postMessage({ type: 'init', module });
  worker = w;
  return w;
}

// method を wasm で実行する。args は文字列の配列（web_bridge.go の callWeb 参照）。
export async function callWasm(method, args) {
  const w = await ensureWorker();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(
      () => resetWorker(new Error('処理がタイムアウトしました（30 秒以内に完了しませんでした）')),
      CALL_TIMEOUT_MS,
    );
    pending.set(id, { resolve, reject, timer });
    w.postMessage({ type: 'call', id, method, args });
  });
}
