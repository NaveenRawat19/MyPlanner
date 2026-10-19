import type { Day, Task, Week } from "../types";

/**
 * Plan text format (Markdown subset). See README "Plan file format".
 *
 *   ### Week 1: Title
 *   **Day 1**                      or  **Day 7 (review)**
 *   - [ ] **TRACK:** Task text with [a link](https://example.com)
 *
 * Everything before an optional "N-week daily plan" heading is ignored.
 */

const START_HEADING = /^#{1,6}\s*\d+-week daily plan/i;
const WEEK_RE = /^#{2,6}\s+Week\s+(\d+)\s*:\s*(.+?)\s*$/i;
const DAY_RE = /^\*\*Day\s+(\d+)(?:\s*\(([^)]*)\))?\*\*\s*$/i;
const TASK_RE = /^[-*]\s+\[[ xX]\]\s+\*\*([^*:\n]{1,24}?):\*\*\s*(.*?)\s*$/;
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export const MAX_PLAN_BYTES = 1_000_000;

export class PlanParseError extends Error {}

function fail(line: number | null, msg: string): never {
  throw new PlanParseError(line === null ? msg : `Line ${line}: ${msg}`);
}

const trackSlug = (track: string) => track.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "task";

export function isSafeUrl(url: string): boolean {
  try {
    const p = new URL(url).protocol;
    return p === "https:" || p === "http:";
  } catch {
    return false;
  }
}

export function parseTask(day: number, track: string, raw: string, lineNo: number | null = null): Omit<Task, "id"> {
  const links: Task["links"] = [];
  const text = raw.replace(LINK_RE, (_m, label: string, url: string) => {
    if (!isSafeUrl(url)) fail(lineNo, `Day ${day} ${track}: link "${url}" must start with http:// or https://`);
    links.push({ label, url });
    return label;
  });
  if (/\]\(/.test(text)) fail(lineNo, `Unparsed Markdown link in day ${day} ${track}: ${raw}`);
  if (text.trim() === "") fail(lineNo, `Day ${day} ${track} has no task text`);
  return { track, text, links };
}

export function parsePlan(markdown: string): Week[] {
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);
  const heading = lines.findIndex((l) => START_HEADING.test(l));
  const first = heading + 1; // 0 when there is no heading, so the whole file is parsed

  const weeks: Week[] = [];
  let week: Week | undefined;
  let day: Day | undefined;

  for (let i = first; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    let m: RegExpMatchArray | null;
    if ((m = line.match(WEEK_RE))) {
      const n = Number(m[1]);
      if (n !== weeks.length + 1) fail(lineNo, `Week numbers must run 1, 2, 3, ...; expected Week ${weeks.length + 1}, got Week ${n}`);
      week = { week: n, title: m[2], days: [] };
      weeks.push(week);
      day = undefined;
    } else if ((m = line.match(DAY_RE))) {
      if (!week) fail(lineNo, `Day heading before any "### Week N: title" heading`);
      const n = Number(m[1]);
      const expected = weeks.reduce((sum, w) => sum + w.days.length, 0) + 1;
      if (n !== expected) fail(lineNo, `Day numbers must run 1, 2, 3, ... across weeks; expected Day ${expected}, got Day ${n}`);
      const paren = m[2]?.trim();
      day = { day: n, label: paren ? `Day ${n} (${paren})` : `Day ${n}`, isReview: /review/i.test(paren ?? ""), tasks: [] };
      week.days.push(day);
    } else if ((m = line.match(TASK_RE))) {
      if (!day) fail(lineNo, `Task before any "**Day N**" heading`);
      const track = m[1].trim();
      const parsed = parseTask(day.day, track, m[2], lineNo);
      const base = `d${day.day}-${trackSlug(track)}`;
      const same = day.tasks.filter((t) => t.id === base || t.id.startsWith(`${base}-`)).length;
      day.tasks.push({ id: same === 0 ? base : `${base}-${same + 1}`, ...parsed });
    }
  }

  validatePlan(weeks);
  return weeks;
}

export function validatePlan(weeks: Week[]): void {
  if (weeks.length === 0) fail(null, 'No weeks found. Add a heading like "### Week 1: Title".');
  const days = weeks.flatMap((w) => w.days);
  for (const w of weeks) if (w.days.length === 0) fail(null, `Week ${w.week} has no days`);
  for (const d of days) if (d.tasks.length === 0) fail(null, `Day ${d.day} has no tasks. Add lines like "- [ ] **DSA:** text".`);
  const ids = new Set(days.flatMap((d) => d.tasks.map((t) => t.id)));
  if (ids.size !== days.reduce((n, d) => n + d.tasks.length, 0)) fail(null, "Task ids are not unique");
}

/** Inverse of parsePlan: parsePlan(serializePlan(weeks)) yields the same weeks. */
export function serializePlan(weeks: Week[], title = "Study plan"): string {
  const out: string[] = [`# ${title}`, "", `## ${weeks.length}-week daily plan`, ""];
  for (const w of weeks) {
    out.push(`### Week ${w.week}: ${w.title}`, "");
    for (const d of w.days) {
      out.push(d.label.startsWith(`Day ${d.day}`) ? `**${d.label}**` : `**Day ${d.day}**`, "");
      for (const t of d.tasks) out.push(`- [ ] **${t.track}:** ${withLinks(t)}`);
      out.push("");
    }
  }
  return out.join("\n");
}

function withLinks(t: Task): string {
  let text = t.text;
  let from = 0;
  const trailing: string[] = [];
  for (const l of t.links) {
    const at = text.indexOf(l.label, from);
    if (at < 0) {
      trailing.push(`[${l.label}](${l.url})`);
      continue;
    }
    const md = `[${l.label}](${l.url})`;
    text = text.slice(0, at) + md + text.slice(at + l.label.length);
    from = at + md.length;
  }
  return [text, ...trailing].join(" ");
}

export const planStats = (weeks: Week[]) => {
  const days = weeks.flatMap((w) => w.days);
  return { weeks: weeks.length, days: days.length, tasks: days.reduce((n, d) => n + d.tasks.length, 0) };
};
