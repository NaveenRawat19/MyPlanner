import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import {
  CORRUPT_KEY,
  STORAGE_KEY,
  defaultState,
  loadState,
  memoryStorage,
  saveState,
  validateState,
} from "./storage";
import { buildExport, needsBackupReminder, parseImport } from "../lib/backup";

const ids = new Set(["d1-dsa", "d1-hld", "d2-dsa"]);

describe("reducer", () => {
  it("toggles tasks", () => {
    const a = reducer(defaultState(), { type: "toggle", id: "d1-dsa" });
    expect(a.checked).toEqual({ "d1-dsa": true });
    expect(reducer(a, { type: "toggle", id: "d1-dsa" }).checked).toEqual({});
  });
  it("adds notes per task, in order, ignoring blanks", () => {
    let s = reducer(defaultState(), { type: "addNote", taskId: "d1-dsa", text: "  hello ", at: "t1" });
    s = reducer(s, { type: "addNote", taskId: "d1-dsa", text: "again", at: "t2" });
    expect(s.notes).toEqual({ "d1-dsa": [{ text: "hello", at: "t1" }, { text: "again", at: "t2" }] });
    expect(reducer(s, { type: "addNote", taskId: "d1-dsa", text: "   ", at: "t3" })).toBe(s);
  });
  it("deletes a note and drops the empty list", () => {
    let s = reducer(defaultState(), { type: "addNote", taskId: "d1-dsa", text: "a", at: "t1" });
    s = reducer(s, { type: "addNote", taskId: "d1-dsa", text: "b", at: "t2" });
    s = reducer(s, { type: "deleteNote", taskId: "d1-dsa", index: 0 });
    expect(s.notes).toEqual({ "d1-dsa": [{ text: "b", at: "t2" }] });
    expect(reducer(s, { type: "deleteNote", taskId: "d1-dsa", index: 0 }).notes).toEqual({});
  });
  it("reset keeps the start date only", () => {
    let s = reducer(defaultState(), { type: "setStartDate", date: "2026-10-16" });
    s = reducer(s, { type: "toggle", id: "d1-dsa" });
    s = reducer(s, { type: "markBackup", date: "2026-10-17" });
    expect(reducer(s, { type: "reset" })).toEqual({ ...defaultState(), startDate: "2026-10-16" });
  });
});

describe("persistence", () => {
  it("round-trips state", () => {
    const kv = memoryStorage();
    const s = { ...defaultState(), startDate: "2026-10-16", checked: { "d1-dsa": true as const }, notes: { "d1-dsa": [{ text: "n", at: "2026-10-16T09:00:00.000Z" }] } };
    expect(saveState(kv, s)).toBe(true);
    const r = loadState(kv, ids);
    expect(r).toEqual({ state: s, existed: true, recovered: false });
  });

  it("reports first launch", () => {
    expect(loadState(memoryStorage(), ids)).toEqual({ state: defaultState(), existed: false, recovered: false });
  });

  it("keeps a copy of corrupt JSON and recovers", () => {
    const kv = memoryStorage();
    kv.setItem(STORAGE_KEY, "{not json");
    const r = loadState(kv, ids);
    expect(r.recovered).toBe(true);
    expect(r.state).toEqual(defaultState());
    expect(kv.getItem(CORRUPT_KEY)).toBe("{not json");
    expect(kv.getItem(STORAGE_KEY)).toBe("{not json"); // not overwritten by load itself
  });

  it("treats structurally invalid state as corrupt", () => {
    const kv = memoryStorage();
    const bad = JSON.stringify({ ...defaultState(), checked: { "zzz": true } });
    kv.setItem(STORAGE_KEY, bad);
    expect(loadState(kv, ids).recovered).toBe(true);
    expect(kv.getItem(CORRUPT_KEY)).toBe(bad);
  });

  it("survives storage that throws", () => {
    const kv = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("full");
      },
      removeItem: () => {},
    };
    expect(loadState(kv, ids).state).toEqual(defaultState());
    expect(saveState(kv, defaultState())).toBe(false);
  });
});

describe("validateState", () => {
  const ok = defaultState();
  it("accepts a valid state", () => expect(validateState(ok, ids).ok).toBe(true));
  it("skips task id checks while no plan is loaded", () => {
    const s = { ...ok, checked: { "d9-x": true }, notes: { "d9-x": [{ text: "n", at: "" }] } };
    expect(validateState(s, null).ok).toBe(true);
    expect(validateState(s, ids).ok).toBe(false);
  });
  it("migrates v1 day notes onto the first task of that day", () => {
    const v1 = { schemaVersion: 1, startDate: "2026-10-16", checked: { "d1-hld": true }, notes: { "1": "old note", "2": " " }, lastBackup: null };
    const r = validateState(v1, ids);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state).toEqual({ ...ok, startDate: "2026-10-16", checked: { "d1-hld": true }, notes: { "d1-dsa": [{ text: "old note", at: "" }] } });
  });
  it.each([
    ["non-object", 5],
    ["no version", { ...ok, schemaVersion: undefined }],
    ["newer version", { ...ok, schemaVersion: 99 }],
    ["bad date", { ...ok, startDate: "2026-13-01" }],
    ["unknown id", { ...ok, checked: { x: true } }],
    ["false check", { ...ok, checked: { "d1-dsa": false } }],
    ["note for unknown task", { ...ok, notes: { zzz: [{ text: "x", at: "" }] } }],
    ["long note", { ...ok, notes: { "d1-dsa": [{ text: "x".repeat(501), at: "" }] } }],
    ["blank note", { ...ok, notes: { "d1-dsa": [{ text: " ", at: "" }] } }],
    ["string notes (v1 shape)", { ...ok, notes: { "d1-dsa": "x" } }],
    ["array", []],
  ])("rejects %s", (_n, v) => expect(validateState(v, ids).ok).toBe(false));
});

describe("backup", () => {
  const s = { ...defaultState(), startDate: "2026-10-16", checked: { "d2-dsa": true as const } };

  it("exports and re-imports", () => {
    const text = buildExport(s, "2026-10-20T10:00:00.000Z", "2026-10-20");
    const r = parseImport(text, ids);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state).toEqual({ ...s, lastBackup: "2026-10-20" });
  });

  it("rejects bad imports", () => {
    expect(parseImport("nope", ids).ok).toBe(false);
    expect(parseImport("{}", ids).ok).toBe(false);
    expect(parseImport(JSON.stringify({ app: "prep-tracker", state: { schemaVersion: 2 } }), ids).ok).toBe(false);
  });

  it("reminds only when stale and there is progress", () => {
    expect(needsBackupReminder(defaultState(), "2026-10-20")).toBe(false);
    expect(needsBackupReminder(s, "2026-10-20")).toBe(false); // no backup yet, started 4 days ago
    expect(needsBackupReminder(s, "2026-10-24")).toBe(true);
    expect(needsBackupReminder({ ...s, lastBackup: "2026-10-13" }, "2026-10-20")).toBe(false);
    expect(needsBackupReminder({ ...s, lastBackup: "2026-10-12" }, "2026-10-20")).toBe(true);
  });
});
