# Patch 607: S2 headings and listening demonstration

Apply the changed-file update over Patch 606. App V429, research V121, receiver V94,
and assets v152 are unchanged. S2 remains a heading-repair section preview.

## Learner experience

The inspection page explains that headings name sections and provide structure, while
bold or enlarged paragraphs change only appearance. It explains that screen readers
provide speech or braille, can read text in order, and can navigate real headings.
Page title / section / subsection levels are explained without requiring HTML knowledge.
The decision screen provides a shorter reminder before its choices.

The optional “Hear how headings help” panel is available during inspection, diagnosis,
repair review, and verification. Three user-initiated examples cover:

- Before: heading navigation finds the existing Canvas page title, then no more headings.
- After: the page title, three main sections, and the submission subsection are announced
  with their heading levels.
- Original page: every paragraph remains readable, including the fake heading text.

Each example has a visible transcript. A Stop control, audio completion/error feedback,
and unavailable-speech fallback are included. Nothing autoplays. Collapse, task changes,
menu opening, and scenario replacement cancel playback and disconnect its observer.
This uses browser speech synthesis, with no external audio service or new recordings.
It is explicitly labeled a simulation; screen reader speech and controls differ.

## Presentation

S2 choices form one consistent column. Empty feedback occupies no space. Navigation
uses a white sticky footer within the decision card, with adjusted question spacing.
The duplicate comparison boxes are removed from this screen to keep teaching and choices
readable. Existing S1 typography, choice components, palette, Canvas and student layouts
remain the basis. All new style changes are scoped to S2.

## Ownership and validation

`src/js/scenarios/s2-accessibility-reader.js` owns teaching templates, demonstration
transcripts and speech lifecycle. The workspace inserts its components and the controller
registers its actions. The JS manifest and generated browser bundle include the owner.

Verified locally in Chromium:

- S1 full gameplay and completion on desktop, tablet and phone, including canonical
  screen comparison, keyboard actions, guide persistence and duplicate-XP protection.
- S2 heading repair loop, validation, saved-repair persistence and S1 isolation at all
  three viewport sizes; fixture AI response, retry and stale-response handling.
- Listening UI on desktop, short desktop, tablet and phone: keyboard activation,
  before/after/full-text transcripts, no autoplay, stop/end/error/unavailable states,
  collapse/menu/scenario cancellation, footer bounds and horizontal overflow.
- Shared presentation checks retain Canvas, typography, choice and student comparisons.
  Diagnosis card padding/display are excluded from equality because S2 intentionally
  adds teaching content and a sticky footer; those behaviors have dedicated UI checks.
- Source/runtime synchronization, structural validation and CSS audit.

Speech calls and callbacks were tested with browser fixtures. Audible output on physical
devices, actual assistive technology, hosted AI and deployed research tracking were not
verified. The transcript remains available independently of speech support.

Authoritative background: https://www.w3.org/WAI/tutorials/page-structure/headings/
and https://www.w3.org/WAI/WCAG21/Techniques/html/H42 .
