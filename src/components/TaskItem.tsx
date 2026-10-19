import { useState, type CSSProperties, type FormEvent } from "react";
import { MAX_NOTE_LENGTH } from "../state/storage";
import type { Note, Task } from "../types";

type Props = {
  task: Task;
  checked: boolean;
  notes: readonly Note[];
  onToggle: () => void;
  onAddNote: (text: string) => void;
  onDeleteNote: (index: number) => void;
};

const KNOWN_TRACKS = new Set(["DSA", "HLD", "LLD", "AI"]);

/** Stable colour per track name for plans that use their own tracks (e.g. GS1, Optional). */
function trackStyle(track: string): CSSProperties | undefined {
  if (KNOWN_TRACKS.has(track)) return undefined;
  let h = 0;
  for (const ch of track) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return { background: `hsl(${h} 55% 34%)` };
}

function formatStamp(iso: string): string {
  const d = new Date(iso);
  return iso && !Number.isNaN(d.getTime()) ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";
}

export function TaskItem({ task, checked, notes, onToggle, onAddNote, onDeleteNote }: Props) {
  const [draft, setDraft] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim() === "") return;
    onAddNote(draft);
    setDraft("");
  };

  return (
    <li className={`task${checked ? " done" : ""}`}>
      <label className="task-main">
        <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`${task.track}: ${task.text}`} />
        <span className="task-body">
          <span className={`badge badge-${task.track}`} style={trackStyle(task.track)}>
            {task.track}
          </span>
          <span className="task-text">{task.text}</span>
        </span>
      </label>
      {task.links.length > 0 && (
        <div className="task-links">
          {task.links.map((l, i) => (
            <a key={i} className="link-btn" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
      <div className="task-notes">
        {notes.length > 0 && (
          <ul className="note-list" aria-label={`Notes for ${task.track}`}>
            {notes.map((n, i) => (
              <li key={i} className="note">
                <p className="note-text">{n.text}</p>
                <div className="note-meta">
                  <span className="muted">{formatStamp(n.at)}</span>
                  <button type="button" className="btn small" aria-label={`Delete note: ${n.text}`} onClick={() => onDeleteNote(i)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form className="note-form" onSubmit={submit}>
          <input
            type="text"
            maxLength={MAX_NOTE_LENGTH}
            value={draft}
            placeholder="Add a note"
            aria-label={`Note for ${task.track} task`}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn small primary" disabled={draft.trim() === ""}>
            Submit
          </button>
        </form>
      </div>
    </li>
  );
}
