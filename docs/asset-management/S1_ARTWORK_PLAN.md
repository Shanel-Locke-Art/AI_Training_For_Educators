# Scenario 1 artwork plan

This is the production brief for **Start With the Learning**. Nothing in this list is marked complete. Create only the artwork required by the current Scenario 1 route, then update the status in `PromptCraft_Visual_Asset_Tracker_Simplified.xlsx`.

For a printable version that also includes destination folders and code references, use `S1_Asset_Production_Specifications.docx`.

## Target dimensions

| Planned filename | Artwork | Ideal size | Ratio | Export | Production guidance |
|---|---|---:|---:|---|---|
| `bg_01_app.png` | Application background | 1920 × 1080 px | 16:9 | PNG | Do not embed text. Keep important detail inside the center 80%. |
| `bg_02_classroom.png` | Classroom background | 1920 × 1080 px | 16:9 | PNG | Leave clear space around both character positions and the dialogue interface. |
| `bg_s01_01_science_wing.jpg` | Science wing background | 1920 × 1080 px | 16:9 | JPG | Shoot or render wide. Keep faces, signs, and focal detail away from the edges. |
| `pp_01_neutral.png` | Professor Pixel — neutral | 1200 × 1500 px | 4:5 | Transparent PNG | Full figure. Match the crop, scale, lighting, and eye line across expressions. |
| `pp_02_thinking.png` | Professor Pixel — thinking | 1200 × 1500 px | 4:5 | Transparent PNG | Use the same silhouette, margins, and baseline as the neutral portrait. |
| `pp_04_encouraging.png` | Professor Pixel — encouraging | 1200 × 1500 px | 4:5 | Transparent PNG | Keep the gesture inside the canvas with at least 5% clear space. |
| `pp_06_proud.png` | Professor Pixel — proud | 1200 × 1500 px | 4:5 | Transparent PNG | Use the same silhouette, margins, and baseline as the neutral portrait. |
| `maya_01_neutral.png` | Maya — neutral | 1200 × 1500 px | 4:5 | Transparent PNG | Full figure. Match the crop, scale, lighting, and eye line across expressions. |
| `maya_03_uncertain.png` | Maya — uncertain | 1200 × 1500 px | 4:5 | Transparent PNG | Use the same silhouette, margins, and baseline as the neutral portrait. |
| `ui_01_babbage_mark.svg` | Babbage mark | 1200 × 1200 px artboard | 1:1 | SVG | Build as vector art and keep at least 10% clear space. |
| `ui_02_babbage_engine.webp` | Babbage engine panel | 1200 × 1000 px | 6:5 | Transparent WebP | Keep the full object visible and preserve transparent edges. |
| `ui_04_mo_river_otter.png` | Mo the river otter | 1200 × 1200 px | 1:1 | Transparent PNG | Center the character and allow 10% clear space for responsive cropping. |

## Destination and code map

| Planned filename | Exact destination | Code reference |
|---|---|---|
| `bg_01_app.png` | `assets/images/backgrounds/bg_01_app.png` | `ASSETS.images.backgrounds.app` |
| `bg_02_classroom.png` | `assets/images/backgrounds/bg_02_classroom.png` | `ASSETS.images.backgrounds.classroom` |
| `bg_s01_01_science_wing.jpg` | `assets/images/backgrounds/gfc/bg_s01_01_science_wing.jpg` | `ASSETS.images.backgrounds.scenarios[0]` |
| `pp_01_neutral.png` | `assets/images/characters/professor-pixel/pp_01_neutral.png` | `ASSETS.images.professorPixel.neutral` |
| `pp_02_thinking.png` | `assets/images/characters/professor-pixel/pp_02_thinking.png` | `ASSETS.images.professorPixel.thinking` |
| `pp_04_encouraging.png` | `assets/images/characters/professor-pixel/pp_04_encouraging.png` | `ASSETS.images.professorPixel.encouraging` |
| `pp_06_proud.png` | `assets/images/characters/professor-pixel/pp_06_proud.png` | `ASSETS.images.professorPixel.proud` |
| `maya_01_neutral.png` | `assets/images/characters/students/maya/maya_01_neutral.png` | `ASSETS.images.students.maya.neutral` |
| `maya_03_uncertain.png` | `assets/images/characters/students/maya/maya_03_uncertain.png` | `ASSETS.images.students.maya.uncertain` |
| `ui_01_babbage_mark.svg` | `assets/images/ui/ui_01_babbage_mark.svg` | asset manifest key `ui_01_babbage_mark.svg` |
| `ui_02_babbage_engine.webp` | `assets/images/ui/ui_02_babbage_engine.webp` | asset manifest key `ui_02_babbage_engine.webp` |
| `ui_04_mo_river_otter.png` | `assets/images/ui/ui_04_mo_river_otter.png` | `PC_S1_MO_ASSET` |

## Delivery checks

- Keep backgrounds free of text so the interface remains readable and editable.
- Export portraits and interface characters with clean transparent edges.
- Keep all expressions for one character aligned to the same canvas, baseline, and scale.
- Check every visual at phone, tablet, Nest Hub, and desktop widths before approval.
- Mark an item **Approved** only after its responsive framing and final filename are confirmed.
