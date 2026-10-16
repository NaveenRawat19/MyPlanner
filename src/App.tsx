import { useState } from "react";
import { StartDatePrompt } from "./components/StartDatePrompt";
import { TabBar, type Tab } from "./components/TabBar";
import { TOTAL_DAYS } from "./data/plan";
import { needsBackupReminder } from "./lib/backup";
import { currentDay, rawDay } from "./lib/dates";
import { PlanScreen } from "./screens/PlanScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { useAppState, useToday } from "./state/useAppState";

export default function App() {
  const { state, dispatch, recovered, dismissRecovered, saveFailed } = useAppState();
  const today = useToday();
  const [tab, setTab] = useState<Tab>("today");
  const [viewDay, setViewDay] = useState<number | null>(null);
  const [reminderHidden, setReminderHidden] = useState(false);

  const banners = (
    <div className="banners">
      {recovered && (
        <div className="banner error" role="alert">
          <span>
            Saved data could not be read, so the app started fresh. A copy of the old data was kept in this browser under
            "prep-tracker:corrupt-backup".
          </span>
          <button type="button" className="btn small" onClick={dismissRecovered}>
            Dismiss
          </button>
        </div>
      )}
      {saveFailed && (
        <div className="banner error" role="alert">
          Progress could not be saved (storage unavailable or full). Export a backup from Settings.
        </div>
      )}
    </div>
  );

  if (!state.startDate) {
    return (
      <>
        {banners}
        <StartDatePrompt defaultDate={today} onSave={(date) => dispatch({ type: "setStartDate", date })} />
      </>
    );
  }

  const startDate = state.startDate;
  const raw = rawDay(startDate, today);
  const cur = currentDay(startDate, today, TOTAL_DAYS);
  const shown = viewDay ?? cur;
  const showReminder = tab !== "settings" && !reminderHidden && needsBackupReminder(state, today);

  const open = (day: number) => {
    setViewDay(day);
    setTab("today");
  };

  return (
    <div className="app">
      {banners}
      {showReminder && (
        <div className="banner" role="status">
          <span>Gentle reminder: your last backup is over a week old.</span>
          <button type="button" className="btn small" onClick={() => setTab("settings")}>
            Back up
          </button>
          <button type="button" className="btn small" onClick={() => setReminderHidden(true)}>
            Later
          </button>
        </div>
      )}
      {tab === "today" && (
        <TodayScreen state={state} startDate={startDate} day={shown} raw={raw} dispatch={dispatch} onSelectDay={setViewDay} />
      )}
      {tab === "plan" && <PlanScreen state={state} startDate={startDate} raw={raw} currentDay={cur} onOpenDay={open} />}
      {tab === "progress" && <ProgressScreen state={state} raw={raw} currentDay={cur} />}
      {tab === "settings" && <SettingsScreen state={state} startDate={startDate} today={today} dispatch={dispatch} />}
      <TabBar
        tab={tab}
        onChange={(t) => {
          if (t === "today") setViewDay(null);
          setTab(t);
        }}
      />
    </div>
  );
}
