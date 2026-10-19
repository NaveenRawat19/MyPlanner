import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parsePlan as parseAnyPlan } from "../src/lib/planParser";
import type { Week } from "../src/types";

export { parseTask } from "../src/lib/planParser";
export type { Day, Task, Track, Week } from "../src/types";

const TRACKS = ["DSA", "HLD", "LLD", "AI"];

/** Build-time parse of the bundled plan: the app's flexible parser plus the strict 56 x 4 shape. */
export function parsePlan(markdown: string): Week[] {
  const weeks = parseAnyPlan(markdown);
  validatePlan(weeks);
  return weeks;
}

export function validatePlan(weeks: Week[], expectedDays = 56): void {
  const days = weeks.flatMap((w) => w.days);
  if (days.length !== expectedDays) {
    throw new Error(`Expected ${expectedDays} days, found ${days.length}`);
  }
  days.forEach((d) => {
    const tracks = d.tasks.map((t) => t.track);
    if (d.tasks.length !== 4 || tracks.join() !== TRACKS.join()) {
      throw new Error(`Day ${d.day} must have exactly DSA, HLD, LLD, AI tasks; got [${tracks.join(", ")}]`);
    }
  });
}
function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  try {
    const plan = parsePlan(readFileSync(resolve(root, "data/plan-source.md"), "utf8"));
    const out = resolve(root, "src/data/plan.json");
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(plan, null, 2) + "\n");
    const days = plan.flatMap((w) => w.days);
    console.log(`plan.json: ${plan.length} weeks, ${days.length} days, ${days.length * 4} tasks`);
  } catch (e) {
    console.error(`parse-plan FAILED: ${(e as Error).message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
