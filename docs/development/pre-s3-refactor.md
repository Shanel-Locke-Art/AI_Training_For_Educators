# Pre-S3 refactor record

This record describes the stabilization pass completed before Scenario 3 development. It exists to prevent future work from reconstructing removed architecture from old packages or patch-history comments.

## What changed

### Repository/source ownership

- Reorganized JavaScript by application, research, AI, audio, scenario, UI, content, page, and development responsibility.
- Made `src/js/manifest.json` authoritative for application bundle order and standalone runtime copies.
- Made `src/css/manifest.css` authoritative for the application cascade.
- Added manifest-completeness checks so orphan source owners fail the build.
- Removed patch-number suffixes from internal runtime state/function names where the number had no compatibility meaning.
- Removed patch-number suffixes from asset-tracker filenames.

### Scenario cleanup

- Removed dormant historical S3–S5 playable browser prototype implementations.
- Removed matching dead UI actions and obsolete S3–S5 browser CSS.
- Kept S3–S5 structured Netlify contracts for future scenario development.
- Kept S3–S8 as explicit locked development shells in the active registry.

### Babbage terminology

- Removed the unused `netlify/functions/claude.js` endpoint.
- Normalized browser functions, DOM IDs/classes/actions, and tests to Babbage terminology.
- Retained only the two V121 `claude_response` payload keys required by receiver compatibility, each alongside provider-neutral Babbage data.

### Responsive/analysis architecture

- Split the former multi-purpose workstation owner into shared workstation geometry, completed-analysis layout, live-analysis layout/progress, and completed-analysis controller modules.
- Preserved the existing responsive behavior/cascade rather than redesigning approved screens.
- Fixed the recorded-dialogue guard so an explicit Continue control owns the transition instead of allowing the dialogue surface to consume it.
- Normalized live-analysis responsive state classes to semantic names.

### CSS cleanup

- Removed hundreds of unreachable rules/selector branches tied to interfaces no current HTML/JavaScript can create.
- Added those retired class names to the CSS audit so accidental restoration fails validation.
- Left still-active compatibility and late-override rules in place to preserve approved S1/S2 visuals. They are not extension points for S3.

### Regression gate

Added `tools/check.py`:

```bash
python tools/check.py          # structural/focused checks
python tools/check.py --full   # browser/responsive/interaction checks too
```

S3 work should begin only from a repository that passes the full gate.

## What did not change

- `PROMPTCRAFT_V429`
- schema V121
- receiver V82 or its deployment URL
- approved Ideas Wall visual design
- Ideas Wall moderation/publication rules
- approved S1/S2 visual intent and interaction flow, except for the recorded-dialogue bug fix noted above
- backend S1–S5 structured Babbage response contracts

## S3 rule

Build S3 from the current shared VN, responsive workstation, activity-component, lifecycle, research, and Babbage systems. Do not copy code from removed S3 prototypes or solve S3 with a new stack of late responsive overrides.
