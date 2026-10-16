export type Track = "DSA" | "HLD" | "LLD" | "AI";
export const TRACKS: readonly Track[] = ["DSA", "HLD", "LLD", "AI"];

export type Task = {
  id: string;
  track: Track;
  text: string;
  links: { label: string; url: string }[];
};
export type Day = { day: number; label: string; isReview: boolean; tasks: Task[] };
export type Week = { week: number; title: string; days: Day[] };

export type Checked = Readonly<Record<string, true>>;

export type AppState = {
  schemaVersion: number;
  startDate: string | null;
  checked: Checked;
  /** keyed by day number as a string */
  notes: Readonly<Record<string, string>>;
  lastBackup: string | null;
};

export type Progress = { done: number; total: number; pct: number };
