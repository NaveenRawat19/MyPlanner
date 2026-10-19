import { describe, expect, it } from "vitest";
import { bundledPlan, makePlan } from "../data/plan";
import { reconcileState } from "../state/planStorage";
import { defaultState } from "../state/storage";
import { parsePlan, planStats, serializePlan } from "./planParser";
import { PLAN_EXAMPLE_TECH, PLAN_EXAMPLE_UPSC, PLAN_PROMPT } from "./planPrompt";

const small = `# My plan

### Week 1: Basics

**Day 1**

- [ ] **Read:** [Chapter 1](https://example.com/1) and notes
- [ ] **Code:** write a parser
- [ ] **Code:** write a printer

**Day 2 (review)**

- [ ] **Read:** redo chapter 1

### Week 2: More

**Day 3**

- [x] **Read:** chapter 2
`;

describe("parsePlan (flexible import)", () => {
  it("parses any number of days, tracks and tasks", () => {
    const weeks = parsePlan(small);
    expect(planStats(weeks)).toEqual({ weeks: 2, days: 3, tasks: 5 });
    const plan = makePlan(weeks);
    expect(plan.tracks).toEqual(["Read", "Code"]);
    expect(weeks[0].days[0].tasks.map((t) => t.id)).toEqual(["d1-read", "d1-code", "d1-code-2"]);
    expect(weeks[0].days[1]).toMatchObject({ label: "Day 2 (review)", isReview: true });
    expect(weeks[0].days[0].tasks[0]).toEqual({
      id: "d1-read",
      track: "Read",
      text: "Chapter 1 and notes",
      links: [{ label: "Chapter 1", url: "https://example.com/1" }],
    });
  });

  it("handles CRLF line endings and a BOM", () => {
    const weeks = parsePlan("\uFEFF" + small.replace(/\n/g, "\r\n"));
    expect(planStats(weeks).tasks).toBe(5);
  });

  it.each([
    ["no weeks", "# nothing", /No weeks found/],
    ["day before week", "**Day 1**\n- [ ] **A:** x", /Line 1: Day heading before any/],
    ["task before day", "### Week 1: t\n- [ ] **A:** x", /Line 2: Task before any/],
    ["day gap", "### Week 1: t\n**Day 1**\n- [ ] **A:** x\n**Day 3**\n- [ ] **A:** y", /Line 4: Day numbers.*expected Day 2/],
    ["week gap", "### Week 2: t", /Week numbers must run/],
    ["empty day", "### Week 1: t\n**Day 1**", /Day 1 has no tasks/],
    ["empty week", "### Week 1: t", /Week 1 has no days/],
    ["javascript link", "### Week 1: t\n**Day 1**\n- [ ] **A:** [x](javascript:alert(1))", /Line 3:.*http/],
    ["empty text", "### Week 1: t\n**Day 1**\n- [ ] **A:**", /no task text/],
  ])("rejects %s", (_n, md, err) => {
    expect(() => parsePlan(md)).toThrow(err);
  });

  it("ignores everything before an 'N-week daily plan' heading", () => {
    const md = `# Notes\n- [ ] **A:** ignored\n\n## 1-week daily plan\n\n${small.split("# My plan")[1]}`;
    expect(planStats(parsePlan(md)).tasks).toBe(5);
  });
});

describe("serializePlan", () => {
  it("round-trips the bundled plan", () => {
    expect(parsePlan(serializePlan(bundledPlan.weeks))).toEqual(bundledPlan.weeks);
  });
  it("round-trips a small plan", () => {
    const weeks = parsePlan(small);
    expect(parsePlan(serializePlan(weeks))).toEqual(weeks);
  });
});

describe("AI prompt", () => {
  it("contains examples that the importer accepts", () => {
    const tech = parsePlan(PLAN_EXAMPLE_TECH);
    expect(planStats(tech)).toEqual({ weeks: 1, days: 2, tasks: 8 });
    expect(makePlan(tech).tracks).toEqual(["DSA", "HLD", "LLD", "AI"]);
    const upsc = parsePlan(PLAN_EXAMPLE_UPSC);
    expect(planStats(upsc)).toEqual({ weeks: 1, days: 2, tasks: 10 });
    expect(makePlan(upsc).tracks).toEqual(["GS1", "GS2", "GS3", "Current Affairs", "Answer Writing"]);
  });

  it("embeds both examples", () => {
    expect(PLAN_PROMPT).toContain(PLAN_EXAMPLE_TECH);
    expect(PLAN_PROMPT).toContain(PLAN_EXAMPLE_UPSC);
  });
});

describe("bundled plan", () => {
  it("is 56 days with 4 tasks each", () => {
    expect(planStats(bundledPlan.weeks)).toEqual({ weeks: 8, days: 56, tasks: 224 });
    expect(bundledPlan.tracks).toEqual(["DSA", "HLD", "LLD", "AI"]);
  });
});

describe("reconcileState", () => {
  const oldPlan = makePlan(parsePlan(small));
  const edited = makePlan(parsePlan(small.replace("write a parser", "write a lexer").replace("chapter 2", "chapter 3")));
  const state = {
    ...defaultState(),
    checked: { "d1-read": true as const, "d1-code": true as const, "d3-read": true as const },
    notes: {
      "d1-read": [{ text: "a", at: "" }],
      "d1-code": [{ text: "b", at: "" }, { text: "c", at: "" }],
    },
  };

  it("keeps progress and notes only for unchanged tasks", () => {
    const r = reconcileState(state, oldPlan, edited);
    expect(r.state.checked).toEqual({ "d1-read": true });
    expect(r.state.notes).toEqual({ "d1-read": [{ text: "a", at: "" }] });
    expect(r).toMatchObject({ keptChecked: 1, droppedChecked: 2, droppedNotes: 2 });
  });

  it("drops everything that no longer exists", () => {
    const r = reconcileState(state, oldPlan, bundledPlan);
    expect(r.state.checked).toEqual({});
    expect(r.state.notes).toEqual({});
  });
});
