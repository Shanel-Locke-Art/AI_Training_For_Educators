# PromptCraft CSS ownership map

The numeric prefixes define the cascade. Preserve this order in `style.css`.
`tools/build-production.py` compiles every application owner into
`styles/promptcraft.css`, the only local stylesheet loaded by `index.html`.
`styles/wall.css` belongs only to `wall.html` and is deliberately outside this cascade.

| File | Primary owner |
|---|---|
| `00-base.css` | Tokens, reset, page defaults, accessibility foundations |
| `10-visual-novel.css` | VN overlay, scene, smartboard, characters, dialogue |
| `20-terminal.css` | Claude terminal and workstation compatibility |
| `30-legacy-responsive.css` | Active historical responsive compatibility, now formatted and searchable |
| `40-components.css` | Shared controls, cards, menus, modals, reflection UI |
| `50-layout.css` | Application shell and broad layout rules |
| `60-intro-scenes.css` | Scenario introduction screens |
| `70-prediction-scenes.css` | Prediction screens and base prediction behavior |
| `80-live-analysis.css` | Claude analyzing state only |
| `90-completed-analysis.css` | Claude completed-analysis report only |
| `100-scenario-1-workbench.css` | Scenario 1 workbench |
| `110-shared-scenarios.css` | Reusable scenario activity components |
| `115-intro-responsive.css` | Late intro-screen responsive owner rules |
| `116-workbench-responsive.css` | Late workbench responsive owner rules |
| `117-brand-menu.css` | Header branding and compact menu behavior |
| `118-large-tablet.css` | Large-tablet corrections |
| `119-prediction-responsive.css` | Final prediction-screen responsive owner rules |

## Maintenance rules

1. Find the existing owner rule and modify it directly. Do not append a generic
   override merely to defeat an earlier rule.
2. Never edit `styles/promptcraft.css`; regenerate it with
   `python tools/build-production.py`.
3. Keep source order in `style.css`. Loading a source owner directly from HTML is
   prohibited because it creates a second, less visible cascade.
4. Run `python tools/validate-project.py` after CSS changes. The CSS audit checks
   syntax structure, exact duplicate rules, selectors retired during Phase 3, and the
   standalone Ideas Wall stylesheet.
5. Keep page-owned styles such as `wall.css` out of `style.css` unless they become part
   of the main application cascade.
6. Keep the temporary 15-second Claude analysis hold until the responsive analysis
   alignment work is complete.
