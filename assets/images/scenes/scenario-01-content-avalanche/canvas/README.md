# Scenario 1 Canvas evidence

These screenshots come from the self-contained `PromptCraft_Content_Avalanche_Canvas_Sandbox.imscc` test course. They are runtime evidence assets for the planned Scenario 1 Content Avalanche redesign.

The PNG files preserve the native Canvas viewport and text scale. Metadata was stripped and filenames were normalized; no screenshot was enlarged, cropped, annotated, or visually altered in a way that could misrepresent the interface.

The `*-mobile-wide.png` and `*-mobile-phone.png` files are direct captures of the real Canvas responsive instructor and student module views. Compact S1 dialogue uses these captures instead of reconstructing the interface in HTML. The phone source is selected through a responsive `<picture>` element below 480 CSS pixels; the wider mobile capture is used for compact tablets and short desktop test viewports.

## Evidence pairs

| Perspective | Before | After | Instructional comparison |
|---|---|---|---|
| Instructor module | `instructor-before-module.png` | `instructor-after-module.png` | Flat content list versus a visible learning path |
| Student module | `student-before-module.png` | `student-after-module.png` | What the learner can infer before opening anything |
| Assignment | `instructor-before-comparison-assignment.png` | `instructor-after-submit-assignment.png` | Vague directions versus complete task and criteria |
| Opening page | `instructor-before-week-4-notes.png` | `instructor-after-start-here.png` | Dense notes versus purpose, sequence, workload, and outcome |

## Supporting evidence

- `instructor-before-buried-directions.png` reveals where the missing assignment requirements were actually placed.
- `instructor-after-read-page.png` shows purpose, time estimate, direct resources, evidence capture, and a next step.
- `student-before-comparison-assignment.png` is the strongest learner-centered problem image: the submission box appears without the requirements needed to complete it.
- `student-after-start-here.png` shows the information a learner receives before beginning the redesigned module.

Runtime paths, structured metadata, and accessible alternative text are owned by `src/js/app/config-and-assets.js` through `PC_S1_CANVAS_EVIDENCE`.
