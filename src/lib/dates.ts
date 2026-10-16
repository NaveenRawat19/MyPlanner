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

export function formatDate(iso: string, withYear = false): string {
  return new Date(dayNumber(iso) * MS_PER_DAY).toLocaleDateString(undefined, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}
