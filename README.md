# PromptCraft V429

PromptCraft is a static browser application for scenario-based AI literacy training. The repository separates editable source, generated browser runtime files, media assets, research integration, serverless AI access, regression tests, and development documentation.

## Authoritative baseline

- Application build: `PROMPTCRAFT_V429`
- App schema: `V121`
- Research receiver: `PromptCraft_Receiver_V82_Ideas_Wall_Moderation.js`
- Receiver deployment: keep using the existing Apps Script deployment URL configured in source
- Main application: `index.html`
- Public Ideas Wall: `wall.html`
- Active browser scenarios: S1 Engagement and S2 Metacognition
- Development shells: S3 through S8

Cache/query revisions are deployment/cache controls. They do **not** automatically change the PromptCraft application build number.

## Repository map

```text
PromptCraft_V429/
├── index.html
├── wall.html
├── favicon.ico
├── netlify.toml
├── assets/
│   ├── audio/
│   ├── images/
│   ├── ui/
│   └── asset-manifest.json
├── src/
│   ├── js/
│   │   ├── manifest.json
│   │   ├── ai/
│   │   ├── app/
│   │   ├── audio/
│   │   ├── content/
│   │   ├── dev/
│   │   ├── pages/
│   │   ├── research/
│   │   ├── scenarios/
│   │   └── ui/
│   └── css/
│       ├── manifest.css
│       ├── compat/
│       ├── foundation/
│       ├── layout/
│       ├── pages/
│       ├── responsive/
│       ├── scenarios/
│       └── ui/
├── runtime/
│   ├── js/
│   └── css/
├── netlify/functions/
├── tests/
├── tools/
└── docs/
    ├── asset-management/
    └── development/
```

The ownership rule is intentionally simple:

- **Edit `src/`.**
- **Generate `runtime/`.** Do not hand-edit bundles.
- **Keep browser media in `assets/`.**
- **Keep tests in `tests/`.**
- **Keep build/audit/check utilities in `tools/`.**
- **Keep architecture decisions in `docs/development/`.**

## JavaScript architecture

`src/js/manifest.json` is the source of truth for bundle order. The current owners are grouped by responsibility rather than by historical patch number.

### Application and integration

- `app/runtime-state.js` — shared application state, UI action registry, modal/audio setup state, and lifecycle primitives.
- `app/config-and-assets.js` — application/schema constants, endpoint configuration, and centralized asset paths.
- `app/scenario-runtime.js` — scenario opening/closing, navigation, workbench routing, and scenario lifecycle cleanup.
- `app/bootstrap.js` — startup and initial browser wiring.
- `research/tracking.js` — research events, session/result payloads, and receiver submission.
- `ai/babbage-client.js` — provider-neutral browser client for the Babbage Netlify proxy.
- `audio/audio-engine.js` and `audio/babbage-tts.js` — shared audio/TTS behavior.

### Shared UI and responsive systems

- `ui/visual-novel.js` — shared VN dialogue/cast engine.
- `ui/workstation-layout.js` — shared viewport families, VN reset helpers, workstation geometry, and prediction frame capture.
- `ui/completed-analysis-layout.js` — completed diagnostic fitting and workstation alignment.
- `ui/live-analysis-layout.js` — live Babbage analyzing layout and progress lifecycle.
- `ui/analysis-layout-controller.js` — responsive completed-analysis mode selection and scheduling.
- `ui/babbage-terminal.js` — Babbage report rendering, Print/Save PDF, and terminal interaction.
- `ui/prediction-gate.js` — prediction/question presentation and responsive state handling.

### Scenarios

- `scenarios/shared-components.js` — reusable scenario activity components.
- `scenarios/registry.js` — scenario metadata, availability, menu/navigation, and shared scenario services.
- `scenarios/s1-engagement.js` — S1 implementation.
- `scenarios/s2-metacognition.js` — S2 implementation.

S3 through S8 are intentionally development shells. Old playable S3–S5 browser prototypes were removed before S3 development so dormant implementations cannot compete with the new shared architecture. The Netlify proxy still retains structured S3–S5 contracts for future use.

### Standalone browser files

- `content/dialogue-data.js` → `runtime/js/dialogue-data.js`
- `pages/ideas-wall.js` → `runtime/js/ideas-wall.js`

`tools/build.py` keeps these synchronized.

## CSS architecture

`src/css/manifest.css` is the sole ordered application CSS manifest. It compiles to `runtime/css/promptcraft.css`. `index.html` loads only that generated local application stylesheet.

The Ideas Wall remains isolated in `src/css/pages/ideas-wall.css` and synchronizes to `runtime/css/ideas-wall.css`; its approved design is not part of the main application cascade.

The historical compatibility/late-override owners remain only where they still affect approved S1/S2 behavior. Dead selectors tied to removed interfaces are audited as retired and may not be restored casually. New S3 work should go into semantic shared/scenario owners, not into the legacy compatibility pile.

See `docs/development/css-architecture.md`.

## Build and checks

After source changes:

```bash
python tools/build.py
python tools/check.py
```

Before packaging a release or beginning a new scenario:

```bash
python tools/check.py --full
```

The full check includes source/runtime synchronization, structural hardening, proxy contracts, Print/Save and Ideas Wall contracts, S2 terminal flow, scenario runtime smoke tests, shared VN geometry, analysis overflow checks, and the S2 interaction regression suite.

A live deployed Babbage health check remains available separately because it requires a deployed site:

```bash
node tests/test_babbage_live.js <site-url>
```

Do not add `async`, `defer`, or `type="module"` to the browser script tags without first converting the current shared-global bundle architecture.

## Compatibility contracts

The pre-S3 cleanup deliberately preserves several external contracts:

1. App build remains `PROMPTCRAFT_V429`.
2. Research schema remains `V121`.
3. Receiver remains V82 and keeps the existing deployment URL.
4. The V121 payload still includes the historical `claude_response` field **only for receiver compatibility**, alongside the provider-neutral `babbage_response` field. Browser UI, DOM selectors, actions, and AI code use Babbage terminology.
5. `netlify/functions/babbage.js` is the only AI serverless endpoint in the repository.
6. S3–S5 structured backend contracts remain available, while old S3–S5 browser implementations do not.
7. Ideas Wall candidates are not auto-published; only Review Status `Publish` appears publicly.

See `docs/development/compatibility-contracts.md`.

## Development rules

1. Check shared S1/S2 architecture before adding CSS or JavaScript.
2. Prefer shared components and viewport families over scenario/device-specific patches.
3. Preserve approved visual design and behavior unless a change is explicitly requested.
4. Character placement belongs to reusable slots/components, not individual character positioning rules.
5. Scenario switching must cancel timers, callbacks, AI requests, audio, overlays, animation frames, and stale state.
6. Keep source and generated runtime synchronized with `tools/build.py`.
7. Treat real screenshots as the source of truth for visual defects.
8. Do not restore retired tabs, receiver schemas, VN positioning rules, provider-specific UI names, or dormant scenario prototypes.
9. Do not hand-edit generated bundles.
10. Do not increment `PROMPTCRAFT_V429` merely because a cache/query revision changes.

## Ideas Wall

The public wall is owned by:

- `wall.html`
- `src/js/pages/ideas-wall.js`
- `src/css/pages/ideas-wall.css`

Cards display the complete descriptive paragraph. Publication still requires Review Status `Publish`; meeting candidate thresholds alone never publishes a submission.

## Asset management

`assets/asset-manifest.json` classifies runtime, planned, reference, and documentation assets. Tracking workbooks are stored without patch-number filenames:

- `docs/asset-management/dialogue-voiceover-tracker.xlsx`
- `docs/asset-management/master-asset-tracker.xlsx`
- `docs/asset-management/visual-asset-tracker.xlsx`

Run `python tools/audit_assets.py` to verify classification and references.
