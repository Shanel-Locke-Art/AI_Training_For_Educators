# PromptCraft CSS architecture

PromptCraft keeps editable CSS in `src/css/` and browser-loaded output in `runtime/css/`. The application has one ordered source manifest and one generated stylesheet.

## Application cascade

`src/css/manifest.css` is authoritative. Its current order is:

1. `foundation/base.css`
2. `ui/visual-novel.css`
3. `ui/babbage-terminal.css`
4. `compat/legacy-responsive.css`
5. `ui/components.css`
6. `layout/app-layout.css`
7. `ui/intro-scenes.css`
8. `ui/prediction-scenes.css`
9. `ui/live-analysis.css`
10. `ui/completed-analysis.css`
11. `scenarios/s1-engagement.css`
12. `scenarios/s1-course-design.css`
13. `scenarios/shared.css`
14. `responsive/intro.css`
15. `responsive/workbench.css`
16. `ui/brand-menu.css`
17. `responsive/large-tablet.css`
18. `responsive/prediction.css`
19. `responsive/final-overrides.css`
20. `ui/gfc-theme.css`

`tools/build.py` concatenates those owners into `runtime/css/promptcraft.css` without changing their cascade order.

The Ideas Wall is deliberately isolated:

- source: `src/css/pages/ideas-wall.css`
- runtime: `runtime/css/ideas-wall.css`

## Ownership rules

1. Put new rules in the semantic owner that controls the component/state.
2. Prefer shared viewport-family rules over device-name patches.
3. Do not add S3 styling to `compat/legacy-responsive.css` or `responsive/final-overrides.css` merely because those files load late.
4. Treat compatibility and final-override owners as preserved S1/S2 debt scheduled for gradual migration, not as extension points.
5. Keep scenario-specific rules under `scenarios/` only when behavior is genuinely scenario-specific.
6. Shared VN character layout belongs to the VN/slot system, never to a named student portrait.
7. Never hand-edit `runtime/css/promptcraft.css`.
8. Keep Ideas Wall rules out of the main application cascade unless a component truly becomes shared.
9. Shared GFC/PromptCraft visual tokens and cross-component theme overrides belong in `ui/gfc-theme.css`; scenario behavior does not.
10. Gold is an interaction/accent color, not a permanent heavy border around every button. Resting controls should use the current blue/navy border system; gold is reserved for focus, selection, or intentional emphasis.

## Current theme-sensitive components

The shared GFC theme currently covers, among other surfaces:

- brand/header menu and PromptCraft/Babbage identity
- onboarding/name and audio dialogs
- scenario workspaces and assembled-repair previews
- prediction/result actions
- Babbage workstation controls while preserving the green CRT content
- completed-analysis/readability adjustments
- locked scenario development shells
- teaching-progression HUD and expanded progress panel

The Ideas Wall uses its own equivalent navy/blue/gold page treatment in `pages/ideas-wall.css`.

## Dead-selector policy

The pre-S3 cleanup removed CSS for interfaces/classes that current HTML and JavaScript cannot create, including abandoned S2 case-file/evidence variants, retired menu toggles, and old final-review layouts. Those class names are listed as retired in `tools/audit_css.py`.

A retired selector failing the audit is intentional friction. Reuse the current component instead of reviving an old selector unless there is an explicit architectural reason.

## Validation

`release/phase4-css-ownership.json` is the machine-readable final-cascade
inventory. It records every normalized selector header, its owner and cascade
position, media context, repeated ownership, component-family distribution,
rule totals, and `!important` totals. Regenerate it with:

```bash
python tools/css_ownership_inventory.py
```

Phase 4 structural moves and deletions require a browser executable plus
computed-style, screenshot, overflow, keyboard, focus, reduced-motion, and
announcement baselines for the component slice being moved. When that visual
environment is unavailable, inventory and regression-gate work may continue,
but `final-overrides.css` and compatibility rules must not be moved or deleted.

Run:

```bash
python tools/audit_css.py
python tools/css_ownership_inventory.py --check
python tools/build.py --check
```

For the complete pre-release gate:

```bash
python tools/check.py --full
```
