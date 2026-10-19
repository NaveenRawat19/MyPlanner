# Prep Tracker

An installable, offline-first PWA for building a day-by-day study plan (tech interviews, UPSC, or any exam or skill) and tracking it every day.
The app ships **without any plan**: on first launch a questionnaire writes a prompt for ChatGPT or Claude, and you import the plan it gives you.
No backend, no accounts, no analytics: everything lives in your browser's `localStorage`.

Stack: Vite, React, TypeScript (strict), plain CSS, `vite-plugin-pwa`, Vitest.

## Run locally (Windows, macOS or Linux)

Requires Node.js 20 or newer.

```powershell
npm install
npm run dev        # dev server
npm test           # unit and UI tests
npm run build      # type-check, build to dist/
npm run preview    # serve the production build (service worker active)
```

Other scripts:

- `npm run icons` regenerates the placeholder PNG icons in `public/icons/` (no external assets; the output is committed).

## First launch: the questionnaire

1. **Welcome**, then six short pages: your field and goal, plan length and daily time, subjects (tracks), resources and study style, **your prompt** (copy it, with links to ChatGPT and Claude), and **import** (choose the `.txt` file or paste the AI's reply).
2. Pick the start date. The checklist, Plan and Progress tabs are built from the imported plan.
3. Already have a plan file? Choose "I already have a plan file" on the welcome page to skip the questions.

The questionnaire can be reopened any time from **Settings > Plan > Create a new plan (questionnaire)**. The prompt text lives in `src/lib/planPrompt.ts` and the pages in `src/components/PlanWizard.tsx`.

## Import your own plan

**Settings > Plan > Import plan (.txt)** (or the last questionnaire page) replaces the plan with a text file in this format. **Download current plan as .txt** gives you a ready-made file to edit.

```text
### Week 1: Arrays and hashing

**Day 1**

- [ ] **DSA:** [Two Sum](https://leetcode.com/problems/two-sum/) (hashing)
- [ ] **HLD:** Read about load balancing

**Day 2 (review)**

- [ ] **DSA:** Redo yesterday's problem
- [ ] **HLD:** Redo one design
```

Rules:

- `### Week N: title` starts a week. Weeks are numbered 1, 2, 3, ... in order.
- `**Day N**` or `**Day N (label)**` starts a day. Days are numbered 1, 2, 3, ... continuously across weeks. A label containing "review" marks a review day.
- `- [ ] **TRACK:** text` is a task. The track is any short name (DSA, HLD, Reading, ...); every day needs at least one task, and any number of tasks per day is fine. `[label](https://...)` links become buttons (only http and https links are accepted).
- Lines that match none of these, and anything before an optional `## N-week daily plan` heading, are ignored.
- Errors are reported with the offending line number and nothing is changed.

**The questionnaire prompt:** it asks for your field (tech interviews, UPSC or any other exam or skill), goal, level, weak areas, plan length, hours per day, tracks (subjects), links, books or courses to use, study style and extra instructions, then writes a ready-to-paste prompt with the exact format rules. If the AI's reply stops early, send "continue" and join the parts into one file. Your answers are remembered in `localStorage`. Track names are free text (up to 24 characters, e.g. `GS2`, `Current Affairs`); tracks outside DSA/HLD/LLD/AI get an automatic badge colour.

On import the app builds the day-wise checklist, Plan and Progress tabs (overall, by week, by track) from the file. When you replace an existing plan, ticks and notes are kept for tasks whose id (`d<day>-<track>`), track and text are unchanged; the confirmation dialog tells you what would be removed. The plan is stored in `localStorage`.

`data/plan-source.md` is no longer used by the app (nothing is bundled). It is the author's former built-in plan, kept only as a reference file you can delete.

## Notes

Every task has its own notes: type in the box under the task and press **Submit** (or Enter). Notes are listed below the task with a timestamp, can be added repeatedly and deleted individually. They are stored in `localStorage` with the rest of your progress and included in exports.

## Test on your iPhone during development

Run `npm run dev -- --host` and open the printed Network URL in Safari on the same Wi-Fi.
The service worker only registers on HTTPS (or localhost), so offline mode and install need the deployed site below.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository whose default branch is `main`.
2. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs the tests, builds and deploys.
4. Your app is at `https://<user>.github.io/<repo>/`.

The Vite `base` is `./` and the manifest uses `start_url: "./"` and `scope: "./"`, so the same build works under any repository name without configuration.

## Install on iPhone

1. Open the deployed URL in **Safari** (it must be Safari, not Chrome).
2. Tap **Share**.
3. Tap **Add to Home Screen**, then **Add**.
4. Open it from the Home Screen icon. Open it once while online; after that it works fully offline.

## Your data

- Progress is stored on the device. iOS can clear website data for sites you haven't used for a while, and the Home Screen app and Safari have **separate** storage.
- Use **Settings > Export progress** regularly (the app reminds you after 7 days) and **Import progress** to restore. A progress backup does not contain an imported plan: keep the plan `.txt` too and import it first when restoring on a fresh browser.
- If saved data is ever unreadable, the app starts fresh and keeps a copy of the old data in `localStorage` under `prep-tracker:corrupt-backup`.
