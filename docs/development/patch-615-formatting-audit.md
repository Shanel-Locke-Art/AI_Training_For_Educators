# Patch 615: Pixel framing and responsive formatting audit

Apply over Patch 614. Application V429, research schema V121, receiver V94 and asset manifest v156 remain unchanged.

Pixel's shared narrative portrait registration now uses the existing character-offset mechanism. Every expression moves down 24px on desktop, 18px on tablet and 12px on phone. This preserves the portrait size, cast placement and student framing. It applies when Pixel appears in either narrative cast slot. Small menu and audio-setup portraits retain their existing frames.

The visual audit found inherited black/green phone dialogue styling and a dark-green menu close button. S1/S2 story dialogue now consistently uses navy and sky-blue accents, with gold speaker names. The story override excludes Babbage terminal states. The menu close button uses navy and blue, including hover/focus. No lesson, scoring or scenario progression changes.

## Playwright coverage

- Desktop 1440x1000, tablet 820x1180 and phone 390x844: all six menu panels; keyboard navigation, panel scrolling, active state, scenario locks and About portrait.
- The full S1 production loop: exploration, renaming, keyboard organization, module rebuild, guide, diagnosis, personal course setup, feedback, saved guide, print action, completion, persistence and replay. Checks include navigation gates, stale AI results, page errors and horizontal overflow.
- The current S2 preview: narrative, page exploration, barrier identification, request, built-in repair, visual/HTML editor, invalid repair rejection, preview, verification, save, revisit and persistence. S1 saved work remains isolated. The preview does not award full S2 completion.
- S2 AI handoff uses simulated responses: copy feedback, retry, preserved request and late-response cancellation.
- Shared S1/S2 stage, Canvas, typography, quote and diagnosis presentation comparisons also pass at 1909x984, 820x1180 and 390x844.
- Desktop, short desktop 1424x736, tablet and phone: all six Pixel expressions in both introductions; downward displacement without resizing; dialogue text fit; palette; menu close keyboard interaction; reader speed, text size, word/passage highlighting, pause/resume, focus restoration and cleanup.
- Ideas Wall at the same four sizes: offline/fallback layout, filters, sort and refresh. Existing legacy scenario labels/sample mappings require a separate content review; this patch does not change those mappings.

Representative screenshots reviewed across menus, onboarding, stories, S1 stages/guides, S2 editor/repair checks and reader controls. Browser screenshots now wait for the S1 narrative fade to complete before capturing gameplay, avoiding misleading translucent overlays in the QA images.

All browser checks pass. Build synchronization, structural validation, CSS audit and asset audit pass. External requests are blocked during automated testing; AI and speech behavior use local fixtures. Live services and real assistive-technology compatibility are outside this formatting audit.

Only entries in patch-615-changed-files.txt are exported. S3 has not been implemented or redesigned.
