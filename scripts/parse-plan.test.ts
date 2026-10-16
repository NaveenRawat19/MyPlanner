import { describe, expect, it } from "vitest";
import { parsePlan, validatePlan, type Week } from "./parse-plan";

function dayBlock(n: number, heading = `**Day ${n}**`): string {
  return `${heading}

- [ ] **DSA:** [Two Sum](https://example.com/two-sum) (hashing)
- [ ] **HLD:** [A](https://a.dev) and [B](https://b.dev): two links
- [ ] **LLD:** no link here
- [ ] **AI:** [Tok](https://t.dev/x?y=1): tokens
`;
}

const header = `# Title

ignored **Day 99**
- [ ] **DSA:** should be ignored

## 8-week daily plan (2 hours a day)

**Daily time split:** not a day heading

### Week 1: arrays · design
`;

const fixture = `${header}
${dayBlock(1)}
${dayBlock(2, "**Day 2 (review)**")}
${dayBlock(3, "**Day 3 (review and gate)**")}

### Week 2: graphs

${dayBlock(4)}

- **Total load:** trailing notes are ignored
`;

describe("parsePlan", () => {
  const lenient = (md: string) => {
    // fixture has 4 days, so bypass the 56-day check by catching and re-parsing structure
    expect(() => parsePlan(md)).toThrow(/Expected 56 days, found 4/);
  };

  it("fails loudly when the plan is not 56 days", () => lenient(fixture));

  it("fails when the heading is missing", () => {
    expect(() => parsePlan("# nothing")).toThrow(/not found/);
  });

  it("parses weeks, days, tasks, links (via a 56-day fixture)", () => {
    const days = Array.from({ length: 56 }, (_, i) => i + 1);
    const md =
      header +
      days
        .map((n) => {
          const wk = n % 7 === 1 && n > 1 ? `\n### Week ${Math.ceil(n / 7)}: t${n}\n\n` : "";
          return wk + dayBlock(n, n % 7 === 0 ? `**Day ${n} (review)**` : `**Day ${n}**`);
        })
        .join("\n");
    const plan = parsePlan(md);
    expect(plan).toHaveLength(8);
    const all = plan.flatMap((w) => w.days);
    expect(all).toHaveLength(56);
    expect(all.flatMap((d) => d.tasks)).toHaveLength(224);

    expect(plan[0].title).toBe("arrays · design");
    const d1 = all[0];
    expect(d1.label).toBe("Day 1");
    expect(d1.isReview).toBe(false);
    expect(all[6].isReview).toBe(true);
    expect(all[6].label).toBe("Day 7 (review)");

    expect(d1.tasks.map((t) => t.id)).toEqual(["d1-dsa", "d1-hld", "d1-lld", "d1-ai"]);
    expect(d1.tasks[0]).toEqual({
      id: "d1-dsa",
      track: "DSA",
      text: "Two Sum (hashing)",
      links: [{ label: "Two Sum", url: "https://example.com/two-sum" }],
    });
    expect(d1.tasks[1].text).toBe("A and B: two links");
    expect(d1.tasks[1].links).toHaveLength(2);
    expect(d1.tasks[2].links).toEqual([]);
    expect(d1.tasks[3].links[0].url).toBe("https://t.dev/x?y=1");
  });
});

describe("validatePlan", () => {
  it("rejects a day with a missing track", () => {
    const weeks: Week[] = [
      {
        week: 1,
        title: "t",
        days: [{ day: 1, label: "Day 1", isReview: false, tasks: [] }],
      },
    ];
    expect(() => validatePlan(weeks, 1)).toThrow(/Day 1 must have exactly/);
  });
});
