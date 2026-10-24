import { useState } from "react";
import type { PlanData } from "../data/plan";
import { formatDate, formatMonth, formatWeekday, monthGrid, rawDay, shiftMonth } from "../lib/dates";
import { doneCount, isDayComplete, isMissed } from "../lib/progress";
import type { AppState } from "../types";

type Props = {
  plan: PlanData;
  state: AppState;
  startDate: string;
  today: string;
  onOpenDay: (day: number) => void;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarScreen({ plan, state, startDate, today, onOpenDay }: Props) {
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(today);
  const raw = rawDay(startDate, today);

  const dayOf = (iso: string) => {
    const n = rawDay(startDate, iso);
    return n >= 1 && n <= plan.total ? plan.days[n - 1] : undefined;
  };

  const sel = dayOf(selected);
  const selDone = sel ? doneCount(sel, state.checked) : 0;
  const monthOf = (iso: string) => iso.slice(0, 7);

  return (
    <main className="screen">
      <header className="page-head">
        <p className="eyebrow">Your schedule</p>
        <h1>Calendar</h1>
      </header>

      <section className="sheet" aria-label="Calendar">
        <div className="cal-head">
          <button type="button" className="btn icon" aria-label="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}>
            ‹
          </button>
          <h2 aria-live="polite">{formatMonth(month)}</h2>
          <button type="button" className="btn icon" aria-label="Next month" onClick={() => setMonth(shiftMonth(month, 1))}>
            ›
          </button>
        </div>

        <div className="cal-grid cal-weekdays" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="cal-body">
          {monthGrid(month).map((week) => (
            <div key={week[0]} className="cal-grid">
              {week.map((iso) => {
                const d = dayOf(iso);
                const status = !d ? "" : isDayComplete(d, state.checked) ? " complete" : isMissed(d, state.checked, raw) ? " missed" : doneCount(d, state.checked) > 0 ? " partial" : "";
                const cls = `cal-cell${monthOf(iso) !== monthOf(month) ? " outside" : ""}${d ? " planned" : ""}${status}${iso === today ? " today" : ""}${iso === selected ? " selected" : ""}`;
                return (
                  <button
                    key={iso}
                    type="button"
                    className={cls}
                    aria-pressed={iso === selected}
                    aria-current={iso === today ? "date" : undefined}
                    aria-label={`${formatDate(iso, true)}${d ? `, ${d.label}` : ""}`}
                    onClick={() => {
                      setSelected(iso);
                      if (monthOf(iso) !== monthOf(month)) setMonth(iso);
                    }}
                  >
                    <span>{Number(iso.slice(8))}</span>
                    {d && <i className="cal-dot" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <ul className="cal-legend muted" aria-label="Legend">
          <li>
            <i className="cal-dot complete" /> Done
          </li>
          <li>
            <i className="cal-dot partial" /> In progress
          </li>
          <li>
            <i className="cal-dot missed" /> Missed
          </li>
          <li>
            <i className="cal-dot" /> Planned
          </li>
        </ul>
      </section>

      <section className="sheet cal-detail" aria-label="Selected date">
        <div className="row between">
          <div>
            <h2>{formatDate(selected, true)}</h2>
            <p className="muted">
              {sel ? `${sel.label} · ${selDone} of ${sel.tasks.length} done` : selected < startDate ? "Before your plan starts" : "No plan for this date"}
            </p>
          </div>
          {sel && (
            <button type="button" className="btn primary small" onClick={() => onOpenDay(sel.day)}>
              Open {formatWeekday(selected)}
            </button>
          )}
        </div>
        {sel && (
          <ul className="cal-tasks">
            {sel.tasks.map((t) => (
              <li key={t.id} className={state.checked[t.id] ? "done" : ""}>
                <span className="cal-check" aria-hidden="true">
                  {state.checked[t.id] ? "✓" : ""}
                </span>
                <span className="cal-task-text">
                  <strong>{t.track}</strong> {t.text}
                </span>
                <span className="sr-only">{state.checked[t.id] ? "(done)" : "(not done)"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
