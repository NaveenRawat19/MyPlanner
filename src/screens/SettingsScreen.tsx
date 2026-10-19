import { useRef, useState } from "react";
import { bundledPlan, makePlan, type PlanData } from "../data/plan";
import { buildExport, needsBackupReminder, parseImport } from "../lib/backup";
import { daysBetween, formatDate, isISODate } from "../lib/dates";
import { MAX_PLAN_BYTES, parsePlan, planStats, serializePlan } from "../lib/planParser";
import { PLAN_PROMPT } from "../lib/planPrompt";
import type { Action } from "../state/reducer";
import { reconcileState, type CustomPlanInfo } from "../state/planStorage";
import type { AppState } from "../types";

type Props = {
  state: AppState;
  plan: PlanData;
  customPlan: CustomPlanInfo | null;
  startDate: string;
  today: string;
  dispatch: (a: Action) => void;
  onApplyPlan: (plan: PlanData, source: string, name: string) => boolean;
  onRestoreBundledPlan: (plan: PlanData) => boolean;
};

type Message = { kind: "ok" | "error"; text: string } | null;

function download(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PLAN_EXAMPLE = `### Week 1: Arrays and hashing

**Day 1**

- [ ] **DSA:** [Two Sum](https://leetcode.com/problems/two-sum/) (hashing)
- [ ] **HLD:** Read about load balancing

**Day 2 (review)**

- [ ] **DSA:** Redo yesterday's problem
- [ ] **HLD:** Redo one design`;

export function SettingsScreen({ state, plan, customPlan, startDate, today, dispatch, onApplyPlan, onRestoreBundledPlan }: Props) {
  const [message, setMessage] = useState<Message>(null);
  const [planMessage, setPlanMessage] = useState<Message>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const planFileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    download(`prep-tracker-${today}.json`, buildExport(state, new Date().toISOString(), today));
    dispatch({ type: "markBackup", date: today });
    setMessage({ kind: "ok", text: "Backup file created. On iPhone, find it in Files > Downloads." });
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    const result = parseImport(await file.text(), plan.validIds);
    if (fileRef.current) fileRef.current.value = "";
    if (!result.ok) return setMessage({ kind: "error", text: result.error });
    const n = Object.keys(result.state.checked).length;
    const when = result.exportedAt ? ` from ${result.exportedAt.slice(0, 10)}` : "";
    if (window.confirm(`Replace ALL current progress with this backup${when} (${n} tasks done)? This cannot be undone.`)) {
      dispatch({ type: "replace", state: result.state });
      setMessage({ kind: "ok", text: "Backup imported." });
    }
  };

  const doImportPlan = async (file: File | undefined) => {
    if (!file) return;
    const reset = () => {
      if (planFileRef.current) planFileRef.current.value = "";
    };
    if (file.size > MAX_PLAN_BYTES) {
      reset();
      return setPlanMessage({ kind: "error", text: "That file is too large to be a plan (limit 1 MB)." });
    }
    const source = await file.text();
    reset();
    let next: PlanData;
    try {
      next = makePlan(parsePlan(source));
    } catch (e) {
      return setPlanMessage({ kind: "error", text: `Plan rejected. ${(e as Error).message}` });
    }
    const s = planStats(next.weeks);
    const r = reconcileState(state, plan, next);
    const dropped =
      r.droppedChecked + r.droppedNotes > 0
        ? ` ${r.droppedChecked} ticked task(s) and ${r.droppedNotes} note(s) belong to tasks that changed and will be removed; ${r.keptChecked} ticks are kept.`
        : " All your current progress and notes are kept.";
    const ok = window.confirm(
      `Replace the current plan with "${file.name}" (${s.weeks} weeks, ${s.days} days, ${s.tasks} tasks)?${dropped} This cannot be undone.`,
    );
    if (!ok) return;
    if (onApplyPlan(next, source, file.name)) {
      setPlanMessage({ kind: "ok", text: `Plan imported: ${s.days} days, ${s.tasks} tasks. Day-wise checklist and progress are updated.` });
    } else {
      setPlanMessage({ kind: "error", text: "The plan could not be saved (storage unavailable or full)." });
    }
  };

  const doExportPlan = () => {
    download("study-plan.txt", serializePlan(plan.weeks), "text/plain");
    setPlanMessage({ kind: "ok", text: "Plan file created. Edit it and import it back to change the plan." });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(PLAN_PROMPT);
      setPlanMessage({ kind: "ok", text: "Prompt copied." });
    } catch {
      setPlanMessage({ kind: "error", text: "Could not copy automatically. Select the prompt text and copy it manually." });
    }
  };

  const doRestorePlan = () => {
    if (window.confirm("Switch back to the built-in plan? Progress and notes for tasks that differ are removed. This cannot be undone.")) {
      setPlanMessage(
        onRestoreBundledPlan(bundledPlan)
          ? { kind: "ok", text: "Built-in plan restored." }
          : { kind: "error", text: "The built-in plan could not be restored (storage unavailable)." },
      );
    }
  };

  const doReset = () => {
    if (window.confirm("Reset ALL progress and notes? Your start date and plan are kept. This cannot be undone.")) {
      dispatch({ type: "reset" });
      setMessage({ kind: "ok", text: "Progress reset." });
    }
  };

  const age = state.lastBackup ? daysBetween(state.lastBackup, today) : null;
  const stats = planStats(plan.weeks);

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
        <h2>Plan</h2>
        <p>
          Current plan: <strong>{customPlan ? customPlan.name : "Built-in plan"}</strong>
          <br />
          <span className="muted">
            {stats.weeks} weeks, {stats.days} days, {stats.tasks} tasks
          </span>
        </p>
        <label className="btn primary" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), planFileRef.current?.click())}>
          Import plan (.txt)
          <input
            ref={planFileRef}
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            className="sr-only"
            tabIndex={-1}
            aria-label="Import plan file"
            onChange={(e) => void doImportPlan(e.target.files?.[0])}
          />
        </label>
        <button type="button" className="btn" onClick={doExportPlan}>
          Download current plan as .txt
        </button>
        {customPlan && (
          <button type="button" className="btn" onClick={doRestorePlan}>
            Use built-in plan
          </button>
        )}
        <p className="status-line" role="status" data-kind={planMessage?.kind}>
          {planMessage?.text}
        </p>
        <details>
          <summary>Plan file format</summary>
          <p className="muted">
            Plain text, one Week heading, then Day headings, then one checkbox line per task. Day numbers run 1, 2, 3, ... across all
            weeks. A track name (DSA, HLD, ...) goes in bold before a colon. Links must be http or https. "review" in the day's
            brackets marks a review day.
          </p>
          <pre className="format-example">{PLAN_EXAMPLE}</pre>
        </details>
        <details>
          <summary>Generate a plan with AI (tech, UPSC or any field)</summary>
          <p className="muted">
            Copy this prompt into ChatGPT, Claude or Gemini, fill in the bracketed parts (field, duration, daily time, tracks), save the
            reply as a .txt file and import it above. It includes suggested tracks and sources for tech interviews and UPSC.
          </p>
          <textarea className="prompt-text" readOnly rows={10} value={PLAN_PROMPT} aria-label="AI prompt for generating a plan file" />
          <button type="button" className="btn" onClick={() => void copyPrompt()}>
            Copy prompt
          </button>
        </details>
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
        <p className="muted">Progress backups cover ticks and notes for the current plan, not the plan itself. Download the plan separately.</p>
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
