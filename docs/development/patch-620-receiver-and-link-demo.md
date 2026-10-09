# Patch 620: received responses and link listening examples

Apply over Patch 619. PromptCraft V429, research schema V121, and asset manifest v157 remain current. Receiver source advances to V95. Deploy it separately using `receiver-v95-deployment.md`.

The receiver derives five readable S1 columns from already collected guided-response strings. Original columns and raw records are preserved. No new payload fields or receiver schema changes are required.

S2's optional reading view adds Links: long address and Links: clear label. A fictional long address is read aloud as visible link text, then compared with Download the community survey results (PDF). The second example includes a plain-language AI request to change the label and keep the destination exactly the same. This comparison is separate from the heading-repair activity, whose wording and link validation remain unchanged. No S3 work is included.

Browser speech illustrates the experience; it is not a real screen reader or Microsoft Immersive Reader integration. Voice pronunciation and punctuation vary. Playback is always initiated by the learner. Existing pause, stop, speed, focus, highlighting, fallback, and cleanup behavior applies to both new modes. Long text wraps at every supported text size.

Teaching reference: WCAG 2.1, SC 2.4.4, Link Purpose (In Context), https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html. Clear labels help learners identify link purpose; a long URL alone does not establish whether the surrounding context meets the criterion.

Validation: real V95 view builder tests and syntax check; S2 reader/editor Playwright tests on desktop, short desktop, tablet, and phone; full S1 gameplay regression on desktop, tablet, and phone; source/runtime synchronization, structural validation, CSS audit, and asset audit. Browser audio tests use speech fixtures and verify submitted text and control behavior, not audible voice output. Live Apps Script deployment was not performed.
