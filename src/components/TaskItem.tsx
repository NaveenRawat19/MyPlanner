import type { Task } from "../types";

export function TaskItem({ task, checked, onToggle }: { task: Task; checked: boolean; onToggle: () => void }) {
  return (
    <li className={`task${checked ? " done" : ""}`}>
      <label className="task-main">
        <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`${task.track}: ${task.text}`} />
        <span className="task-body">
          <span className={`badge badge-${task.track}`}>{task.track}</span>
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
    </li>
  );
}
