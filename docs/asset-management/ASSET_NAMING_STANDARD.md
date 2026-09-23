# PromptCraft asset naming standard

Use these names for every new production asset. The filename should identify the speaker or visual subject without relying on the folder name.

## Audio files

Pattern: `speaker_context_line.ext`

| Part | Use | Examples |
|---|---|---|
| Speaker | Who is speaking | `pp`, `maya`, `jordan`, `eli`, `samira`, `devon`, `lena` |
| Context | Scenario or shared audio group | `s01` through `s08`, `sys`, `fb`, `ref`, `end`, `music` |
| Line | Two digit sequence within that speaker and context | `01`, `02`, `03` |

Examples:

- `pp_s01_01.mp3` is Professor Pixel, Scenario 1, line 1.
- `maya_s01_01.mp3` is Maya, Scenario 1, line 1.
- `pp_fb_02.mp3` is Professor Pixel, shared feedback line 2.
- `music_01_background.mp3` is the first background music file.

Start each speaker at `01` in each scenario. Do not insert the script ID twice. The tracker connects the filename to the exact wording, scene, and source ID.

## Visual files

Pattern: `subject_sequence_description.ext`

| Asset | Pattern | Example |
|---|---|---|
| Character portrait | `character_sequence_expression` | `pp_01_neutral.png` |
| Scenario background | `bg_scenario_sequence_description` | `bg_s01_01_science_wing.jpg` |
| Shared background | `bg_sequence_description` | `bg_01_app.png` |
| Interface art | `ui_sequence_description` | `ui_01_babbage_mark.svg` |
| Scenario scene | `scenario_sequence_description` | `s02_01_scene.png` |
| Older retained art | `legacy_scenario_surface_sequence_description` | `legacy_s01_canvas_01_instructor_before_module.png` |
| Development reference | `subject_ref_sequence_description` | `maya_ref_01_concept_sheet.png` |

Use lowercase letters, numbers, and underscores. Keep a short description on visual files because the sequence number alone does not show which expression or screen the file contains.

## Production rules

1. Reserve the next sequence number in the appropriate tracker before exporting a new file.
2. Use one filename for one approved line or visual state.
3. Do not reuse an old filename when the wording or artwork changes substantially.
4. Update the physical file, asset manifest, code reference, and tracker in the same change.
5. Keep retired names in the tracker so they are not assigned again.
