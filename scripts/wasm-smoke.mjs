// Web 版の wasm（scripts/build-wasm.sh の出力）を Node で起動し、
// RenderD2 と ParseImport が動くことを確かめる。
//   sh scripts/build-wasm.sh && node scripts/wasm-smoke.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../frontend/src/backend/generated/', import.meta.url);
await import(new URL('wasm_exec.js', dir).href); // globalThis.Go を定義する
const go = new globalThis.Go();
const { instance } = await WebAssembly.instantiate(readFileSync(new URL('sirusita.wasm', dir)), go.importObject);
go.run(instance); // main() が select{} でブロックした時点で sirusitaCall は登録済み

const call = (method, args) =>
  new Promise((resolve, reject) =>
    globalThis.sirusitaCall(method, JSON.stringify(args), (result, error) =>
      error != null ? reject(new Error(error)) : resolve(JSON.parse(result))));

const svg = await call('RenderD2', ['a -> b']);
assert.ok(svg.includes('<svg'), 'RenderD2 が SVG を返さない');

const md = Buffer.from('# タイトル\n\n本文\n').toString('base64');
const docs = await call('ParseImport', ['x.md', md]);
assert.equal(docs.length, 1);
assert.equal(docs[0].title, 'タイトル');
assert.deepEqual(docs[0].tags, []);

await assert.rejects(call('Nope', []));
console.log('wasm smoke: ok');
process.exit(0);
