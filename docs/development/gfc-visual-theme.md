# Great Falls College / PromptCraft visual theme

PromptCraft remains the same game. The GFC visual work changes presentation, campus atmosphere, branding, and readability without replacing the approved S1/S2 gameplay loop or shared architecture.

## Current visual direction

The shared application uses a Great Falls College-inspired system built around:

- deep navy / dark blue structural surfaces
- brighter blue interactive surfaces
- cream / warm off-white content areas
- gold as an accent for focus, progress, selected state, and institutional detail
- light blue for secondary emphasis and readable borders

The Babbage CRT analysis display intentionally remains green-on-dark as a distinct fictional machine interface. The physical workstation and surrounding controls follow the PromptCraft/GFC theme.

## Campus environments

Current shared scenario background registry:

- S1 Engagement: `assets/images/backgrounds/gfc/s1-science-wing.jpg`
- S2 Metacognition: `assets/images/backgrounds/gfc/s2-study-lounge.jpg`
- fallback classroom: `assets/images/backgrounds/classroom.png`

Scenario room selection is owned by `ASSETS.images.backgrounds.scenarios` in `src/js/app/config-and-assets.js`. New scenarios should register backgrounds there rather than add character- or scenario-specific CSS positioning.

## Brand and Babbage assets

Current brand/interface assets include:

- `assets/images/ui/babbage-mark.svg`
- `assets/images/ui/charles-babbage.png`
- `assets/images/ui/babbage-engine.webp`
- `assets/images/brand/great-falls-college-logo.jpg`
- `assets/ui/promptcraft-qr.png`

`babbage-engine-plate.svg` is retained as a development/reference asset rather than the active Meet Babbage presentation.

The Meet Babbage page uses Charles Babbage imagery and simplified explanatory copy. The Babbage engine is also used in the teaching-progression panel where the historical machine has enough visual context to make sense.

## Header and teaching progress

The application header now includes an education-based teaching progression HUD. The approved direction is intentionally restrained:

- PromptCraft branding has stronger visual presence
- one UI typeface for the Teaching Progress component
- a small number of consistent text tiers
- current education level as the primary label
- XP shown as progress within the current level
- thicker dimensional progress bar
- expanded progress panel for details rather than cramming all information into the header

## Buttons

Primary buttons use blue/navy surfaces and readable light-blue borders at rest. Gold is used for interaction emphasis such as focus, hover, selected state, and deliberate highlights. Do not restore permanent thick yellow/gold outlines around every action.

## Ideas Wall

The Ideas Wall retains its approved content structure and moderation behavior while using the current PromptCraft/GFC page treatment. Its stylesheet remains standalone at `src/css/pages/ideas-wall.css`. Header/navigation behavior should match the main PromptCraft brand-menu pattern where appropriate without coupling wall data logic to the main runtime.

## Printable Babbage report

Print/Save PDF is document-first, not a printed imitation of the CRT monitor. The printable report uses a clean PromptCraft/GFC report hierarchy with readable sections, restrained navy/blue/gold styling, and an institutional logo treatment.

## Versioning

This remains a `PROMPTCRAFT_V429` application. Visual/cache revisions may change independently. The verified source baseline is receiver V83 / schema V121.
