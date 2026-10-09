# Patch 619: guided next-step planning

Apply over Browser Patch 618. PromptCraft V429, research schema V121, receiver V94, and asset manifest v157 remain current.

The S1 My Course feedback now asks three small questions instead of one broad reflection: identify an activity, choose a change or check, and describe the student work to look for. Each field includes plain-language guidance and an example. All three require 10–140 trimmed characters before saving, including direct submissions. Drafts survive feedback rerenders.

The responses combine into the existing transferReflection research field (under 500 characters). A local transferPlan object keeps the three parts distinct in the saved and printable guide. Earlier guides with a single reflection still display that reminder. No receiver or research-schema changes are required.

Ctrl + Alt + 1 fills the three responses on this screen. The learner then clicks Add to My Course Guide.

Validation: full S1 loop on desktop, tablet, and phone; focused next-step testing on desktop, short desktop, tablet, and phone, including real keyboard shortcut, reachable save button, guide persistence after reload, print visibility, and overflow/error checks. Build synchronization, structural validation, CSS audit, and asset audit passed. External AI responses were replaced by local fixtures during browser testing.
