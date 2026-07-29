# Production build

PromptCraft separates editable source from browser-ready output.

## Editable files

- CSS module order: `src/css/index.css`
- JavaScript source order:
  1. `src/js/app-core.js`
  2. `src/js/scenarios.js`
  3. `src/js/vn-engine.js`
  4. `src/js/workbench.js`
- Dialogue content: `src/js/dialogue.js`

## Generated files

- `public/styles/promptcraft.bundle.css`
- `public/scripts/app.bundle.js`
- `public/scripts/dialogue.js`

Run:

```bash
python tools/build-production.py
```

The CSS builder preserves module order, removes comments and formatting, and
removes declarations only when a later rule has the identical selector and
conditional context. The JavaScript bundle concatenates the four application
modules in their required order.
