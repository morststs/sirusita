// Monaco Editor のスリム構成。エディタ本体 + Markdown のシンタックスのみを取り込み、
// 全言語版を避けてバンドルサイズを抑える。
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// Vite では ?worker でバンドルした Worker を MonacoEnvironment に渡す。
// Markdown 編集に必要なのは基本のエディタ Worker のみ。
self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

export default monaco;
