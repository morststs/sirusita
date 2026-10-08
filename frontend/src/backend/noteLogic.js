// Web 版のメモ保存ロジック（note_service.go / app.go と同じ振る舞い）。
// IndexedDB に依存しない純粋関数だけを置き、node --test で検証する（webNotes.js が使う）。
import { normalizeTag, renameTags } from '../tagTree.js';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// 新しいメモの ID（UUID v4）。crypto.randomUUID はセキュアコンテキスト（HTTPS / localhost）でしか
// 使えないため、HTTP で開かれたときは getRandomValues（どこでも使える）から組み立てる。
export function newNoteId(c = globalThis.crypto) {
  if (typeof c.randomUUID === 'function') return c.randomUUID();
  const b = c.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// note_service.go の normalizeTags と同じ（正規化・空除去・重複除去・出現順保持）。
export function normalizeTags(tags) {
  const out = [];
  const seen = new Set();
  for (const tag of tags || []) {
    const t = normalizeTag(tag);
    if (t === '' || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

const pad = (n) => String(n).padStart(2, '0');

// Go の time.Now().Format(time.RFC3339) と同じ形（秒精度・ローカルのオフセット。UTC は "Z"）。
// 一覧の並び（modified の文字列比較）をデスクトップ版と揃えるため。
export function formatRFC3339(date) {
  const off = -date.getTimezoneOffset();
  const tz = off === 0 ? 'Z' : `${off > 0 ? '+' : '-'}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${tz}`;
}

// CreateImported 相当。created / modified が空なら現在時刻。
export function buildNote({ id, title, body, tags, created, modified }, now) {
  const ts = formatRFC3339(now);
  return { id, title: title ?? '', tags: normalizeTags(tags), created: created || ts, modified: modified || ts, body: body ?? '' };
}

// UpdateNote 相当。created は保持し、modified を現在時刻にする。
export function applyUpdate(existing, { title, body, tags }, now) {
  return { id: existing.id, title: title ?? '', tags: normalizeTags(tags), created: existing.created, modified: formatRFC3339(now), body: body ?? '' };
}

export function toMeta(note) {
  const { body, ...meta } = note;
  return meta;
}

// ListNotes と同じく modified の降順（文字列比較）。
export function sortByModifiedDesc(metas) {
  return [...metas].sort((a, b) => (a.modified < b.modified ? 1 : a.modified > b.modified ? -1 : 0));
}

// ListTags 相当（重複除去・ソート）。
export function collectTags(notes) {
  return [...new Set(notes.flatMap(n => normalizeTags(n.tags)))].sort();
}

// RenameTag 相当。タグが変わるメモだけを（日時・本文はそのまま）新しい値で返す。
export function planRename(notes, oldTag, newTag) {
  const from = normalizeTag(oldTag);
  const to = normalizeTag(newTag);
  if (from === '' || to === '') throw new Error('tag must not be empty');
  if (from === to) return [];
  const changed = [];
  for (const note of notes) {
    const tags = normalizeTags(note.tags);
    const renamed = normalizeTags(renameTags(tags, from, to));
    if (renamed.length !== tags.length || renamed.some((t, i) => t !== tags[i])) {
      changed.push({ ...note, tags: renamed });
    }
  }
  return changed;
}

// app.go の ExportNote と同じ本文（タイトルを H1 として付け、末尾は改行）。
export function exportMarkdown(title, body) {
  let s = '';
  if (title.trim() !== '') s += `# ${title}\n\n`;
  s += body;
  if (!s.endsWith('\n')) s += '\n';
  return s;
}

// app.go の sanitizeFilename と同じ置換。
export function sanitizeFilename(name) {
  return name.trim().replace(/[/\\:*?"<>|]/g, '-').replace(/[\n\r\t]/g, ' ').trim();
}

export function exportFilename(title) {
  const name = sanitizeFilename(title);
  return (name === '' ? 'note' : name) + '.md';
}
