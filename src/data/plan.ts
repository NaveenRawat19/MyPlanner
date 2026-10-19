import type { Day, Week } from "../types";

export type PlanData = {
  weeks: Week[];
  days: Day[];
  total: number;
  validIds: ReadonlySet<string>;
  /** Track names in order of first appearance. */
  tracks: string[];
};

export function makePlan(weeks: Week[]): PlanData {
  const days = weeks.flatMap((w) => w.days);
  const tasks = days.flatMap((d) => d.tasks);
  return {
    weeks,
    days,
    total: days.length,
    validIds: new Set(tasks.map((t) => t.id)),
    tracks: [...new Set(tasks.map((t) => t.track))],
  };
}

export const weekOfDay = (plan: PlanData, day: number): Week | undefined =>
  plan.weeks.find((w) => w.days.some((d) => d.day === day));
