# Patch 622: reading-view visual consistency

Apply over Patch 621. PromptCraft V429, schema V121, receiver V95, and asset manifest v157 remain unchanged.

The optional S2 reading view now uses the existing PromptCraft mark, navy-and-gold header, Fraunces display headings, Nunito body/control text, and a white reading panel on a sky-blue background. Play/Pause/Resume uses the shared production primary-button styling. Secondary buttons use consistent rounded borders, padding, weight, and focus states. The footer organizes existing controls into Listen, Headings, and Links groups. Active examples use a navy fill and gold border, including a readable hover state.

Reading speed, text size, extra spacing, passage focus, speech highlighting, transcripts, keyboard focus management, and playback behavior are retained. All controls remain visible with no disclosure menus. The footer adapts to two columns on phones, with playback spanning both. No S1 or S3 source changes and no receiver update are included.

Verification: Playwright reader/editor regression on desktop, short desktop, tablet, and phone, including real rendered font families, branding, three control groups, selected-state colors, reading-area height, long-link wrapping, reachable buttons, speed, pause/resume, focus restoration, error/fallback, and menu/scenario cleanup. Final desktop and phone screenshots reviewed. Build synchronization, structural validation, CSS audit, and asset audit passed. Browser speech tests use fixtures and do not verify audible voice output.
