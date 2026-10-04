# Patch 608: Canvas-style reading and editing practice

Apply over Patch 607. Contains changed files only. App V429, research V121, receiver
V94 and asset manifest v152 remain unchanged. No S3/S4 work or new research events.
S2 remains its heading-repair section preview.

## Reading experience

The reference is the user-provided Canvas recording and editor screenshots from
October 2, 2026. The recording shows spoken-word highlighting, passage focus and a
spaced reading layout. The recreation opens directly from S2 inspection, diagnosis,
review or verification, without an external service or recording.

The reading view replaces the previous inline demonstration panel. It shows only the
lesson page text, with an existing page title and the source or checked repaired sections.
Its controls include Back to page, speed (0.75–2.5×), text size, increased spacing,
passage focus, Play/Pause/Resume, Stop, Read page and heading navigation examples.
The speed preference starts at 1.25× and all preferences remain session-only.

Heading navigation remains distinct from Immersive Reader-style reading:

- Read page speaks the text without injected heading-level announcements.
- Headings before demonstrates the existing page title and missing section headings.
- Headings after demonstrates the title, three level-2 sections and level-3 subsection.

Native speech boundary events select the corresponding word using character offsets.
Reading uses short passages so voices without word timing can highlight the current
passage accurately. No estimated word timers are used. Speed changes restart from the
last tracked word or passage. Paused readings remain paused after a speed change.

The view is a keyboard-accessible modal. Background interaction is suspended, Tab stays
inside, Escape/Back restores focus to its launch button, and scrolling follows text
inside the reader only. Closing, leaving S2, rerendering the task or opening the main
menu stops speech and cleans up observers, background state and body scroll locks.
Audio errors or missing speech support leave the full text readable. Nothing autoplays.
The view is labeled practice modeled on Canvas, not a Microsoft product integration.

## Editor practice

The heading-style control uses Paragraph, Heading 2, Heading 3 and Heading 4, matching
the supplied Canvas menu. Select a section title to change its style. The other toolbar
labels show locations rather than introducing unrelated working controls.

The **</>** button sits below the visual editor with the word count. It opens the HTML
field and receives/restores focus appropriately when switching views. Insert repaired
HTML opens that field. User text is retained when changing views or reviewing the repair.

Visual rendering always reconstructs trusted lesson nodes. Complete repaired HTML must
pass the existing strict heading-repair validator. Partial heading-style edits are rebuilt
from canonical words and links. Untrusted pasted HTML never enters the DOM directly.
The existing three checks and save validation remain required.

## Ownership

- `s2-accessibility-reader.js`: teaching, reader templates, safe text extraction, timing,
  preferences, focus and speech lifecycle.
- `s2-accessibility-editor.js`: focused visual/HTML editor templates and heading actions.
- Existing S2 state, controller and workspace owners integrate these controls.
- Manifest and generated runtime include the new editor source.
- All new styling is scoped to S2 or the reader modal. S1 components remain unchanged.

## Verification

Local headless Chromium checks cover desktop, tablet and phone; reader/editor checks
also cover a short desktop viewport. Coverage includes correct lesson text, no autoplay,
word/passage timing, speed restart, pause/resume, heading examples, completion/error,
unavailable speech, keyboard focus restoration, modal/menu/scenario cleanup, heading
style changes, HTML toggle, unsafe pasted input and repaired visual rendering.

S1 full-loop regression and S2 repair/persistence/AI fixture checks are retained. Shared
presentation, build synchronization, structural, CSS and asset checks also run.

Speech fixtures verify event behavior; audible playback on physical devices and actual
assistive technology were not verified. This does not load Canvas, Microsoft Immersive
Reader, student data, new audio assets or external voice credentials.

Speech event background:
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisEvent
