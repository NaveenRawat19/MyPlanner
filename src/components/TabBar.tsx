export type Tab = "today" | "plan" | "calendar" | "progress" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "✓" },
  { id: "calendar", label: "Calendar", icon: "▣" },
  { id: "plan", label: "Plan", icon: "☰" },
  { id: "progress", label: "Progress", icon: "◔" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={t.id === tab ? "active" : ""}
          aria-current={t.id === tab ? "page" : undefined}
          onClick={() => onChange(t.id)}
        >
          <span aria-hidden="true" className="tab-icon">
            {t.icon}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
