// Web 版の wasm（wasm_main.go。D2 描画・インポート解析）を動かす Worker。
// コンパイル済みの WebAssembly.Module はメインスレッドから 'init' で受け取る
// （Worker を作り直すたびにダウンロード・コンパイルし直さないため。wasm.js 参照）。
import './generated/wasm_exec.js';

let ready = null;

async function start(module) {
  const go = new Go();
  const instance = await WebAssembly.instantiate(module, go.importObject);
  // go.run() は main() がブロックするまで同期的に実行するので、戻った時点で
  // sirusitaCall は登録済み。run 自体の Promise はプロセス終了まで解決しない。
  go.run(instance);
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === 'init') {
    ready = start(msg.module);
    return;
  }
  try {
    await ready;
  } catch (err) {
    self.postMessage({ id: msg.id, error: `wasm を起動できませんでした: ${err?.message || err}` });
    return;
  }
  self.sirusitaCall(msg.method, JSON.stringify(msg.args), (result, error) => {
    self.postMessage({ id: msg.id, result, error });
  });
};
