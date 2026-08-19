# Great Falls College visual theme

PromptCraft remains the same game and retains its existing S1/S2 loop, VN geometry, workspace layouts, and Babbage terminal identity.

## Campus environments
- S1 Engagement: Great Falls College Science Wing (`assets/images/backgrounds/gfc/s1-science-wing.jpg`)
- S2 Metacognition: Great Falls College Study Lounge (`assets/images/backgrounds/gfc/s2-study-lounge.jpg`)

Scenario room selection is owned by the shared `ASSETS.images.backgrounds.scenarios` registry. New scenarios should add a background there rather than add scenario-specific CSS positioning.

## Visual system
The final cascade owner `src/css/ui/gfc-theme.css` maps PromptCraft's existing shared design tokens onto a Great Falls College-inspired navy / blue / sky / gold palette. It intentionally does not recolor the Babbage CRT terminal.

## Versioning
This is a V429 visual/theme pass. Cache/query revisions may change; the app build remains `PROMPTCRAFT_V429` and receiver compatibility remains V82 / schema V121.

## Transition continuity
The August 18 Babbage-to-VN transition-flash fix is included in this pass. A completed Babbage report now keeps the shared VN overlay active while the next Professor Pixel scene mounts, preventing the underlying/legacy interface from painting between states. `tests/test_transition_handoff.py` guards this behavior.
