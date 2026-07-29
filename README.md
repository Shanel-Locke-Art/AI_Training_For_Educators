# PromptCraft

PromptCraft is an interactive visual-novel training experience for educators.

## Folder map

- `public/` — files deployed to the website
  - `index.html`, `wall.html`, `favicon.ico`
  - `assets/` — runtime images and audio
  - `scripts/` — generated browser JavaScript plus `dialogue.js`
  - `styles/` — generated production CSS
- `src/` — editable application source
  - `src/js/` — dialogue, scenario, VN, and workbench modules
  - `src/css/` — ordered reusable CSS owner modules
- `netlify/functions/` — server-side Netlify function code
- `tools/` — production build script
- `docs/` — asset trackers, documentation, and archived legacy material
- `tests/` — developer-only test pages

## Edit and build

Edit files under `src/`, then run:

```bash
python tools/build-production.py
```

The browser-ready files are generated in `public/scripts/` and `public/styles/`.
Do not edit generated bundle files directly.

## Deployment

Netlify is configured to publish the `public/` directory and load serverless
functions from `netlify/functions/`.

The Git repository's `.git/` directory should remain local. Do not include it in
manual deployment ZIPs or file handoffs.
