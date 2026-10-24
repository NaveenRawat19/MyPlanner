import { TaskItem } from "../components/TaskItem";
import { weekOfDay, type PlanData } from "../data/plan";
import { addDays, formatDate, formatWeekday } from "../lib/dates";
import { doneCount } from "../lib/progress";
import type { Action } from "../state/reducer";
import type { AppState } from "../types";

type Props = {
  plan: PlanData;
  state: AppState;
  startDate: string;
  day: number;
  raw: number;
  dispatch: (a: Action) => void;
  onSelectDay: (day: number) => void;
};

export function TodayScreen({ plan, state, startDate, day, raw, dispatch, onSelectDay }: Props) {
  const d = plan.days[day - 1];
  const week = weekOfDay(plan, day);
  const done = doneCount(d, state.checked);
  const date = addDays(startDate, day - 1);

  let status = "";
  if (day === raw) status = "Today";
  else if (day < raw) status = done === d.tasks.length ? "Completed" : "Missed";
  else status = `In ${day - raw} day${day - raw === 1 ? "" : "s"}`;

  const first = Math.max(1, Math.min(day - 2, plan.total - 4));
  const strip = plan.days.slice(first - 1, first + 4);

  return (
    <main className="screen today">
      {raw < 1 && <p className="notice">Your plan starts on {formatDate(startDate, true)}. Showing Day 1.</p>}
      {raw > plan.total && (
        <p className="notice">
          The {plan.total} days are over. Showing Day {plan.total}.
        </p>
      )}

      <header className="top">
        <p className="eyebrow week-title">
          Week {week?.week}: {week?.title}
        </p>
        <p className="greeting">What's on today?</p>
        <div className="strip" role="group" aria-label="Pick a day">
          {strip.map((x) => {
            const iso = addDays(startDate, x.day - 1);
            return (
              <button
                key={x.day}
                type="button"
                className={`strip-day${x.day === day ? " selected" : ""}${x.day === raw ? " now" : ""}`}
                aria-label={`Go to ${x.label}`}
                aria-pressed={x.day === day}
                onClick={() => onSelectDay(x.day)}
              >
                <span>{formatWeekday(iso)}</span>
                <strong>{String(Number(iso.slice(8))).padStart(2, "0")}</strong>
              </button>
            );
          })}
        </div>
      </header>

      <section className="band">
        <div className="daynav">
          <button
            type="button"
            className="btn icon"
            aria-label="Previous day"
            disabled={day <= 1}
            onClick={() => onSelectDay(day - 1)}
          >
            ‹
          </button>
          <div className="daynav-title">
            <h1>{d.label}</h1>
            <p>
              {formatDate(date)} · <span className={`status status-${status.split(" ")[0]}`}>{status}</span>
            </p>
          </div>
          <button
            type="button"
            className="btn icon"
            aria-label="Next day"
            disabled={day >= plan.total}
            onClick={() => onSelectDay(day + 1)}
          >
            ›
          </button>
        </div>
        <div className="band-foot">
          <p aria-live="polite">
            {done} of {d.tasks.length} done
          </p>
          <label className="jump">
            <span className="sr-only">Jump to day</span>
            <select value={day} onChange={(e) => onSelectDay(Number(e.target.value))}>
              {plan.days.map((x) => (
                <option key={x.day} value={x.day}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mini-bar" aria-hidden="true">
          <span style={{ width: `${d.tasks.length ? (done / d.tasks.length) * 100 : 0}%` }} />
        </div>
      </section>

      <ul className="tasks sheet">
        {d.tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            checked={!!state.checked[t.id]}
            notes={state.notes[t.id] ?? []}
            onToggle={() => dispatch({ type: "toggle", id: t.id })}
            onAddNote={(text) => dispatch({ type: "addNote", taskId: t.id, text, at: new Date().toISOString() })}
            onDeleteNote={(index) => dispatch({ type: "deleteNote", taskId: t.id, index })}
          />
        ))}
      </ul>
    </main>
  );
}
