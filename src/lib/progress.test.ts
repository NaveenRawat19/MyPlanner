import { describe, expect, it } from "vitest";
import type { Checked, Day, Week } from "../types";
import {
  currentStreak,
  daysBehind,
  isDayComplete,
  isMissed,
  overallProgress,
  trackProgress,
  weekProgress,
} from "./progress";

const mkDay = (n: number): Day => ({
  day: n,
  label: `Day ${n}`,
  isReview: false,
  tasks: (["DSA", "HLD", "LLD", "AI"] as const).map((track) => ({
    id: `d${n}-${track.toLowerCase()}`,
    track,
    text: "x",
    links: [],
  })),
});
// 2 weeks of 3 days to keep fixtures small
const plan: Week[] = [
  { week: 1, title: "a", days: [mkDay(1), mkDay(2), mkDay(3)] },
  { week: 2, title: "b", days: [mkDay(4), mkDay(5), mkDay(6)] },
];
const full = (...days: number[]): Checked =>
  Object.fromEntries(days.flatMap((n) => ["dsa", "hld", "lld", "ai"].map((t) => [`d${n}-${t}`, true as const])));

describe("progress selectors", () => {
  it("computes overall, week and track progress", () => {
    const checked: Checked = { ...full(1), "d4-dsa": true };
    expect(overallProgress(plan, checked)).toEqual({ done: 5, total: 24, pct: 21 });
    expect(weekProgress(plan[0], checked)).toEqual({ done: 4, total: 12, pct: 33 });
    expect(weekProgress(plan[1], checked).done).toBe(1);
    const t = trackProgress(plan, checked);
    expect(t.DSA).toEqual({ done: 2, total: 6, pct: 33 });
    expect(t.AI).toEqual({ done: 1, total: 6, pct: 17 });
  });

  it("handles empty state", () => {
    expect(overallProgress(plan, {}).pct).toBe(0);
    expect(overallProgress([], {})).toEqual({ done: 0, total: 0, pct: 0 });
  });

  it("detects complete days", () => {
    expect(isDayComplete(plan[0].days[0], full(1))).toBe(true);
    expect(isDayComplete(plan[0].days[0], { "d1-dsa": true })).toBe(false);
  });

  describe("streak", () => {
    it("is 0 with nothing done", () => expect(currentStreak(plan, {}, 3)).toBe(0));
    it("counts consecutive complete days including today", () =>
      expect(currentStreak(plan, full(1, 2, 3), 3)).toBe(3));
    it("does not break when today is still incomplete", () =>
      expect(currentStreak(plan, full(1, 2), 3)).toBe(2));
    it("breaks on a gap", () => expect(currentStreak(plan, full(1, 3), 3)).toBe(1));
    it("is 0 if yesterday and today are incomplete", () =>
      expect(currentStreak(plan, full(1), 3)).toBe(0));
    it("ignores partially complete days", () =>
      expect(currentStreak(plan, { ...full(1), "d2-dsa": true }, 3)).toBe(0));
  });

  describe("behind / missed", () => {
    it("counts only past incomplete days", () => {
      expect(daysBehind(plan, full(1), 4)).toBe(2);
      expect(daysBehind(plan, {}, 1)).toBe(0);
      expect(daysBehind(plan, {}, 0)).toBe(0);
    });
    it("marks missed days", () => {
      expect(isMissed(plan[0].days[1], full(1), 4)).toBe(true);
      expect(isMissed(plan[0].days[0], full(1), 4)).toBe(false);
      expect(isMissed(plan[1].days[0], {}, 4)).toBe(false);
    });
  });
});
