import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export type Track = "DSA" | "HLD" | "LLD" | "AI";
export type Task = {
  id: string;
  track: Track;
  text: string;
  links: { label: string; url: string }[];
};
export type Day = { day: number; label: string; isReview: boolean; tasks: Task[] };
export type Week = { week: number; title: string; days: Day[] };

const TRACKS: Track[] = ["DSA", "HLD", "LLD", "AI"];
const START_HEADING = /^#{1,6}\s*8-week daily plan/i;
const WEEK_RE = /^###\s+Week\s+(\d+):\s*(.+?)\s*$/;
const DAY_RE = /^\*\*Day\s+(\d+)(?:\s*\(([^)]*)\))?\*\*\s*$/;
const TASK_RE = /^- \[[ xX]\]\s+\*\*(DSA|HLD|LLD|AI):\*\*\s*(.*?)\s*$/;
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseTask(day: number, track: Track, raw: string): Task {
  const links: Task["links"] = [];
  const text = raw.replace(LINK_RE, (_m, label: string, url: string) => {
    links.push({ label, url });
    return label;
  });
  if (/\]\(/.test(text)) {
    throw new Error(`Unparsed Markdown link in day ${day} ${track}: ${raw}`);
  }
  return { id: `d${day}-${track.toLowerCase()}`, track, text, links };
}

export function parsePlan(markdown: string): Week[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => START_HEADING.test(l));
  if (start < 0) throw new Error('Heading "8-week daily plan" not found');

  const weeks: Week[] = [];
  let week: Week | undefined;
  let day: Day | undefined;

  for (const line of lines.slice(start + 1)) {
    let m: RegExpMatchArray | null;
    if ((m = line.match(WEEK_RE))) {
      week = { week: Number(m[1]), title: m[2], days: [] };
      weeks.push(week);
      day = undefined;
    } else if ((m = line.match(DAY_RE))) {
      if (!week) throw new Error(`Day heading before any week: ${line}`);
      const n = Number(m[1]);
      day = {
        day: n,
        label: m[2] ? `Day ${n} (${m[2].trim()})` : `Day ${n}`,
        isReview: /review/i.test(m[2] ?? ""),
        tasks: [],
      };
      week.days.push(day);
    } else if ((m = line.match(TASK_RE))) {
      if (!day) throw new Error(`Task before any day heading: ${line}`);
      day.tasks.push(parseTask(day.day, m[1] as Track, m[2]));
    }
  }

  validatePlan(weeks);
  return weeks;
}

export function validatePlan(weeks: Week[], expectedDays = 56): void {
  const days = weeks.flatMap((w) => w.days);
  if (days.length !== expectedDays) {
    throw new Error(`Expected ${expectedDays} days, found ${days.length}`);
  }
  days.forEach((d, i) => {
    if (d.day !== i + 1) throw new Error(`Day numbering broken: expected ${i + 1}, got ${d.day}`);
    const tracks = d.tasks.map((t) => t.track);
    if (d.tasks.length !== 4 || tracks.join() !== TRACKS.join()) {
      throw new Error(`Day ${d.day} must have exactly DSA, HLD, LLD, AI tasks; got [${tracks.join(", ")}]`);
    }
  });
  const ids = new Set(days.flatMap((d) => d.tasks.map((t) => t.id)));
  if (ids.size !== expectedDays * 4) throw new Error("Task ids are not unique");
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
