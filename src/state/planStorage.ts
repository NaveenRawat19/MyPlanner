import { bundledPlan, makePlan, type PlanData } from "../data/plan";
import { parsePlan } from "../lib/planParser";
import type { AppState, Notes } from "../types";
import type { KV } from "./storage";

export const PLAN_KEY = "prep-tracker:plan:v1";

export type CustomPlanInfo = { name: string; importedAt: string };
export type LoadedPlan = { plan: PlanData; custom: CustomPlanInfo | null };

/** The imported plan is kept as its source text and re-parsed on load, so the parser is the only validator. */
export function loadPlan(storage: KV): LoadedPlan {
  try {
    const text = storage.getItem(PLAN_KEY);
    if (text === null) return { plan: bundledPlan, custom: null };
    const raw = JSON.parse(text) as { source?: unknown; name?: unknown; importedAt?: unknown };
    if (typeof raw.source !== "string") throw new Error("bad plan");
    const plan = makePlan(parsePlan(raw.source));
    const name = typeof raw.name === "string" ? raw.name : "Imported plan";
    const importedAt = typeof raw.importedAt === "string" ? raw.importedAt : "";
    return { plan, custom: { name, importedAt } };
  } catch {
    return { plan: bundledPlan, custom: null };
  }
}

export function savePlan(storage: KV, source: string, info: CustomPlanInfo): boolean {
  try {
    storage.setItem(PLAN_KEY, JSON.stringify({ source, ...info }));
    return true;
  } catch {
    return false;
  }
}

export function clearPlan(storage: KV): boolean {
  try {
    storage.removeItem(PLAN_KEY);
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
export function reconcileState(state: AppState, oldPlan: PlanData, newPlan: PlanData): Reconciled {
  const text = (plan: PlanData) => new Map(plan.days.flatMap((d) => d.tasks.map((t) => [t.id, `${t.track}\n${t.text}`])));
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
