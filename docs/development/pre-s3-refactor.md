# Pre-S3 refactor and stabilization record

This is a historical boundary record. It describes the cleanup completed before Scenario 3 development and the shared systems that have continued to evolve afterward. It exists to prevent future work from reconstructing removed architecture from old packages or patch-history comments.

## What changed during the pre-S3 refactor

### Repository/source ownership

- Reorganized JavaScript by application, research, AI, audio, scenario, UI, content, page, and development responsibility.
- Made `src/js/manifest.json` authoritative for application bundle order and standalone runtime copies.
- Made `src/css/manifest.css` authoritative for the application cascade.
- Added manifest-completeness checks so orphan source owners fail the build.
- Removed patch-number suffixes from internal runtime state/function names where the number had no compatibility meaning.
- Removed patch-number suffixes from canonical asset-tracker filenames.

### Scenario cleanup

- Removed dormant historical S3-S5 playable browser prototype implementations.
- Removed matching dead UI actions and obsolete S3-S5 browser CSS.
- Kept S3-S5 structured Netlify contracts for future scenario development.
- Kept S3-S8 as explicit locked development shells in the active registry.

### Babbage terminology

- Removed the unused `netlify/functions/claude.js` endpoint.
- Normalized browser functions, DOM IDs/classes/actions, and tests to Babbage terminology.
- Retained only the V121 `claude_response` payload compatibility fields required by the receiver, alongside provider-neutral Babbage data.

### Responsive/analysis architecture

- Split the former multi-purpose workstation owner into shared workstation geometry, completed-analysis layout, live-analysis layout/progress, and completed-analysis controller modules.
- Preserved shared responsive behavior/cascade rather than redesigning approved screens with device-specific patches.
- Fixed recorded-dialogue ownership so explicit Continue controls own transitions.
- Normalized live-analysis responsive state classes to semantic names.

### CSS cleanup

- Removed unreachable rules/selector branches tied to interfaces no current HTML/JavaScript can create.
- Added retired class names to the CSS audit so accidental restoration fails validation.
- Left still-active compatibility and late-override rules in place to preserve approved S1/S2 behavior; they are not extension points for S3.

### Regression gate

`tools/check.py` provides the main regression entry point:

```bash
python tools/check.py
python tools/check.py --full
```

S3 work should begin only from a repository that passes the relevant gate.

## Post-refactor systems now present in the V429 baseline

The refactor boundary has been preserved while later work added or refined shared systems, including:

- GFC/PromptCraft navy-blue-gold visual theme
- shared brand dropdown/menu behavior
- GFC campus backgrounds for S1/S2
- shared assembled-repair preview pattern across S1/S2
- Babbage workstation/report lifecycle fixes and readable completed-analysis scaling
- document-first Print / Save PDF report
- current Meet Babbage page and Babbage/Charles Babbage branding assets
- Ideas Wall header/theme integration without changing moderation logic
- local education-based Teaching Progress / XP system

These are current shared systems, not invitations to restore old scenario implementations.

## What has not changed

- `PROMPTCRAFT_V429`
- schema V121
- receiver V82 or its deployment URL
- Ideas Wall moderation/publication rules
- S1/S2 shared VN and lifecycle architecture
- server-side S1-S5 structured Babbage response contracts
- S3-S8 development-shell boundary

## S3 rule

Build S3 from the current shared VN, responsive workstation, activity-component, lifecycle, research, Babbage, theme, and teaching-progress systems. Do not copy code from removed S3 prototypes or solve S3 with a new stack of late responsive overrides.
