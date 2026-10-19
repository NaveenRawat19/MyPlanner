# 56-Day Interview Prep Tracker

An installable, offline-first PWA for tracking a 56-day DSA / HLD / LLD / AI interview prep plan.
No backend, no accounts, no analytics: everything lives in your browser's `localStorage`.

Stack: Vite, React, TypeScript (strict), plain CSS, `vite-plugin-pwa`, Vitest.

## Run locally (Windows, macOS or Linux)

Requires Node.js 20 or newer.

```powershell
npm install
npm run dev        # dev server (parses the plan first)
npm test           # unit and UI tests
npm run build      # parse, type-check, build to dist/
npm run preview    # serve the production build (service worker active)
```

Other scripts:

- `npm run parse` regenerates `src/data/plan.json` from `data/plan-source.md`. It fails unless there are exactly 56 days with 4 tasks each. It runs automatically before `dev` and `build`.
- `npm run icons` regenerates the placeholder PNG icons in `public/icons/` (no external assets; the output is committed).

To change the built-in plan, edit `data/plan-source.md` (everything before the "N-week daily plan" heading is ignored). You can also swap the plan at runtime without rebuilding: see below.

## Import your own plan

**Settings > Plan > Import plan (.txt)** replaces the plan with a text file in this format (the same Markdown subset as `data/plan-source.md`). **Download current plan as .txt** gives you a ready-made file to edit.

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

**Generate a plan with AI:** Settings > Plan > "Generate a plan with AI" has a copy-ready prompt (source: `src/lib/planPrompt.ts`) that works for tech interviews, UPSC or any other exam or skill, with suggested tracks and sources for the first two. Paste it into ChatGPT, Claude or Gemini, fill in the bracketed field, duration, daily time and tracks, save the reply as a `.txt` file and import it. Track names are free text (up to 24 characters, e.g. `GS2`, `Current Affairs`); tracks outside DSA/HLD/LLD/AI get an automatic badge colour.

On import the app builds the day-wise checklist, Plan and Progress tabs (overall, by week, by track) from the file. Ticks and notes are kept for tasks whose id (`d<day>-<track>`), track and text are unchanged; the confirmation dialog tells you what would be removed. The imported plan is stored in `localStorage`; **Use built-in plan** switches back.

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
