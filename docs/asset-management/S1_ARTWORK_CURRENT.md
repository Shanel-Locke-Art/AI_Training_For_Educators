# Scenario 1 current artwork

This list covers **Start With the Learning** in the current game. Paths are relative to the project root. “Used” means the current S1 route or its shared interface references the file. “Available” means the portrait is registered but no current S1 line requests that expression. Check the screen at desktop, tablet, and phone sizes before replacing art.

## Scene and interface artwork

| File | S1 use | State |
|---|---|---|
| `assets/images/backgrounds/gfc/bg_s01_01_science_wing.jpg` | Background behind the S1 activity screens | Used |
| `assets/images/backgrounds/bg_02_classroom.png` | Visual novel dialogue scene and fallback classroom | Used |
| `assets/images/backgrounds/bg_01_app.png` | Shared application background | Used by shared shell |
| `assets/images/ui/ui_04_mo_river_otter.png` | Mo art in the S1 Canvas style area | Used |
| `assets/images/ui/ui_01_babbage_mark.svg` | Babbage and PromptCraft shared interface mark | Used by shared shell |
| `assets/images/ui/ui_02_babbage_engine.webp` | Shared Babbage panel artwork | Used by shared shell |

## Maya portraits

Base folder: `assets/images/characters/students/maya/`

| File | S1 use | State |
|---|---|---|
| `maya_01_neutral.png` | Maya side panel and two later dialogue scenes | Used |
| `maya_03_uncertain.png` | Opening dialogue | Used |
| `maya_02_thinking.png` | Registered expression; no current S1 line requests it | Available |
| `maya_04_frustrated.png` | Registered expression; no current S1 line requests it | Available |
| `maya_05_confident.png` | Registered expression; no current S1 line requests it | Available |

## Professor Pixel portraits

Base folder: `assets/images/characters/professor-pixel/`

| File | S1 use | State |
|---|---|---|
| `pp_01_neutral.png` | Opening dialogue and shared interface default | Used |
| `pp_04_encouraging.png` | Opening, My Course transition, and closing dialogue | Used |
| `pp_02_thinking.png` | Learning-path reflection dialogue | Used |
| `pp_06_proud.png` | Closing dialogue | Used |
| `pp_03_excited.png` | Registered expression; no current S1 line requests it | Available |
| `pp_05_skeptical.png` | Registered expression; no current S1 line requests it | Available |

## Production check

No new artwork is confirmed as required by the current S1 source. If any art is replaced, preserve its registered path or update `assets/asset-manifest.json`, the asset registry, and the visual tracker together. Verify transparent portrait edges, readable bubble placement, and framing at phone, tablet, Nest Hub, and desktop sizes.

Source checks: `src/js/scenarios/s1-start-with-learning.js`, `src/js/content/dialogue-data.js`, `src/js/app/config-and-assets.js`, `index.html`, and asset manifest v151.
