import { useCallback, useEffect, useReducer, useState } from "react";
import type { PlanData } from "../data/plan";
import { toISODate } from "../lib/dates";
import { loadPlan, reconcileState, savePlan } from "./planStorage";
import { reducer } from "./reducer";
import { loadState, memoryStorage, saveState, type KV } from "./storage";

function getStorage(): KV {
  try {
    const probe = "prep-tracker:probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage();
  }
}

export function useAppState() {
  const [storage] = useState(getStorage);
  const [initialPlan] = useState(() => loadPlan(storage));
  const [init] = useState(() => loadState(storage, initialPlan.plan?.validIds ?? null));
  const [state, dispatch] = useReducer(reducer, init.state);
  const [loaded, setLoaded] = useState(initialPlan);
  const [recovered, setRecovered] = useState(init.recovered);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!saveState(storage, state));
  }, [storage, state]);

  useEffect(() => {
    if (!init.existed) void navigator.storage?.persist?.().catch(() => undefined);
  }, [init.existed]);

  /** Swaps the plan and keeps only the progress and notes that still describe the same task. */
  const applyPlan = useCallback(
    (plan: PlanData, source: string, name: string): boolean => {
      const info = { name, importedAt: new Date().toISOString() };
      if (!savePlan(storage, source, info)) return false;
      dispatch({ type: "replace", state: reconcileState(state, loaded.plan, plan).state });
      setLoaded({ plan, info });
      return true;
    },
    [storage, state, loaded.plan],
  );

  return {
    state,
    dispatch,
    plan: loaded.plan,
    planInfo: loaded.info,
    applyPlan,
    recovered,
    dismissRecovered: () => setRecovered(false),
    saveFailed,
  };
}

/** Today's local date; refreshes when the app returns to the foreground or the day rolls over. */
export function useToday(): string {
  const [today, setToday] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const tick = () => setToday(toISODate(new Date()));
    const id = window.setInterval(tick, 60_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  return today;
}
