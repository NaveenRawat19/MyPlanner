import { useRef, useState, type ReactNode } from "react";
import { makePlan, type PlanData } from "../data/plan";
import { MAX_PLAN_BYTES, parsePlan, planStats } from "../lib/planParser";
import {
  FIELD_PRESETS,
  MAX_TOTAL_DAYS,
  TASK_STYLES,
  buildPlanPrompt,
  defaultAnswers,
  totalDays,
  validateAnswers,
  validateGroup,
  type FieldId,
  type Level,
  type PromptAnswers,
  type QuestionGroup,
  type TrackMode,
} from "../lib/planPrompt";
import { reconcileState } from "../state/planStorage";
import type { AppState } from "../types";
import { ProgressBar } from "./ProgressBar";

type Form = PromptAnswers & { customTracks: string };
type Step = "welcome" | "about" | "time" | "tracks" | "resources" | "prompt" | "import";
type Message = { kind: "ok" | "error"; text: string } | null;

const STEPS: Step[] = ["about", "time", "tracks", "resources", "prompt", "import"];
const FORM_KEY = "prep-tracker:prompt-form:v1";
const GROUP_OF: Partial<Record<Step, QuestionGroup>> = { about: "about", time: "time", tracks: "tracks" };

const toAnswers = (f: Form): PromptAnswers => ({ ...f, tracks: [...f.tracks, ...f.customTracks.split(",")] });

function loadForm(): Form {
  const fresh: Form = { ...defaultAnswers("tech"), customTracks: "" };
  try {
    const raw = JSON.parse(window.localStorage.getItem(FORM_KEY) ?? "null") as Partial<Form> | null;
    if (!raw || typeof raw !== "object" || typeof raw.field !== "string" || !(raw.field in FIELD_PRESETS)) return fresh;
    const str = (v: unknown, d: string) => (typeof v === "string" ? v.slice(0, 2000) : d);
    const strs = (v: unknown, d: string[]) =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 30) : d;
    const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
    return {
      field: raw.field,
      fieldName: str(raw.fieldName, ""),
      goal: str(raw.goal, ""),
      durationValue: num(raw.durationValue, fresh.durationValue),
      durationUnit: raw.durationUnit === "days" ? "days" : "weeks",
      hoursPerDay: num(raw.hoursPerDay, fresh.hoursPerDay),
      level: raw.level === "beginner" || raw.level === "advanced" ? raw.level : "intermediate",
      tracks: strs(raw.tracks, fresh.tracks),
      customTracks: str(raw.customTracks, ""),
      trackMode: raw.trackMode === "rotate" ? "rotate" : "all",
      weakAreas: str(raw.weakAreas, ""),
      resources: str(raw.resources, ""),
      freeOnly: raw.freeOnly === true,
      taskStyles: strs(raw.taskStyles, fresh.taskStyles),
      reviewDays: raw.reviewDays !== false,
      extra: str(raw.extra, ""),
    };
  } catch {
    return fresh;
  }
}

function Checks({ options, value, onChange }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="checks">
      {options.map((o) => (
        <label key={o} className="check">
          <input
            type="checkbox"
            checked={value.includes(o)}
            onChange={(e) => onChange(e.target.checked ? [...value, o] : value.filter((x) => x !== o))}
          />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

function Page({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="wizard-page">
      <h1>{title}</h1>
      {intro && <p className="muted">{intro}</p>}
      {children}
    </section>
  );
}

type Props = {
  plan: PlanData | null;
  state: AppState;
  onApplyPlan: (plan: PlanData, source: string, name: string) => boolean;
  onDone: () => void;
  /** Present when the wizard was opened from Settings to replace an existing plan. */
  onCancel?: () => void;
};

export function PlanWizard({ plan, state, onApplyPlan, onDone, onCancel }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [shortcut, setShortcut] = useState(false);
  const [form, setForm] = useState<Form>(loadForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [copyMsg, setCopyMsg] = useState<Message>(null);
  const [importMsg, setImportMsg] = useState<Message>(null);
  const [pasted, setPasted] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const preset = FIELD_PRESETS[form.field];
  const answers = toAnswers(form);
  const prompt = step === "prompt" ? buildPlanPrompt(answers) : "";

  const update = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
  const changeField = (field: FieldId) => {
    const p = FIELD_PRESETS[field];
    update({ field, tracks: [...p.defaultTracks], taskStyles: [...p.styles] });
  };

  const go = (to: Step) => {
    setErrors([]);
    setStep(to);
    window.scrollTo?.(0, 0);
  };

  const next = () => {
    const i = STEPS.indexOf(step);
    const group = GROUP_OF[step];
    const errs = group ? validateGroup(answers, group) : [];
    if (errs.length > 0) return setErrors(errs);
    if (step === "resources") {
      const all = validateAnswers(answers);
      if (all.length > 0) return setErrors(all);
      try {
        window.localStorage.setItem(FORM_KEY, JSON.stringify(form));
      } catch {
        /* the answers are a convenience only */
      }
    }
    go(STEPS[i + 1]);
  };

  const back = () => {
    if (step === "about") return go("welcome");
    if (step === "import" && shortcut) return go("welcome");
    go(STEPS[STEPS.indexOf(step) - 1]);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMsg({ kind: "ok", text: "Prompt copied. Now paste it into ChatGPT or Claude." });
    } catch {
      setCopyMsg({ kind: "error", text: "Could not copy automatically. Select the text in the box and copy it." });
    }
  };

  const importSource = (source: string, name: string) => {
    let next: PlanData;
    try {
      next = makePlan(parsePlan(source));
    } catch (e) {
      return setImportMsg({ kind: "error", text: `That text is not a valid plan. ${(e as Error).message}` });
    }
    const s = planStats(next.weeks);
    if (plan) {
      const r = reconcileState(state, plan, next);
      const lost =
        r.droppedChecked + r.droppedNotes > 0
          ? ` ${r.droppedChecked} ticked task(s) and ${r.droppedNotes} note(s) belong to tasks that changed and will be removed; ${r.keptChecked} ticks are kept.`
          : " All your progress and notes are kept.";
      const ok = window.confirm(
        `Replace your current plan with "${name}" (${s.weeks} weeks, ${s.days} days, ${s.tasks} tasks)?${lost} This cannot be undone.`,
      );
      if (!ok) return;
    }
    if (onApplyPlan(next, source, name)) onDone();
    else setImportMsg({ kind: "error", text: "The plan could not be saved (storage unavailable or full)." });
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PLAN_BYTES) {
      if (fileRef.current) fileRef.current.value = "";
      return setImportMsg({ kind: "error", text: "That file is too large to be a plan (limit 1 MB)." });
    }
    const source = await file.text();
    if (fileRef.current) fileRef.current.value = "";
    importSource(source, file.name);
  };

  const stepNo = STEPS.indexOf(step) + 1;
  const days = totalDays(answers);

  return (
    <main className="screen wizard">
      {step !== "welcome" && (
        <div className="wizard-progress">
          <ProgressBar
            label={`Step ${stepNo} of ${STEPS.length}`}
            progress={{ done: stepNo, total: STEPS.length, pct: Math.round((stepNo / STEPS.length) * 100) }}
            detail=" "
          />
        </div>
      )}

      {step === "welcome" && (
        <Page title="Welcome to Prep Tracker" intro="Build a day-by-day study plan for any exam or skill, then tick it off every day. It works offline and everything stays on your device.">
          <ol className="qsteps">
            <li>Answer a few questions about your goal and time.</li>
            <li>The app writes a prompt for you. Paste it into ChatGPT, Claude or any AI assistant.</li>
            <li>Import the plan it gives you. Your daily checklist and progress are built from it.</li>
          </ol>
          <button type="button" className="btn primary" onClick={() => go("about")}>
            Create my plan
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setShortcut(true);
              go("import");
            }}
          >
            I already have a plan file
          </button>
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </Page>
      )}

      {step === "about" && (
        <Page title="What are you preparing for?" intro="This shapes the topics and sources in your plan.">
          <label className="field">
            <span>Field</span>
            <select value={form.field} onChange={(e) => changeField(e.target.value as FieldId)}>
              {(Object.keys(FIELD_PRESETS) as FieldId[]).map((id) => (
                <option key={id} value={id}>
                  {FIELD_PRESETS[id].label}
                </option>
              ))}
            </select>
          </label>
          {form.field === "other" && (
            <label className="field">
              <span>Name of your exam or skill</span>
              <input
                type="text"
                maxLength={80}
                value={form.fieldName}
                placeholder="e.g. CAT, GATE CS, Spanish"
                onChange={(e) => update({ fieldName: e.target.value })}
              />
            </label>
          )}
          <label className="field">
            <span>What do you want to achieve?</span>
            <textarea rows={3} maxLength={300} value={form.goal} placeholder={preset.goalHint} onChange={(e) => update({ goal: e.target.value })} />
          </label>
          <label className="field">
            <span>Your current level</span>
            <select value={form.level} onChange={(e) => update({ level: e.target.value as Level })}>
              <option value="beginner">Beginner (starting from scratch)</option>
              <option value="intermediate">Intermediate (know the basics)</option>
              <option value="advanced">Advanced (mostly revising)</option>
            </select>
          </label>
          <label className="field">
            <span>Weak areas to prioritise (optional)</span>
            <textarea
              rows={2}
              maxLength={500}
              value={form.weakAreas}
              placeholder="e.g. graphs, system design, economy"
              onChange={(e) => update({ weakAreas: e.target.value })}
            />
          </label>
        </Page>
      )}

      {step === "time" && (
        <Page title="How long, and how much time per day?" intro="Be realistic: a plan you can keep up beats an ambitious one you drop.">
          <div className="qrow">
            <label className="field">
              <span>Plan length</span>
              <input
                type="number"
                min={1}
                max={form.durationUnit === "weeks" ? Math.floor(MAX_TOTAL_DAYS / 7) : MAX_TOTAL_DAYS}
                value={Number.isFinite(form.durationValue) ? form.durationValue : ""}
                onChange={(e) => update({ durationValue: e.target.value === "" ? NaN : Number(e.target.value) })}
              />
            </label>
            <label className="field">
              <span>Unit</span>
              <select value={form.durationUnit} onChange={(e) => update({ durationUnit: e.target.value as "weeks" | "days" })}>
                <option value="weeks">weeks</option>
                <option value="days">days</option>
              </select>
            </label>
            <label className="field">
              <span>Hours per day</span>
              <input
                type="number"
                min={0.5}
                max={16}
                step={0.5}
                value={Number.isFinite(form.hoursPerDay) ? form.hoursPerDay : ""}
                onChange={(e) => update({ hoursPerDay: e.target.value === "" ? NaN : Number(e.target.value) })}
              />
            </label>
          </div>
          {days >= 1 && <p className="muted">That is {days} days of study.</p>}
          <label className="check">
            <input type="checkbox" checked={form.reviewDays} onChange={(e) => update({ reviewDays: e.target.checked })} />
            <span>Make every 7th day a review day</span>
          </label>
        </Page>
      )}

      {step === "tracks" && (
        <Page title="Which subjects should each day cover?" intro="Each subject (track) becomes a checklist item every day and a bar on the Progress tab.">
          {preset.tracks.length > 0 && <Checks options={preset.tracks} value={form.tracks} onChange={(tracks) => update({ tracks })} />}
          <label className="field">
            <span>{preset.tracks.length > 0 ? "Other subjects (comma separated, optional)" : "Your subjects (comma separated)"}</span>
            <input
              type="text"
              value={form.customTracks}
              placeholder={form.field === "other" ? "e.g. Quant, Verbal, Mock Tests" : "e.g. Reading, Revision"}
              onChange={(e) => update({ customTracks: e.target.value })}
            />
          </label>
          <label className="field">
            <span>How should subjects be spread?</span>
            <select value={form.trackMode} onChange={(e) => update({ trackMode: e.target.value as TrackMode })}>
              <option value="all">Every subject every day</option>
              <option value="rotate">Rotate: 2 to 3 subjects a day (better for many subjects)</option>
            </select>
          </label>
        </Page>
      )}

      {step === "resources" && (
        <Page title="Resources and study style" intro="Optional, but it makes the plan much more useful.">
          <label className="field">
            <span>Links, books, courses or notes you want used</span>
            <textarea
              rows={4}
              maxLength={2000}
              value={form.resources}
              placeholder={"One per line, e.g.\nhttps://neetcode.io/roadmap\nLaxmikanth, Indian Polity\nMy coaching notes"}
              onChange={(e) => update({ resources: e.target.value })}
            />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.freeOnly} onChange={(e) => update({ freeOnly: e.target.checked })} />
            <span>Free resources only</span>
          </label>
          <p className="muted">How do you like to study?</p>
          <Checks options={TASK_STYLES} value={form.taskStyles} onChange={(taskStyles) => update({ taskStyles })} />
          <label className="field">
            <span>Anything else the plan should know (optional)</span>
            <textarea
              rows={2}
              maxLength={500}
              value={form.extra}
              placeholder="e.g. weekends are lighter, I work night shifts"
              onChange={(e) => update({ extra: e.target.value })}
            />
          </label>
        </Page>
      )}

      {step === "prompt" && (
        <Page title="Your prompt is ready" intro="Copy it, paste it into an AI assistant, and ask it to answer. Then come back for the last step.">
          <textarea className="prompt-text" readOnly rows={12} value={prompt} aria-label="Generated prompt" />
          <button type="button" className="btn primary" onClick={() => void copy()}>
            Copy prompt
          </button>
          <p className="status-line" role="status" data-kind={copyMsg?.kind}>
            {copyMsg?.text}
          </p>
          <ol className="qsteps">
            <li>
              Paste the prompt into{" "}
              <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">
                ChatGPT
              </a>
              ,{" "}
              <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">
                Claude
              </a>{" "}
              or any other AI assistant.
            </li>
            <li>If the reply stops early, send "continue" and join the parts together.</li>
            <li>Copy the whole reply, or save it as a .txt file. You will import it on the next page.</li>
          </ol>
        </Page>
      )}

      {step === "import" && (
        <Page title="Import your plan" intro="Use the .txt file you saved, or paste the AI's reply. Your checklist and progress are built from it.">
          <label className="btn primary" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}>
            Choose plan file (.txt)
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              className="sr-only"
              tabIndex={-1}
              aria-label="Plan file"
              onChange={(e) => void importFile(e.target.files?.[0])}
            />
          </label>
          <p className="muted">or paste the reply here</p>
          <label className="field">
            <span className="sr-only">Pasted plan text</span>
            <textarea
              rows={8}
              value={pasted}
              placeholder={"### Week 1: ...\n\n**Day 1**\n\n- [ ] **DSA:** ..."}
              aria-label="Pasted plan text"
              onChange={(e) => setPasted(e.target.value)}
            />
          </label>
          <button type="button" className="btn primary" disabled={pasted.trim() === ""} onClick={() => importSource(pasted, "Pasted plan")}>
            Import pasted plan
          </button>
          <p className="status-line" role="alert" data-kind={importMsg?.kind}>
            {importMsg?.text}
          </p>
        </Page>
      )}

      {errors.length > 0 && (
        <ul className="qerrors" role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {step !== "welcome" && (
        <div className="wizard-nav">
          <button type="button" className="btn" onClick={back}>
            Back
          </button>
          {step !== "import" && (
            <button type="button" className="btn primary" onClick={next}>
              {step === "resources" ? "Create my prompt" : step === "prompt" ? "Next: import my plan" : "Next"}
            </button>
          )}
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      )}
    </main>
  );
}
