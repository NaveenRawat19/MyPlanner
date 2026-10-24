import { describe, expect, it } from "vitest";
import { addDays, clampDay, currentDay, isISODate, monthGrid, rawDay, shiftMonth, toISODate } from "./dates";

describe("dates", () => {
  it("builds Monday-first month grids", () => {
    const grid = monthGrid("2026-06-15");
    expect(grid[0][0]).toBe("2026-06-01");
    expect(grid).toHaveLength(5);
    expect(grid[4][6]).toBe("2026-07-05");
    const feb = monthGrid("2026-02-10");
    expect(feb).toHaveLength(5);
    expect(feb[0][0]).toBe("2026-01-26");
  });

  it("shifts months", () => {
    expect(shiftMonth("2026-01-31", -1)).toBe("2025-12-01");
    expect(shiftMonth("2026-12-15", 1)).toBe("2027-01-01");
  });

  it("validates ISO dates", () => {
    expect(isISODate("2026-02-28")).toBe(true);
    expect(isISODate("2026-02-30")).toBe(false);
    expect(isISODate("2026-2-3")).toBe(false);
    expect(isISODate(5)).toBe(false);
  });

  it("formats local dates", () => {
    expect(toISODate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("adds days across month and DST boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-07", 2)).toBe("2026-03-09");
    expect(addDays("2026-03-30", -1)).toBe("2026-03-29");
  });

  it("derives the current day from the start date", () => {
    expect(currentDay("2026-10-16", "2026-10-16")).toBe(1);
    expect(currentDay("2026-10-16", "2026-10-17")).toBe(2);
    expect(currentDay("2026-10-16", "2026-12-10")).toBe(56);
  });

  it("clamps before the start and after the end", () => {
    expect(rawDay("2026-10-16", "2026-10-10")).toBe(-5);
    expect(currentDay("2026-10-16", "2026-10-10")).toBe(1);
    expect(currentDay("2026-10-16", "2027-10-16")).toBe(56);
    expect(clampDay(0)).toBe(1);
    expect(clampDay(99)).toBe(56);
  });
});
