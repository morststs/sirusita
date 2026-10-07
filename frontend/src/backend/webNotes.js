// Web 版のメモ保存（デスクトップ版の note_service.go に相当）。IndexedDB に保存する。
// localStorage は容量が約 5MB しかなく、メモ本文を丸ごと置くと溢れるため使わない。
// 振る舞いは noteLogic.js（= note_service.go と同じ規則）に従う。
import {
  UUID_RE, normalizeTags, buildNote, applyUpdate, toMeta, sortByModifiedDesc, collectTags, planRename,
} from './noteLogic.js';

const DB_NAME = 'sirusita';
const STORE = 'notes';

let dbPromise = null;
function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    // 失敗したら次回の呼び出しで開き直せるようにする
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}

// 1 トランザクションを実行する。fn がリクエストを返せばその結果を、返さなければ undefined を、
// トランザクション完了後に返す（書き込みは完了まで待ってから成功とみなす）。
async function run(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    let value;
    if (req) req.onsuccess = () => { value = req.result; };
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function checkId(id) {
  if (typeof id !== 'string' || !UUID_RE.test(id)) throw new Error(`invalid note ID: ${id}`);
}

// 読み込み時の整形（GetNote と同じく、タグを正規化し本文の前後の空白を除く）。
function toNote(rec) {
  return { ...rec, tags: normalizeTags(rec.tags), body: (rec.body ?? '').trim() };
}

async function allNotes() {
  const all = (await run('readonly', (s) => s.getAll())) ?? [];
  return all.filter((r) => UUID_RE.test(r.id)).map(toNote);
}

export async function ListNotes() {
  return sortByModifiedDesc((await allNotes()).map(toMeta));
}

export async function GetNote(id) {
  checkId(id);
  const rec = await run('readonly', (s) => s.get(id));
  if (!rec) throw new Error(`note not found: ${id}`);
  return toNote(rec);
}

export async function CreateImported(title, body, tags, created, modified) {
  const note = buildNote({ id: crypto.randomUUID(), title, body, tags, created, modified }, new Date());
  await run('readwrite', (s) => s.put(note));
  return note;
}

export function CreateNote(title, body, tags) {
  return CreateImported(title, body, tags, '', '');
}

export async function UpdateNote(id, title, body, tags) {
  const existing = await GetNote(id);
  const note = applyUpdate(existing, { title, body, tags }, new Date());
  await run('readwrite', (s) => s.put(note));
  return note;
}

export async function DeleteNote(id) {
  await GetNote(id); // 存在しなければ "note not found"
  await run('readwrite', (s) => s.delete(id));
}

export async function ListTags() {
  return collectTags(await allNotes());
}

export async function RenameTag(oldTag, newTag) {
  const changed = planRename(await allNotes(), oldTag, newTag);
  if (changed.length > 0) {
    await run('readwrite', (s) => {
      for (const note of changed) s.put(note);
    });
  }
  return changed.length;
}
