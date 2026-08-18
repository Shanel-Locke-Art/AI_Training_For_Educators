# PromptCraft repository architecture

This is the canonical pre-S3 repository map for `PROMPTCRAFT_V429`. Older flat/numeric layouts should not be reconstructed from memory.

## Runtime entry points

| Path | Ownership |
|---|---|
| `index.html` | Main PromptCraft application shell |
| `wall.html` | Public Ideas Wall shell |
| `runtime/js/promptcraft.bundle.js` | Generated application JavaScript |
| `runtime/js/dialogue-data.js` | Generated/synchronized dialogue data |
| `runtime/js/ideas-wall.js` | Generated/synchronized Ideas Wall JavaScript |
| `runtime/css/promptcraft.css` | Generated application CSS |
| `runtime/css/ideas-wall.css` | Generated/synchronized Ideas Wall CSS |

Files under `runtime/` are browser output. Edit their owners under `src/` instead.

## JavaScript source ownership

```text
src/js/
├── manifest.json
├── ai/
│   └── babbage-client.js
├── app/
│   ├── runtime-state.js
│   ├── config-and-assets.js
│   ├── scenario-runtime.js
│   └── bootstrap.js
├── audio/
│   ├── audio-engine.js
│   └── babbage-tts.js
├── content/
│   └── dialogue-data.js
├── dev/
│   └── development-tools.js
├── pages/
│   └── ideas-wall.js
├── research/
│   └── tracking.js
├── scenarios/
│   ├── shared-components.js
│   ├── registry.js
│   ├── s1-engagement.js
│   └── s2-metacognition.js
└── ui/
    ├── visual-novel.js
    ├── workstation-layout.js
    ├── completed-analysis-layout.js
    ├── live-analysis-layout.js
    ├── analysis-layout-controller.js
    ├── babbage-terminal.js
    └── prediction-gate.js
```

`src/js/manifest.json` defines bundle order and standalone source/runtime mappings. `tools/build.py` fails if a JavaScript source owner exists but is not declared in the manifest.

## CSS source ownership

```text
src/css/
├── manifest.css
├── compat/
├── foundation/
├── layout/
├── pages/
├── responsive/
├── scenarios/
└── ui/
```

`src/css/manifest.css` defines the application cascade. `pages/ideas-wall.css` is intentionally standalone. `tools/build.py` fails if an undeclared CSS owner appears.

## Tooling

| Tool | Purpose |
|---|---|
| `tools/build.py` | Generate/synchronize runtime output and syntax-check JavaScript |
| `tools/validate.py` | Structural, compatibility, action-registration, and hardening guards |
| `tools/audit_css.py` | CSS duplicate/retired-selector audit |
| `tools/audit_assets.py` | Asset classification/reference audit |
| `tools/check.py` | One-command regression runner; `--full` includes browser tests |

## Scenario boundary

Only S1 and S2 have active browser implementations in this baseline. S3–S8 are development shells. Old S3–S5 browser prototype code and styling were removed so new scenario development starts from shared architecture rather than inherited dormant behavior.

The server-side Babbage proxy keeps S3–S5 structured response contracts because those are future-facing integration contracts, not playable browser implementations.

## Retired layout/naming patterns

Do not restore:

- flat `functions/app*.js` browser source structure
- numeric `styles/*.css` ownership as the development model
- `scenario-prototypes.js`
- `netlify/functions/claude.js`
- Claude-named browser selectors/actions/API functions
- patch-number suffixes on runtime state classes/functions when a semantic name exists
- removed S2 case-file/evidence layout selectors recorded by `tools/audit_css.py`

The only retained Claude-named browser-source tokens are the two `claude_response` research payload keys required by schema V121 compatibility.

## Asset-management filenames

Current workbooks:

- `dialogue-voiceover-tracker.xlsx`
- `master-asset-tracker.xlsx`
- `visual-asset-tracker.xlsx`

Version history belongs in source control/research records, not in filenames that must be renamed every time the project changes.
