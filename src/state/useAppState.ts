import { useEffect, useReducer, useState } from "react";
import { VALID_IDS } from "../data/plan";
import { toISODate } from "../lib/dates";
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
  const [init] = useState(() => loadState(storage, VALID_IDS));
  const [state, dispatch] = useReducer(reducer, init.state);
  const [recovered, setRecovered] = useState(init.recovered);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!saveState(storage, state));
  }, [storage, state]);

  useEffect(() => {
    if (!init.existed) void navigator.storage?.persist?.().catch(() => undefined);
  }, [init.existed]);

  return { state, dispatch, recovered, dismissRecovered: () => setRecovered(false), saveFailed };
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
