import planJson from "./plan.json";
import type { Day, Week } from "../types";

export const plan = planJson as Week[];
export const allDays: Day[] = plan.flatMap((w) => w.days);
export const TOTAL_DAYS = allDays.length;
export const VALID_IDS: ReadonlySet<string> = new Set(allDays.flatMap((d) => d.tasks.map((t) => t.id)));
export const weekOfDay = (day: number): Week | undefined => plan.find((w) => w.days.some((d) => d.day === day));
