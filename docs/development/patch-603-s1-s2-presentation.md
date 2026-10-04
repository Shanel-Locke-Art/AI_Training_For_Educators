# Patch 603 — align S2 with S1 presentation

Apply over Patch 602. Application V429, research V121, receiver V94 and asset manifest v152 remain unchanged.

The supplied screenshots showed S2 with an all-caps task title, a solid background, a custom module row, and a tall page layout that pushed Lena out of view. S1 used title-case task titles, a photographic stage, standard Canvas module anatomy, and a fixed workspace with internal scrolling. Its dialogue colors also differed from S2.

Removed S2's independent geometry, title, background, portrait and responsive overrides. Its wrapper now uses S1's stage class and background variable. S2 retains its own location image and task content, while inheriting S1's header, frame, scroll behavior, character panel and responsive layout. The module uses the same toolbar, jump strip, module heading, page icon, row and status marker classes as S1. The noninteractive task heading retains screen-reader focus without a button-like focus outline.

Moved the opening dialogue palette into the shared college theme for S1 and S2. Both use navy, white, sky blue and gold; Babbage consult/terminal states are excluded and retain their CRT styling. S1 gameplay source, saved guide and research behavior are unchanged. Lena's existing portraits are still replaceable drafts.

Validation:
- Build synchronization and structural/asset/CSS checks.
- `tools/test_s1_s2_presentation.cjs` compares computed S1/S2 stage, title, header, workspace, Canvas frame, quote, portrait container and module styles on desktop, tablet and phone. It also checks that the portrait remains visible.
- Full S2 browser regression checks the narrative, repair, verification gates, nested scrolling/button interactions, reload, S1 guide preservation and S1 navigation at all three sizes.
- AI fixture regression checks onboarding, response handling, late replies and narrative replay. No hosted AI call or deployment is included.

Only added or changed files are exported.
