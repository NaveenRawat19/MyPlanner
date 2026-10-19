import type { AppState } from "../types";
import { MAX_NOTE_LENGTH, MAX_NOTES_PER_TASK, SCHEMA_VERSION } from "./storage";

export type Action =
  | { type: "toggle"; id: string }
  | { type: "addNote"; taskId: string; text: string; at: string }
  | { type: "deleteNote"; taskId: string; index: number }
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
    case "addNote": {
      const text = action.text.trim().slice(0, MAX_NOTE_LENGTH);
      const existing = state.notes[action.taskId] ?? [];
      if (text === "" || existing.length >= MAX_NOTES_PER_TASK) return state;
      return { ...state, notes: { ...state.notes, [action.taskId]: [...existing, { text, at: action.at }] } };
    }
    case "deleteNote": {
      const list = (state.notes[action.taskId] ?? []).filter((_, i) => i !== action.index);
      const notes = { ...state.notes };
      if (list.length === 0) delete notes[action.taskId];
      else notes[action.taskId] = list;
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
