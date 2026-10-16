import type { AppState } from "../types";
import { SCHEMA_VERSION, validateState } from "../state/storage";
import { daysBetween } from "./dates";

const APP_ID = "prep-tracker";
export const BACKUP_REMINDER_DAYS = 7;

export type ImportResult =
  | { ok: true; state: AppState; exportedAt: string | null }
  | { ok: false; error: string };

export function buildExport(state: AppState, nowIso: string, todayIso: string): string {
  const exported: AppState = { ...state, lastBackup: todayIso };
  return JSON.stringify({ app: APP_ID, schemaVersion: SCHEMA_VERSION, exportedAt: nowIso, state: exported }, null, 2);
}

export function parseImport(text: string, validIds: ReadonlySet<string>): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (typeof raw !== "object" || raw === null || (raw as { app?: unknown }).app !== APP_ID) {
    return { ok: false, error: "That file is not a Prep Tracker backup." };
  }
  const env = raw as { exportedAt?: unknown; state?: unknown };
  const v = validateState(env.state, validIds);
  if (!v.ok) return { ok: false, error: `Backup rejected: ${v.error}.` };
  return { ok: true, state: v.state, exportedAt: typeof env.exportedAt === "string" ? env.exportedAt : null };
}

/** True when there is progress and more than 7 days have passed since the last backup (or since the start date if none). */
export function needsBackupReminder(state: AppState, todayIso: string): boolean {
  if (Object.keys(state.checked).length === 0 && Object.keys(state.notes).length === 0) return false;
  const baseline = state.lastBackup ?? state.startDate;
  return baseline !== null && daysBetween(baseline, todayIso) > BACKUP_REMINDER_DAYS;
}
