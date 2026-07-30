# PromptCraft JavaScript modules

The files load synchronously in this order:

1. `dialogue.js` — dialogue content and expression metadata.
2. `app.js` — shared state, configuration, data logging, and audio.
3. `app-scenarios.js` — scenario definitions, main menu, inline coaching, and scenario navigation.
4. `app-vn.js` — visual-novel engine, responsive layout controllers, scene loading, and initialization.
5. `app-workbench.js` — scenario loading, the S1 workbench, scoring, completion, reflection, and development tools.

Do not add `async`, `defer`, or `type="module"` to these script tags without converting the shared globals. The current order preserves the behavior of the original single `app.js` file.
