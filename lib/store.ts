import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const USE_KV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

// Types
type UsedItem = { url: string; savedAt: string };
type UsedList = { items: UsedItem[] };

// --- KV implementation ---
async function kvRead(): Promise<UsedItem[]> {
  try {
    const arr = await kv.get<UsedItem[]>('used:urls');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
async function kvWrite(items: UsedItem[]) {
  try {
    await kv.set('used:urls', items);
  } catch {}
}
async function kvAdd(url: string) {
  const items = await kvRead();
  if (!items.find(i => i.url === url)) {
    items.unshift({ url, savedAt: new Date().toISOString() });
    if (items.length > 1000) items.length = 1000;
    await kvWrite(items);
  }
}

// --- FS fallback (dev/local) ---
const DATA_DIR = path.join(process.cwd(), 'data');
const USED_PATH = path.join(DATA_DIR, 'used.json');

function ensureFS() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USED_PATH)) fs.writeFileSync(USED_PATH, JSON.stringify({ items: [] }, null, 2));
}
function fsRead(): UsedItem[] {
  try {
    ensureFS();
    const raw = fs.readFileSync(USED_PATH, 'utf-8');
    const j = JSON.parse(raw) as UsedList;
    return Array.isArray(j.items) ? j.items : [];
  } catch {
    return [];
  }
}
function fsWrite(items: UsedItem[]) {
  try {
    ensureFS();
    fs.writeFileSync(USED_PATH, JSON.stringify({ items }, null, 2));
  } catch {}
}
function fsAdd(url: string) {
  const items = fsRead();
  if (!items.find(i => i.url === url)) {
    items.unshift({ url, savedAt: new Date().toISOString() });
    if (items.length > 500) items.length = 500;
    fsWrite(items);
  }
}

// --- Public API (KV-first, FS fallback) ---
export async function readUsed(): Promise<UsedItem[]> {
  return USE_KV ? kvRead() : Promise.resolve(fsRead());
}

export async function writeUsed(items: UsedItem[]) {
  return USE_KV ? kvWrite(items) : Promise.resolve(fsWrite(items));
}

export async function addUsed(url: string) {
  return USE_KV ? kvAdd(url) : Promise.resolve(fsAdd(url));
}

export async function isUrlUsedWithin(url: string, days = 14) {
  const items = await readUsed();
  const hit = items.find(i => i.url === url);
  if (!hit) return false;
  const d = new Date(hit.savedAt).getTime();
  const diff = (Date.now() - d) / (1000*60*60*24);
  return diff >= 0 && diff <= days;
}