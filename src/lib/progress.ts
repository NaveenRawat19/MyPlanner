import type { Checked, Day, Progress, Track, Week } from "../types";

const toProgress = (done: number, total: number): Progress => ({
  done,
  total,
  pct: total === 0 ? 0 : Math.round((done / total) * 100),
});

export const doneCount = (day: Day, checked: Checked): number =>
  day.tasks.filter((t) => checked[t.id]).length;

export const isDayComplete = (day: Day, checked: Checked): boolean =>
  day.tasks.length > 0 && doneCount(day, checked) === day.tasks.length;

export function overallProgress(plan: Week[], checked: Checked): Progress {
  const tasks = plan.flatMap((w) => w.days.flatMap((d) => d.tasks));
  return toProgress(tasks.filter((t) => checked[t.id]).length, tasks.length);
}

export function weekProgress(week: Week, checked: Checked): Progress {
  const tasks = week.days.flatMap((d) => d.tasks);
  return toProgress(tasks.filter((t) => checked[t.id]).length, tasks.length);
}

export function trackProgress(plan: Week[], checked: Checked): Record<Track, Progress> {
  const tasks = plan.flatMap((w) => w.days.flatMap((d) => d.tasks));
  const out: Record<Track, Progress> = {};
  for (const track of new Set(tasks.map((t) => t.track))) {
    const of = tasks.filter((t) => t.track === track);
    out[track] = toProgress(of.filter((t) => checked[t.id]).length, of.length);
  }
  return out;
}

/**
 * Consecutive fully completed days ending at `today` (a clamped plan day).
 * If today is not yet complete, the streak is counted back from yesterday.
 */
export function currentStreak(plan: Week[], checked: Checked, today: number): number {
  const byNumber = new Map(plan.flatMap((w) => w.days).map((d) => [d.day, d]));
  let n = today;
  const todayDay = byNumber.get(n);
  if (!todayDay || !isDayComplete(todayDay, checked)) n -= 1;
  let streak = 0;
  for (; n >= 1; n--) {
    const d = byNumber.get(n);
    if (!d || !isDayComplete(d, checked)) break;
    streak++;
  }
  return streak;
}

/** A day is missed once its day number is in the past and it is not complete. */
export const isMissed = (day: Day, checked: Checked, raw: number): boolean =>
  day.day < raw && !isDayComplete(day, checked);

export const daysBehind = (plan: Week[], checked: Checked, raw: number): number =>
  plan.flatMap((w) => w.days).filter((d) => isMissed(d, checked, raw)).length;
