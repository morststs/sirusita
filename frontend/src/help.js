// ヘルプの本文（help.md）をビルド時に取り込む。
import raw from './help.md?raw';

export const HELP_TITLE = 'Sirusita の使い方';
export const HELP_BODY = raw;

// ビルド時に vite.config.js の define で埋め込む（例: v1.5.0）
export const APP_VERSION = __APP_VERSION__;
