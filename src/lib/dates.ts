const MS_PER_DAY = 86_400_000;

export function isISODate(s: unknown): s is string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Whole days since the epoch for a calendar date, immune to DST. */
export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / MS_PER_DAY;
}

/** Local calendar date as YYYY-MM-DD. */
export function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(iso: string, n: number): string {
  return new Date((dayNumber(iso) + n) * MS_PER_DAY).toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return dayNumber(toIso) - dayNumber(fromIso);
}

/** Unclamped plan day: 1 on the start date, 0 or less before it, above total after it. */
export function rawDay(startIso: string, todayIso: string): number {
  return daysBetween(startIso, todayIso) + 1;
}

export function clampDay(day: number, total = 56): number {
  return Math.min(total, Math.max(1, day));
}

export function currentDay(startIso: string, todayIso: string, total = 56): number {
  return clampDay(rawDay(startIso, todayIso), total);
}

/** First day of the month containing `iso`, shifted by `delta` months. */
export function shiftMonth(iso: string, delta: number): string {
  const [y, m] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1 + delta, 1));
  return t.toISOString().slice(0, 10);
}

/** Whole weeks (Monday first) covering the month that contains `iso`, as ISO dates. */
export function monthGrid(iso: string): string[][] {
  const [y, m] = iso.split("-").map(Number);
  const first = Date.UTC(y, m - 1, 1) / MS_PER_DAY;
  const lead = (new Date(first * MS_PER_DAY).getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const weeks = Math.ceil((lead + length) / 7);
  const start = first - lead;
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => new Date((start + w * 7 + d) * MS_PER_DAY).toISOString().slice(0, 10)),
  );
}

export function formatMonth(iso: string): string {
  return new Date(dayNumber(iso) * MS_PER_DAY).toLocaleDateString(undefined, { timeZone: "UTC", month: "long", year: "numeric" });
}

export function formatWeekday(iso: string): string {
  return new Date(dayNumber(iso) * MS_PER_DAY).toLocaleDateString(undefined, { timeZone: "UTC", weekday: "short" });
}

export function formatDate(iso: string, withYear = false): string {
  return new Date(dayNumber(iso) * MS_PER_DAY).toLocaleDateString(undefined, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}
