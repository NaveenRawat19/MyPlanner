import { useState } from "react";
import { PlanWizard } from "./components/PlanWizard";
import { StartDatePrompt } from "./components/StartDatePrompt";
import { TabBar, type Tab } from "./components/TabBar";
import { needsBackupReminder } from "./lib/backup";
import { currentDay, rawDay } from "./lib/dates";
import { PlanScreen } from "./screens/PlanScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { useAppState, useToday } from "./state/useAppState";

export default function App() {
  const { state, dispatch, plan, planInfo, applyPlan, recovered, dismissRecovered, saveFailed } = useAppState();
  const today = useToday();
  const [tab, setTab] = useState<Tab>("today");
  const [viewDay, setViewDay] = useState<number | null>(null);
  const [reminderHidden, setReminderHidden] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

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

  // The app ships without a plan: first run (and "create a new plan") goes through the questionnaire.
  if (!plan || wizardOpen) {
    return (
      <>
        {banners}
        <PlanWizard
          plan={plan}
          state={state}
          onApplyPlan={applyPlan}
          onDone={() => {
            setWizardOpen(false);
            setViewDay(null);
            setTab("today");
          }}
          onCancel={plan ? () => setWizardOpen(false) : undefined}
        />
      </>
    );
  }

  if (!state.startDate) {
    return (
      <>
        {banners}
        <StartDatePrompt defaultDate={today} days={plan.total} onSave={(date) => dispatch({ type: "setStartDate", date })} />
      </>
    );
  }

  const startDate = state.startDate;
  const raw = rawDay(startDate, today);
  const cur = currentDay(startDate, today, plan.total);
  const shown = Math.min(viewDay ?? cur, plan.total);
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
        <TodayScreen plan={plan} state={state} startDate={startDate} day={shown} raw={raw} dispatch={dispatch} onSelectDay={setViewDay} />
      )}
      {tab === "plan" && <PlanScreen plan={plan} state={state} startDate={startDate} raw={raw} currentDay={cur} onOpenDay={open} />}
      {tab === "progress" && <ProgressScreen plan={plan} state={state} raw={raw} currentDay={cur} />}
      {tab === "settings" && (
        <SettingsScreen
          state={state}
          plan={plan}
          planInfo={planInfo}
          startDate={startDate}
          today={today}
          dispatch={dispatch}
          onApplyPlan={applyPlan}
          onCreatePlan={() => setWizardOpen(true)}
        />
      )}
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
