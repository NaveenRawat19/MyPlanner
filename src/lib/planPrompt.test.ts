import { describe, expect, it } from "vitest";
import { makePlan } from "../data/plan";
import { parsePlan, planStats } from "./planParser";
import {
  PLAN_EXAMPLE_TECH,
  PLAN_EXAMPLE_UPSC,
  buildPlanPrompt,
  buildSkeletonExample,
  defaultAnswers,
  sanitizeTracks,
  totalDays,
  validateAnswers,
  type PromptAnswers,
} from "./planPrompt";

const valid = (over: Partial<PromptAnswers> = {}): PromptAnswers => ({
  ...defaultAnswers("tech"),
  goal: "Crack senior backend interviews",
  ...over,
});

describe("prompt examples", () => {
  it("are accepted by the importer", () => {
    const tech = parsePlan(PLAN_EXAMPLE_TECH);
    expect(planStats(tech)).toEqual({ weeks: 1, days: 2, tasks: 8 });
    expect(makePlan(tech).tracks).toEqual(["DSA", "HLD", "LLD", "AI"]);
    const upsc = parsePlan(PLAN_EXAMPLE_UPSC);
    expect(planStats(upsc)).toEqual({ weeks: 1, days: 2, tasks: 10 });
    expect(makePlan(upsc).tracks).toEqual(["GS1", "GS2", "GS3", "Current Affairs", "Answer Writing"]);
  });

  it("skeleton uses the user's tracks and parses", () => {
    const plan = makePlan(parsePlan(buildSkeletonExample(["Quant", "Verbal"])));
    expect(plan.tracks).toEqual(["Quant", "Verbal"]);
    expect(plan.total).toBe(2);
  });
});

describe("sanitizeTracks", () => {
  it("removes format characters, trims, dedupes and caps length", () => {
    expect(sanitizeTracks(["DSA", " dsa ", "A*B:C", "", "x".repeat(40)])).toEqual(["DSA", "A B C", "x".repeat(24)]);
  });
});

describe("validateAnswers", () => {
  it("accepts a complete form", () => expect(validateAnswers(valid())).toEqual([]));
  it("asks for the missing pieces", () => {
    expect(validateAnswers(valid({ goal: " " }))).toHaveLength(1);
    expect(validateAnswers(valid({ tracks: [] }))).toHaveLength(1);
    expect(validateAnswers(valid({ field: "other", fieldName: "" }))).toHaveLength(1);
    expect(validateAnswers(valid({ durationValue: NaN }))).toHaveLength(1);
    expect(validateAnswers(valid({ durationValue: 60 }))).toHaveLength(1); // 420 days
    expect(validateAnswers(valid({ hoursPerDay: 0 }))).toHaveLength(1);
  });
  it("computes total days", () => {
    expect(totalDays(valid({ durationValue: 8, durationUnit: "weeks" }))).toBe(56);
    expect(totalDays(valid({ durationValue: 30, durationUnit: "days" }))).toBe(30);
  });
});

describe("buildPlanPrompt", () => {
  it("includes the user's answers and the strict format rules", () => {
    const p = buildPlanPrompt(
      valid({
        weakAreas: "graphs",
        resources: "https://neetcode.io/roadmap\nDDIA",
        freeOnly: true,
        extra: "weekends are lighter",
        durationValue: 4,
        hoursPerDay: 1.5,
      }),
    );
    expect(p).toContain("Goal: Crack senior backend interviews");
    expect(p).toContain("28 days (4 weeks)");
    expect(p).toContain("1.5 hours per day (90 minutes)");
    expect(p).toContain("Tracks (subjects): DSA, HLD, LLD, AI");
    expect(p).toContain("Weak areas to give extra time: graphs");
    expect(p).toContain("https://neetcode.io/roadmap\nDDIA");
    expect(p).toContain("Use free resources only.");
    expect(p).toContain("weekends are lighter");
    expect(p).toContain("### Week N: short title");
    expect(p).toContain("- [ ] **TRACK:** task text");
    expect(p).toContain("Finish at Day 28");
    expect(p).toContain(PLAN_EXAMPLE_TECH);
  });

  it("adapts to UPSC, custom tracks and rotation", () => {
    const upsc = buildPlanPrompt({ ...defaultAnswers("upsc"), goal: "Clear Prelims", reviewDays: false, trackMode: "rotate" });
    expect(upsc).toContain("Field: UPSC Civil Services");
    expect(upsc).toContain("GS1, GS2, GS3, Current Affairs, Answer Writing");
    expect(upsc).toContain(PLAN_EXAMPLE_UPSC);
    expect(upsc).toContain("rotating");
    expect(upsc).toContain("No fixed review days");

    const other = buildPlanPrompt({
      ...defaultAnswers("other"),
      fieldName: "CAT",
      goal: "99 percentile",
      tracks: ["Quant", "Verbal"],
      durationValue: 10,
      durationUnit: "days",
    });
    expect(other).toContain("Field: CAT");
    expect(other).toContain("10 days (2 weeks, the last week has 3 days)");
    expect(other).toContain("**Quant:**");
  });
});
