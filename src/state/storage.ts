import { isISODate } from "../lib/dates";
import type { AppState } from "../types";

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "prep-tracker:v1";
export const CORRUPT_KEY = "prep-tracker:corrupt-backup";
export const MAX_NOTE_LENGTH = 200;

export type KV = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type Validation = { ok: true; state: AppState } | { ok: false; error: string };

export const defaultState = (): AppState => ({
  schemaVersion: SCHEMA_VERSION,
  startDate: null,
  checked: {},
  notes: {},
  lastBackup: null,
});

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** Upgrades older schema versions step by step. Empty until a v2 exists. */
const MIGRATIONS: Record<number, (s: Obj) => Obj> = {};

export function migrate(raw: unknown): unknown {
  if (!isObj(raw)) return raw;
  let s = raw;
  while (typeof s.schemaVersion === "number" && s.schemaVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS[s.schemaVersion];
    if (!step) break;
    s = step(s);
  }
  return s;
}

export function validateState(raw: unknown, validIds: ReadonlySet<string>, totalDays = 56): Validation {
  const s = migrate(raw);
  if (!isObj(s)) return { ok: false, error: "Not an object" };
  if (typeof s.schemaVersion !== "number") return { ok: false, error: "Missing schemaVersion" };
  if (s.schemaVersion > SCHEMA_VERSION) return { ok: false, error: "Saved by a newer version of the app" };
  if (s.schemaVersion !== SCHEMA_VERSION) return { ok: false, error: "Unsupported schemaVersion" };

  for (const k of ["startDate", "lastBackup"] as const) {
    if (s[k] !== null && !isISODate(s[k])) return { ok: false, error: `Invalid ${k}` };
  }
  if (!isObj(s.checked)) return { ok: false, error: "Invalid checked" };
  const checked: Record<string, true> = {};
  for (const [id, v] of Object.entries(s.checked)) {
    if (v !== true || !validIds.has(id)) return { ok: false, error: `Unknown task "${id}"` };
    checked[id] = true;
  }
  if (!isObj(s.notes)) return { ok: false, error: "Invalid notes" };
  const notes: Record<string, string> = {};
  for (const [k, v] of Object.entries(s.notes)) {
    const day = Number(k);
    if (!Number.isInteger(day) || day < 1 || day > totalDays || String(day) !== k) {
      return { ok: false, error: `Invalid note day "${k}"` };
    }
    if (typeof v !== "string" || v.length > MAX_NOTE_LENGTH) return { ok: false, error: `Invalid note for day ${k}` };
    notes[k] = v;
  }
  return {
    ok: true,
    state: {
      schemaVersion: SCHEMA_VERSION,
      startDate: s.startDate as string | null,
      checked,
      notes,
      lastBackup: s.lastBackup as string | null,
    },
  };
}

export type LoadResult = { state: AppState; existed: boolean; recovered: boolean };

/** Never throws and never discards unreadable data: a corrupt value is copied to CORRUPT_KEY first. */
export function loadState(storage: KV, validIds: ReadonlySet<string>): LoadResult {
  let text: string | null = null;
  try {
    text = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: defaultState(), existed: false, recovered: false };
  }
  if (text === null) return { state: defaultState(), existed: false, recovered: false };

  let result: Validation;
  try {
    result = validateState(JSON.parse(text), validIds);
  } catch {
    result = { ok: false, error: "Invalid JSON" };
  }
  if (result.ok) return { state: result.state, existed: true, recovered: false };

  try {
    storage.setItem(CORRUPT_KEY, text);
  } catch {
    /* nothing more we can do */
  }
  return { state: defaultState(), existed: true, recovered: true };
}

export function saveState(storage: KV, state: AppState): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function memoryStorage(): KV {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
  };
}
