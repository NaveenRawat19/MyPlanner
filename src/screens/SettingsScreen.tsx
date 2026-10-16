import { useRef, useState } from "react";
import { VALID_IDS } from "../data/plan";
import { buildExport, needsBackupReminder, parseImport } from "../lib/backup";
import { daysBetween, formatDate, isISODate } from "../lib/dates";
import type { Action } from "../state/reducer";
import type { AppState } from "../types";

type Props = { state: AppState; startDate: string; today: string; dispatch: (a: Action) => void };

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SettingsScreen({ state, startDate, today, dispatch }: Props) {
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    download(`prep-tracker-${today}.json`, buildExport(state, new Date().toISOString(), today));
    dispatch({ type: "markBackup", date: today });
    setMessage({ kind: "ok", text: "Backup file created. On iPhone, find it in Files > Downloads." });
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    const result = parseImport(await file.text(), VALID_IDS);
    if (fileRef.current) fileRef.current.value = "";
    if (!result.ok) return setMessage({ kind: "error", text: result.error });
    const n = Object.keys(result.state.checked).length;
    const when = result.exportedAt ? ` from ${result.exportedAt.slice(0, 10)}` : "";
    if (window.confirm(`Replace ALL current progress with this backup${when} (${n} tasks done)? This cannot be undone.`)) {
      dispatch({ type: "replace", state: result.state });
      setMessage({ kind: "ok", text: "Backup imported." });
    }
  };

  const doReset = () => {
    if (window.confirm("Reset ALL progress and notes? Your start date is kept. This cannot be undone.")) {
      dispatch({ type: "reset" });
      setMessage({ kind: "ok", text: "Progress reset." });
    }
  };

  const age = state.lastBackup ? daysBetween(state.lastBackup, today) : null;

  return (
    <main className="screen">
      <h1>Settings</h1>

      <section className="card stack">
        <h2>Start date</h2>
        <label className="field">
          <span>Day 1 is</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => isISODate(e.target.value) && dispatch({ type: "setStartDate", date: e.target.value })}
          />
        </label>
      </section>

      <section className="card stack">
        <h2>Backup</h2>
        <p>
          Last backup:{" "}
          <strong>
            {state.lastBackup ? `${formatDate(state.lastBackup, true)} (${age === 0 ? "today" : `${age} day${age === 1 ? "" : "s"} ago`})` : "never"}
          </strong>
        </p>
        {needsBackupReminder(state, today) && (
          <p className="notice">Your last backup is over a week old. Export one so progress isn't lost if Safari clears its data.</p>
        )}
        <button type="button" className="btn primary" onClick={doExport}>
          Export progress
        </button>
        <label className="btn" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}>
          Import progress
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => void doImport(e.target.files?.[0])}
          />
        </label>
        <p className="status-line" role="status" data-kind={message?.kind}>
          {message?.text}
        </p>
      </section>

      <section className="card stack">
        <h2>Danger zone</h2>
        <button type="button" className="btn danger" onClick={doReset}>
          Reset all progress
        </button>
      </section>
    </main>
  );
}
