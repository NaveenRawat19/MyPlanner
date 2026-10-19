import { ProgressBar } from "../components/ProgressBar";
import type { PlanData } from "../data/plan";
import { currentStreak, daysBehind, overallProgress, trackProgress, weekProgress } from "../lib/progress";
import type { AppState } from "../types";

type Props = { plan: PlanData; state: AppState; raw: number; currentDay: number };

export function ProgressScreen({ plan, state, raw, currentDay }: Props) {
  const overall = overallProgress(plan.weeks, state.checked);
  const tracks = trackProgress(plan.weeks, state.checked);
  const streak = currentStreak(plan.weeks, state.checked, currentDay);
  const behind = daysBehind(plan.weeks, state.checked, raw);

  return (
    <main className="screen">
      <h1>Progress</h1>
      <section className="card hero">
        <p className="big" aria-label={`Overall progress ${overall.pct} percent`}>
          {overall.pct}%
        </p>
        <ProgressBar label="Overall" progress={overall} />
      </section>

      <section className="stats">
        <div className="card stat">
          <p className="big">{streak}</p>
          <p className="muted">day streak</p>
        </div>
        <div className="card stat">
          <p className={`big${behind > 0 ? " warn" : ""}`}>{behind}</p>
          <p className="muted">days behind</p>
        </div>
      </section>

      <section className="card">
        <h2>By week</h2>
        {plan.weeks.map((w) => (
          <ProgressBar key={w.week} label={`Week ${w.week}`} progress={weekProgress(w, state.checked)} />
        ))}
      </section>

      <section className="card">
        <h2>By track</h2>
        {plan.tracks.map((t) => (
          <ProgressBar key={t} label={t} progress={tracks[t]} />
        ))}
      </section>
    </main>
  );
}
