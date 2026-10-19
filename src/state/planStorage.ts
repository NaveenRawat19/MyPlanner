import { makePlan, type PlanData } from "../data/plan";
import { parsePlan } from "../lib/planParser";
import type { AppState, Notes } from "../types";
import type { KV } from "./storage";

export const PLAN_KEY = "prep-tracker:plan:v1";

export type PlanInfo = { name: string; importedAt: string };
/** `plan` is null until the user creates or imports one: the app ships without a plan. */
export type LoadedPlan = { plan: PlanData | null; info: PlanInfo | null };

/** The imported plan is kept as its source text and re-parsed on load, so the parser is the only validator. */
export function loadPlan(storage: KV): LoadedPlan {
  try {
    const text = storage.getItem(PLAN_KEY);
    if (text === null) return { plan: null, info: null };
    const raw = JSON.parse(text) as { source?: unknown; name?: unknown; importedAt?: unknown };
    if (typeof raw.source !== "string") throw new Error("bad plan");
    const plan = makePlan(parsePlan(raw.source));
    const name = typeof raw.name === "string" ? raw.name : "Imported plan";
    const importedAt = typeof raw.importedAt === "string" ? raw.importedAt : "";
    return { plan, info: { name, importedAt } };
  } catch {
    return { plan: null, info: null };
  }
}

export function savePlan(storage: KV, source: string, info: PlanInfo): boolean {
  try {
    storage.setItem(PLAN_KEY, JSON.stringify({ source, ...info }));
    return true;
  } catch {
    return false;
  }
}

export type Reconciled = {
  state: AppState;
  keptChecked: number;
  droppedChecked: number;
  droppedNotes: number;
};

/**
 * Carries progress and notes over to a new plan. A task keeps its tick and notes only if the new plan
 * has the same id with the same track and text; anything else would describe a different task.
 */
export function reconcileState(state: AppState, oldPlan: PlanData | null, newPlan: PlanData): Reconciled {
  const text = (plan: PlanData | null) =>
    new Map(plan ? plan.days.flatMap((d) => d.tasks.map((t) => [t.id, `${t.track}\n${t.text}`])) : []);
  const before = text(oldPlan);
  const after = text(newPlan);
  const same = (id: string) => before.get(id) !== undefined && before.get(id) === after.get(id);

  const checked: Record<string, true> = {};
  let droppedChecked = 0;
  for (const id of Object.keys(state.checked)) {
    if (same(id)) checked[id] = true;
    else droppedChecked++;
  }
  const notes: Record<string, Notes[string]> = {};
  let droppedNotes = 0;
  for (const [id, list] of Object.entries(state.notes)) {
    if (same(id)) notes[id] = list;
    else droppedNotes += list.length;
  }
  return {
    state: { ...state, checked, notes },
    keptChecked: Object.keys(checked).length,
    droppedChecked,
    droppedNotes,
  };
}
