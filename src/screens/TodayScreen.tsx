import { TaskItem } from "../components/TaskItem";
import { weekOfDay, type PlanData } from "../data/plan";
import { addDays, formatDate } from "../lib/dates";
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

  return (
    <main className="screen">
      {raw < 1 && <p className="notice">Your plan starts on {formatDate(startDate, true)}. Showing Day 1.</p>}
      {raw > plan.total && (
        <p className="notice">
          The {plan.total} days are over. Showing Day {plan.total}.
        </p>
      )}

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
          <p className="muted">
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

      <div className="row between">
        <p className="muted week-title">
          Week {week?.week}: {week?.title}
        </p>
      </div>

      <label className="field">
        <span>Jump to day</span>
        <select value={day} onChange={(e) => onSelectDay(Number(e.target.value))}>
          {plan.days.map((x) => (
            <option key={x.day} value={x.day}>
              {x.label}
            </option>
          ))}
        </select>
      </label>

      <p className="muted" aria-live="polite">
        {done} of {d.tasks.length} done
      </p>
      <ul className="tasks">
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
