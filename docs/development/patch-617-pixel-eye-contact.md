# Patch 617: Pixel eye contact

Apply over Patch 616. Application V429, research schema V121 and receiver V94 remain unchanged. Asset manifest advances to v157.

Five of Pixel's learner-facing expressions now use revised transparent v4 portraits with direct camera eye contact: neutral, thinking, excited, encouraging and proud. The existing skeptical v3 already faces the learner and remains in use. The audio setup, shared small portraits and opening narrative references also use the revised neutral portrait.

A new listening-left portrait turns Pixel's head and eyes toward the student. The shared cast renderer selects it when Maya or Lena speaks and Pixel occupies the right cast slot. Pixel returns to the requested learner-facing expression when she resumes speaking. Phone scenes retain their existing speaker-only presentation. The lower story placement from Patch 615 and the audio-dialog placement from Patch 616 are preserved.

Previous portrait assets remain as development references. All six new PNGs preserve their transparent backgrounds. Exact built-in image-editing prompts are recorded in the portrait-folder README. These are AI-edited portraits, so fine details can vary from the earlier assets.

Validation: synchronized build, structural validation, asset classification audit and CSS audit. Playwright checks cover six expressions in both stories, listening selection and return to learner gaze, onboarding, portrait placement, dialogue fit, palette, menu close interaction and horizontal overflow at desktop 1440x1000, short desktop 1424x736, tablet 820x1180 and phone 390x844. The full S1 loop and S2 heading repair preview also pass on desktop, tablet and phone. Representative story screenshots reviewed. External services are blocked and AI behavior uses fixtures in browser tests.

Only entries in patch-617-changed-files.txt are exported. This patch does not implement S3.
