# Patch 605 — S1 completion and saved menu status

Apply over V429 / Patch 604. Research V121, receiver V94, and assets v152 are unchanged.

S1's closing dialogue called completion, but the inherited `implemented: false`
setting caused the completion function to return early. That setting also guards
legacy prompt entry, so enabling it would reopen an unused interface.

S1 now opts into a separate `completionAvailable` registry capability. The final
Professor Pixel dialogue marks the scenario complete, awards the existing completion
XP once, and returns to a menu that shows Completed. The menu restores that status
on reload from the existing progress award, with no new storage key or research field.
Saving a guide alone does not count as completing the closing dialogue.

The completion message uses the scenario's label instead of the old message about
development shells. The legacy prompt interface remains disabled. S2 remains a preview;
this update adds no new S2 activities and changes no S3 configuration or gameplay.

Replay follows the existing policy: explicitly launching a fresh practice run clears
that run's completion award and scores. Reading a saved guide does not clear progress.

Verification uses `tools/test_s1_learning_loop.cjs` at desktop, tablet, and phone sizes:
full flow, no early completion, one completion award, repeated-call protection, saved
menu status after reload, guide preservation, replay reset, S2 preview guard, print/clear
controls, and late AI reply protection. Existing pre-refactor DOM/style comparisons
remain available for the 18 gameplay screens before closing. External services are
blocked and AI replies are fixtures; deployed AI and tracking are not exercised.

Run build synchronization and structural validation, plus the existing S2 flow,
AI request/retry, and presentation checks. The ZIP contains only files changed since
Patch 604; overwrite matching paths and add the new patch notes/manifest.

Results: the full S1 loop passed at all three viewports, including reload restoration,
duplicate-award prevention and S2 preview protection. S2 flow/AI tests, presentation
comparisons, build synchronization and structural validation also passed.
