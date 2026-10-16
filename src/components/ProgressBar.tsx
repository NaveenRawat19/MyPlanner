import type { Progress } from "../types";

export function ProgressBar({ label, progress, detail }: { label: string; progress: Progress; detail?: string }) {
  return (
    <div className="pbar">
      <div className="pbar-head">
        <span>{label}</span>
        <span className="muted">
          {detail ?? `${progress.done}/${progress.total}`} · {progress.pct}%
        </span>
      </div>
      <div
        className="pbar-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.pct}
      >
        <div className="pbar-fill" style={{ width: `${progress.pct}%` }} />
      </div>
    </div>
  );
}
