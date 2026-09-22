# Scenario 1 legacy artwork review

These Canvas captures belong to the earlier **Content Avalanche** S1 route. They are still listed as runtime images in asset manifest v150, but the current **Start With the Learning** route does not reference the `canvasContentAvalanche` registry. Keep them out of the current S1 artwork production queue until dormant routes, tests, and migration needs are reviewed.

Base folder: `assets/images/scenes/scenario-01-content-avalanche/canvas/`

## Canvas captures registered in the manifest

| Group | Files | Current decision |
|---|---|---|
| Instructor module | `instructor-before-module.png`; `instructor-before-module-mobile-wide.png`; `instructor-before-module-mobile-phone.png`; `instructor-after-module.png` | Legacy review |
| Instructor pages | `instructor-before-week-4-notes.png`; `instructor-before-comparison-assignment.png`; `instructor-before-buried-directions.png`; `instructor-after-start-here.png`; `instructor-after-submit-assignment.png`; `instructor-after-read-page.png` | Legacy review |
| Student module | `student-before-module.png`; `student-before-module-mobile-wide.png`; `student-before-module-mobile-phone.png`; `student-after-module.png` | Legacy review |
| Student pages | `student-before-comparison-assignment.png`; `student-after-start-here.png` | Legacy review |
| Smartboard focus | `smartboard/instructor-before-module-focus.png`; `smartboard/instructor-after-module-focus.png`; `smartboard/student-before-module-focus.png`; `smartboard/student-after-module-focus.png`; `smartboard/instructor-before-comparison-assignment-safe-focus.png`; `smartboard/instructor-after-submit-assignment-focus.png`; `smartboard/instructor-before-buried-directions-focus.png`; `smartboard/instructor-after-start-here-focus.png` | Legacy review |

The folder also contains `README.md` and a separate `smartboard/instructor-before-comparison-assignment-focus.png` development reference. Those are not current S1 production artwork.

`assets/images/scenes/scenario-01-engagement/scene.png` is another registered older S1 scene image. The current S1 learning screens use `assets/images/backgrounds/gfc/s1-science-wing.jpg` instead.

Do not relabel these files as archived or delete them solely from this list. The asset manifest currently registers them. A later cleanup should check dormant source modules, tests, and release history before changing their lifecycle status.
