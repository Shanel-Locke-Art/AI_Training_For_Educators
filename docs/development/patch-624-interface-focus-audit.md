# Patch 624: a clearer place to look and act

Apply over Patch 623. PromptCraft V429, research schema V121, receiver V95, and asset manifest v157 remain unchanged. Only changed files are exported.

## Review approach

Reviewed the current playable game at desktop, short desktop, tablet, and phone sizes using browser screenshots and keyboard/button interaction. The guiding question was: can a faculty member see what to do, where to respond, and what happens next? The review followed the Hiring Training Course discussion about stronger hierarchy, fewer nested boxes, and full-width work areas on smaller screens.

## Findings and changes

| Screen or area | Finding | Result |
| --- | --- | --- |
| Main menu home | Four equally large action boxes, QR card, and a large notice competed with Start. | Start remains primary. Ideas Wall and My Course Guide use lighter utility styling. QR and data notice stay visible with quieter framing. |
| Scenario selection | Available and locked scenario states were understandable. | Kept launch controls and scenario locks. S3 and later scenarios were not implemented. |
| How to Play | Every explanation was another enclosing card. | Used simple section dividers with the same headings and text. |
| About, Meet Babbage, Research and Privacy | Separate panels gave the content a clear destination. | Reviewed scrolling, keyboard navigation, footer fit, and portrait size. Kept content and controls. |
| Name and audio setup | One input or one choice group with a clear next action. | Retained the focused dialog layouts. |
| S1 and S2 narrative introductions | Student and Pixel dialogue anchored the story. | Kept scene artwork, portraits, dialogue, and expression placement. |
| Shared gameplay header | Leaderboard, level, progress bar, and labels competed with the current task. | Kept level and earned XP visible in a smaller header. The existing progress panel retains detailed information. |
| Shared activity stage | Classroom artwork showed through banners, panels, and gaps. Gold-bordered student quotes competed with the main work. | Used quiet sky-blue activity surfaces, opaque navy task headers, and calmer student panels. Narrative scenes retain artwork. |
| S1 module exploration and five item pages | Canvas context is useful to the exercise. | Kept the Canvas representation and all item navigation. Reduced the surrounding visual competition. |
| S1 rename and renamed module | The editable title needed stronger separation from supporting text. | Shared editable-field treatment makes the input clear. The student panel follows the work on phones. |
| S1 activity organization and revised module | Trays and destinations need visible structure for interaction. | Retained functional group boundaries, labels, and keyboard placement. Simplified surrounding chrome. |
| S1 diagnosis | Nested boxes and repeated explanation obscured the two response areas. | Removed enclosing response cards, shortened the repeated introduction, and strengthened field borders. Numbered decisions and evidence remain. |
| S1 diagnosis feedback | Feedback and next action were already distinct. | Retained the feedback and actions within the quieter shared stage. |
| S1 My Course: module, learning, activities | The phone layout placed the supporting summary before the form. | Form comes first; summary follows. Inputs are visibly editable. Research wording now says study record rather than schema version. |
| S1 Babbage feedback and next-step fields | The long feedback page did not visibly point to the area requiring responses. | Added a visible Fill in your next step jump button with keyboard focus at the form. Flattened the three response panels and reduced decorative navigation. |
| S1 guide preview, saved guide, empty guide | Existing section headings and guide navigation provided useful structure. | Reviewed rendering, scrolling, guide isolation, save/reload, print invocation, and clear behavior. Print-specific rules are unaffected by screen-only focus styling. |
| S2 module and learning page | Extra card outlines competed with the course material. | Retained the page and heading explanation with fewer nested backgrounds and borders. |
| S2 diagnosis | Reading support and the decision need to remain available. | Kept both visible. Calmer framing makes the choices easier to locate. |
| S2 AI request | Original HTML looked editable and appeared before Ask Babbage. | Primary action sits directly beneath the request. Attached HTML follows, explicitly labeled as an already-attached reference. Read-only fields have a different background. |
| S2 Babbage report | The short report inherited very small terminal text. | Larger S2 report text. The shared desktop report layout now gives a single handoff button enough width for its full label. CRT green remains inside the in-world display. |
| S2 repair comparison | Before/after structure is central to the learning. | Retained comparison, copy, and continue actions with quieter surrounding sections. |
| S2 Canvas editor | Working controls must be distinguishable from the displayed Canvas context. | Retained heading styles, HTML toggle, insert, safe preview, and explanatory practice text. |
| S2 verification and repair completion | Checkboxes need to stand out from reference material. | Gave the three check rows clear click areas while flattening reference sections. Saved repair, practice again, and menu actions remain. |
| Optional reading view | Patch 623 already separated content and grouped controls. | Retained it and checked playback, settings, focus restoration, fallback, and cleanup. |
| Ideas Wall | Large statistics dominated the phone screen. Cards repeated the title and opening paragraph inside another panel. Some content was clipped behind an expansion button. | Compact statistics, one rendering of each idea, larger body text, full visible content, and consistent blue labels. S1/S2 filters now name Course Design and Accessibility. Historical samples and other scenario content remain unchanged. |

On tablet and phone, activity content now flows naturally rather than scrolling inside a fixed-height stage. Desktop keeps the bounded Canvas workspace where appropriate. Supporting student panels move after form/decision work on phones. No instructional disclosures were added.

## Validation

- Full S1 flow on desktop, tablet, and phone: exploration, renaming, keyboard organization, required answers, feedback, saved guide, print invocation, clear, completion/reload, replay, duplicate XP protection, and S2 isolation.
- Full S2 example repair flow on desktop, tablet, and phone: diagnosis, editor, invalid output, checks, saved repair, reload, and S1 isolation.
- Shared presentation comparison: S1/S2 typography, task headers, Canvas controls, and choice controls. Natural content height is intentionally allowed to differ on smaller screens.
- Focus checks at desktop, short desktop, tablet, and phone: first My Course field visible, summary follows the form, S2 request begins in the initial viewport, Ask Babbage precedes reference HTML, read-only styling differs, next-step jump scrolls and focuses the form, report text is readable and remains reachable by scrolling inside the display at short heights, and handoff buttons stay in view.
- All six menu panels: keyboard access, scrolling, locks, portrait size, and viewport fit.
- Onboarding and narrative framing: both stories, all six Pixel expressions, listening pose, and dialogue text fit.
- Optional reader/editor regression: speed, pause/resume, focus restoration, end/error/fallback, safe editor preview, and cleanup.
- Simulated live S2 request: report handoff, copy feedback, invalid-response retry, preserved request, late-response cancellation, and replay.
- Ideas Wall: sample fallback, filtering, sorting, footer access, and no horizontal overflow.
- Build synchronization, structural validation, CSS audit, and asset audit.

Browser tests block external services and use AI/speech fixtures. They do not verify hosted service availability or audible voice quality. This visual review does not replace faculty usability testing. No research payload, receiver, completion rules, or S3 implementation changes are included.
