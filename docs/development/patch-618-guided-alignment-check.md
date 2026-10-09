# Patch 618: Guided S1 alignment comparison

Apply over Patch 617. Application V429, research schema V121, receiver V94 and asset manifest v157 remain unchanged.

The previous step asked for a broad explanation after selecting the alignment problem. It now walks the teacher through three small decisions:

1. Name the action Maya needs to demonstrate, using the instructor's goal beside the field.
2. Name what Quiz 3 checks, using the current-module description beside the field.
3. Compare those observations and choose the main problem.

Both short observations are visible before a choice is made. Maya's on-screen quote is shorter and concrete, keeping it readable in the phone quote panel. The opening explanation states why the comparison matters. The evidence-gap option uses concrete course language. The action is labeled Compare with feedback, and the result shows both observations alongside the existing feedback. No model attempts to grade the wording of these short observations; the existing selected-choice feedback and scoring remain in place.

Both entries and a selected choice are required, with the same minimum short-response length applied to each entry. Submission also checks the requirement directly. Changing a choice updates its pressed state in place, preserving the teacher's notes, focus and scroll position. Review preserves the two observations and selected problem. Repeated review does not award duplicate XP.

The two observations are combined into the existing diagnosisRationale string with Learning goal and Current work labels. No new research fields or events are introduced. Existing consent, de-identification and record handling remain in place. Local scenario state gains two draft fields; no saved-course data migration is needed.

Validation: full S1 flow at desktop 1440x1000, tablet 820x1180 and phone 390x844, including incomplete-input gates, programmatic submission guard, keyboard choice, preserved notes/focus, feedback, guide, completion and replay. Shared S1/S2 presentation comparisons pass at desktop 1909x984, tablet and phone. Focused checks at 1440x1000, short desktop 1424x736, tablet and phone cover scrolling to the comparison button, incorrect-choice feedback, review persistence, duplicate-XP prevention and no page errors/overflow. Screenshots of the guided inputs, decision and feedback reviewed. Build synchronization, structural validation, CSS audit and asset audit pass. External services are blocked and AI requests use fixtures.

Only entries in patch-618-changed-files.txt are exported. S2 lesson content and S3 are unchanged.
