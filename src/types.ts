/** Free-form track name from the plan file (e.g. "DSA", "HLD"). */
export type Track = string;

export type Task = {
  id: string;
  track: Track;
  text: string;
  links: { label: string; url: string }[];
};
export type Day = { day: number; label: string; isReview: boolean; tasks: Task[] };
export type Week = { week: number; title: string; days: Day[] };

export type Checked = Readonly<Record<string, true>>;

export type Note = { text: string; at: string };
/** Notes keyed by task id, oldest first. */
export type Notes = Readonly<Record<string, readonly Note[]>>;

export type AppState = {
  schemaVersion: number;
  startDate: string | null;
  checked: Checked;
  notes: Notes;
  lastBackup: string | null;
};

export type Progress = { done: number; total: number; pct: number };
