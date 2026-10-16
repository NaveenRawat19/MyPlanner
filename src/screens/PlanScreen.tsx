import { useState } from "react";
import { plan } from "../data/plan";
import { addDays, formatDate } from "../lib/dates";
import { doneCount, isMissed, weekProgress } from "../lib/progress";
import { TRACKS, type AppState, type Day } from "../types";

type Props = {
  state: AppState;
  startDate: string;
  raw: number;
  currentDay: number;
  onOpenDay: (day: number) => void;
};

function Dots({ day, state }: { day: Day; state: AppState }) {
  return (
    <span className="dots" role="img" aria-label={`${doneCount(day, state.checked)} of 4 tasks done`}>
      {day.tasks.map((t, i) => (
        <span key={t.id} className={`dot${state.checked[t.id] ? " on" : ""}`} title={TRACKS[i]} />
      ))}
    </span>
  );
}

export function PlanScreen({ state, startDate, raw, currentDay, onOpenDay }: Props) {
  const [open, setOpen] = useState<ReadonlySet<number>>(
    () => new Set([plan.find((w) => w.days.some((d) => d.day === currentDay))?.week ?? 1]),
  );
  const toggle = (w: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });

  return (
    <main className="screen">
      <h1>Plan</h1>
      {plan.map((week) => {
        const isOpen = open.has(week.week);
        const wp = weekProgress(week, state.checked);
        const panelId = `week-${week.week}`;
        return (
          <section key={week.week} className="card week">
            <h2>
              <button type="button" className="week-head" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(week.week)}>
                <span className="chev" aria-hidden="true">
                  {isOpen ? "▾" : "▸"}
                </span>
                <span className="week-head-text">
                  <strong>Week {week.week}</strong>
                  <span className="muted">{week.title}</span>
                </span>
                <span className="muted pct">{wp.pct}%</span>
              </button>
            </h2>
            {isOpen && (
              <ul id={panelId} className="days">
                {week.days.map((d) => {
                  const missed = isMissed(d, state.checked, raw);
                  const isToday = d.day === currentDay && raw >= 1 && raw <= 56;
                  return (
                    <li key={d.day}>
                      <button
                        type="button"
                        className={`dayrow${isToday ? " today" : ""}${missed ? " missed" : ""}`}
                        onClick={() => onOpenDay(d.day)}
                        aria-current={isToday ? "date" : undefined}
                      >
                        <span className="dayrow-label">
                          <strong>{d.label}</strong>
                          <span className="muted">{formatDate(addDays(startDate, d.day - 1))}</span>
                        </span>
                        {isToday && <span className="pill pill-today">Today</span>}
                        {missed && <span className="pill pill-missed">Missed</span>}
                        <Dots day={d} state={state} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
