// ヘルプの本文。サンプル集（contents/）の「Sirusita の使い方」をビルド時に取り込み、
// サンプル ZIP とアプリ内ヘルプで同じ内容を使う。
import raw from '../../contents/Sirusita の使い方.md?raw';
import { stripFrontMatter } from './frontMatter.js';

export const HELP_TITLE = 'Sirusita の使い方';
export const HELP_BODY = stripFrontMatter(raw);

// ビルド時に vite.config.js の define で埋め込む（例: v1.5.0）
export const APP_VERSION = __APP_VERSION__;
