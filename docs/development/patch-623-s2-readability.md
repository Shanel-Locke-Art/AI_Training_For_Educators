# Patch 623: S2 readability and spacing

Apply over Patch 622. PromptCraft V429, research schema V121, Apps Script receiver V95, and asset manifest v157 remain unchanged.

The S2 heading lesson now has larger titles, darker labels and body text, consistent card padding, and aligned card content on desktop. Smaller screens retain natural heading wrapping and readable spacing.

The optional reading view has darker inactive text, tighter paragraph spacing, and a gentler extra-spacing option. Heading sizes follow the selected reading text size. Footer instructions and phone controls use larger text. Headings and Links buttons have shorter visible labels and descriptive accessible names. Phone settings use a two-column layout with all controls visible.

Playback actions, speech highlighting, transcripts, focus management, text-size preferences, and scenario behavior are retained. No S1 or S3 source changes or receiver update are included.

Verification: Playwright reader regression passed on desktop, short desktop, tablet, and phone, including playback, speed, pause/resume, error/fallback, focus restoration, long-link wrapping, and reachable controls. The complete S2 accessibility example loop and S1 isolation checks passed on desktop, tablet, and phone. Focused final layout checks found no horizontal overflow. Desktop and phone screenshots were reviewed. Build synchronization, structural validation, CSS audit, and asset audit passed. Speech tests use fixtures and do not verify audible voice output.
