# PromptCraft repository architecture

This is the canonical repository map for `PROMPTCRAFT_V429` as represented by the current V429 / cache revision 446 development baseline. Older flat/numeric layouts should not be reconstructed from memory.

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
│   ├── runtime-state.js          # global runtime + teaching progress state
│   ├── config-and-assets.js      # ASSETS registry + receiver configuration
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
│   └── ideas-wall.css
├── responsive/
├── scenarios/
└── ui/
    └── gfc-theme.css
```

`src/css/manifest.css` defines the application cascade. `pages/ideas-wall.css` is intentionally standalone. `tools/build.py` fails if an undeclared CSS owner appears.

## Assets

`assets/asset-manifest.json` is the canonical asset classification map. Current manifest version: `144`.

Major current asset groups:

- application/classroom backgrounds
- GFC S1/S2 campus backgrounds
- Professor Pixel portraits
- Jordan S2 portraits
- scenario scene art
- Babbage mark, Charles Babbage portrait, Babbage engine
- Great Falls College print/logo asset
- PromptCraft QR code
- current runtime audio
- planned line-by-line audio
- development-only character references

## Tooling

| Tool | Purpose |
|---|---|
| `tools/build.py` | Generate/synchronize runtime output and syntax-check JavaScript |
| `tools/validate.py` | Structural, compatibility, action-registration, and hardening guards |
| `tools/audit_css.py` | CSS duplicate/retired-selector audit |
| `tools/audit_assets.py` | Asset classification/reference audit |
| `tools/check.py` | One-command regression runner; `--full` includes browser tests |

Current browser regression coverage also includes teaching progression, Ideas Wall header/theme, GFC action borders, Babbage print/save, S1/S2 guided repair, terminal handoffs, and analysis overflow.

## Scenario boundary

Only S1 and S2 have active browser implementations in this baseline. S3-S8 are development shells. Old S3-S5 browser prototype code and styling were removed so new scenario development starts from shared architecture rather than inherited dormant behavior.

The server-side Babbage proxy keeps S3-S5 structured response contracts because those are future-facing integration contracts, not playable browser implementations.

## Retired layout/naming patterns

Do not restore:

- flat `functions/app*.js` browser source structure
- numeric `styles/*.css` ownership as the development model
- `scenario-prototypes.js`
- `netlify/functions/claude.js`
- Claude-named browser selectors/actions/API functions
- patch-number suffixes on runtime state classes/functions when a semantic name exists
- removed S2 case-file/evidence layout selectors recorded by `tools/audit_css.py`

The retained `claude_response` tokens exist only for V121 receiver compatibility.

## Asset-management files

Canonical workbooks:

- `docs/asset-management/master-asset-tracker.xlsx`
- `docs/asset-management/visual-asset-tracker.xlsx`
- `docs/asset-management/dialogue-voiceover-tracker.xlsx`

Do not create version-number duplicates of these workbooks for routine updates. Version history belongs in source control/research records.
