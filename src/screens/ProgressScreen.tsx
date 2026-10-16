import { ProgressBar } from "../components/ProgressBar";
import { plan } from "../data/plan";
import { currentStreak, daysBehind, overallProgress, trackProgress, weekProgress } from "../lib/progress";
import { TRACKS, type AppState } from "../types";

export function ProgressScreen({ state, raw, currentDay }: { state: AppState; raw: number; currentDay: number }) {
  const overall = overallProgress(plan, state.checked);
  const tracks = trackProgress(plan, state.checked);
  const streak = currentStreak(plan, state.checked, currentDay);
  const behind = daysBehind(plan, state.checked, raw);

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
        {plan.map((w) => (
          <ProgressBar key={w.week} label={`Week ${w.week}`} progress={weekProgress(w, state.checked)} />
        ))}
      </section>

      <section className="card">
        <h2>By track</h2>
        {TRACKS.map((t) => (
          <ProgressBar key={t} label={t} progress={tracks[t]} />
        ))}
      </section>
    </main>
  );
}
