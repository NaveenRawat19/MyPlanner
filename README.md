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

To change the plan, edit `data/plan-source.md` (everything before the "8-week daily plan" heading is ignored).

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
- Use **Settings > Export progress** regularly (the app reminds you after 7 days) and **Import progress** to restore.
- If saved data is ever unreadable, the app starts fresh and keeps a copy of the old data in `localStorage` under `prep-tracker:corrupt-backup`.
