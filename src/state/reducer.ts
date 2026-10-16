import type { AppState } from "../types";
import { SCHEMA_VERSION } from "./storage";

export type Action =
  | { type: "toggle"; id: string }
  | { type: "setNote"; day: number; text: string }
  | { type: "setStartDate"; date: string }
  | { type: "markBackup"; date: string }
  | { type: "replace"; state: AppState }
  | { type: "reset" };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "toggle": {
      const checked = { ...state.checked };
      if (checked[action.id]) delete checked[action.id];
      else checked[action.id] = true;
      return { ...state, checked };
    }
    case "setNote": {
      const notes = { ...state.notes };
      const key = String(action.day);
      if (action.text.trim() === "") delete notes[key];
      else notes[key] = action.text;
      return { ...state, notes };
    }
    case "setStartDate":
      return { ...state, startDate: action.date };
    case "markBackup":
      return { ...state, lastBackup: action.date };
    case "replace":
      return action.state;
    case "reset":
      // Keeps the start date; clears progress, notes and the backup date.
      return { schemaVersion: SCHEMA_VERSION, startDate: state.startDate, checked: {}, notes: {}, lastBackup: null };
  }
}
