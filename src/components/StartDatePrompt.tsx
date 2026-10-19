import { useState, type FormEvent } from "react";
import { isISODate } from "../lib/dates";

export function StartDatePrompt({ defaultDate, days, onSave }: { defaultDate: string; days: number; onSave: (iso: string) => void }) {
  const [value, setValue] = useState(defaultDate);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isISODate(value)) onSave(value);
  };
  return (
    <main className="screen welcome">
      <h1>Your {days}-day plan is ready</h1>
      <p>When does Day 1 start? Today's plan day is worked out from this date. You can change it later in Settings.</p>
      <form onSubmit={submit} className="stack">
        <label className="field">
          <span>Start date</span>
          <input type="date" required value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <button type="submit" className="btn primary" disabled={!isISODate(value)}>
          Start tracking
        </button>
      </form>
    </main>
  );
}
