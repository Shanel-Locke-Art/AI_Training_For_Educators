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
12. `scenarios/shared.css`
13. `responsive/intro.css`
14. `responsive/workbench.css`
15. `ui/brand-menu.css`
16. `responsive/large-tablet.css`
17. `responsive/prediction.css`
18. `responsive/final-overrides.css`

`tools/build.py` concatenates those owners into `runtime/css/promptcraft.css` without changing their cascade order.

The Ideas Wall is deliberately isolated:

- source: `src/css/pages/ideas-wall.css`
- runtime: `runtime/css/ideas-wall.css`

## Ownership rules

1. Put new rules in the semantic owner that controls the component/state.
2. Prefer shared viewport-family rules over device-name patches.
3. Do not add S3 styling to `compat/legacy-responsive.css` or `responsive/final-overrides.css` merely because those files load late.
4. Treat the compatibility and final-override owners as preserved S1/S2 debt scheduled for gradual migration, not as extension points.
5. Keep scenario-specific rules under `scenarios/` only when behavior is genuinely scenario-specific.
6. Shared VN character layout belongs to the VN/slot system, never to a named student portrait.
7. Never hand-edit `runtime/css/promptcraft.css`.
8. Keep Ideas Wall rules out of the main application cascade unless a component truly becomes shared.

## Dead-selector policy

The pre-S3 cleanup removed CSS for interfaces/classes that current HTML and JavaScript cannot create, including abandoned S2 case-file/evidence variants, retired menu toggles, and old final-review layouts. Those class names are now listed as retired in `tools/audit_css.py`.

A retired selector failing the audit is intentional friction. Reuse the current component instead of reviving an old selector unless there is an explicit architectural reason.

## Validation

Run:

```bash
python tools/audit_css.py
python tools/build.py --check
```

For the complete pre-release gate:

```bash
python tools/check.py --full
```
