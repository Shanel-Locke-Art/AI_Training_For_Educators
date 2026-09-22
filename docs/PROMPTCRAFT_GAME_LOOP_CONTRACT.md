# PromptCraft Game Loop Contract

Status: S1 rebuild contract. S2-S8 remain locked in normal play until this loop is proven end to end.

## Core loop
1. Visual-novel setup establishes a realistic Canvas problem.
2. The instructor inspects the student-facing Canvas experience.
3. The instructor makes one bounded design intervention.
4. Babbage gives concise task feedback based only on the work just completed.
5. PromptCraft shows the revised Canvas result.
6. The student character reacts from the learner perspective.
7. Guide Builder converts the completed design move into a private, printable course-guide section.
8. The instructor makes the next human judgment or diagnosis.
9. Babbage reviews that judgment without replacing it.
10. My Course applies the same design idea to a small amount of the instructor's own course information.
11. Babbage reviews only the My Course information explicitly supplied for that step.
12. Progress/XP updates reflect completed design work and guide-building milestones.
13. Ideas Wall sharing is optional and accepts generalized teaching ideas only, never private My Course text by default.

## Guide Builder contract
Every guide section uses a stable PromptCraft-owned template. AI may personalize bounded explanatory fields but may not invent the section structure or silently add course facts.

Each section should contain:
- why the practice matters;
- a visual representation of what the instructor built;
- personalized Babbage observations grounded in supplied work;
- practical implementation tips;
- plain-language course-design / OSCQR connections;
- a small set of responsible AI ideas to try;
- an explicit Add to My Guide / Revise First decision.

## Privacy lanes
- V121 Research: research-approved tracked events only.
- My Course: private/local-first course content unless the instructor explicitly chooses another action.
- Course Guide: private instructor-facing artifact assembled from completed PromptCraft work.
- Ideas Wall: explicit, generalized contribution only. Do not copy My Course text automatically.
- Challenge score: anonymous numeric progression only; no identifying or free-text course information.

## Scenario lock
S2-S8 remain disabled in normal navigation while S1 establishes this contract. DEV tools may still unlock them for preservation and regression testing.
