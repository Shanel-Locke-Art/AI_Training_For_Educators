# Patch 543: runtime capture stability

Patch 543 stabilizes the browser screenshot setup exposed by the Windows Patch 542 run. It does not change the PromptCraft application or any scenario.

## Windows evidence

The Patch 542 run produced all 51 intended scenario images. Desktop and phone captures showed the new overview and centered-checkpoint framing correctly. The tablet run encountered one onboarding timing failure, leaving the name dialog over its 17 screenshots. The runtime report correctly recorded `tablet: Enter key did not advance name onboarding`.

Patch 542 documentation also counted the expanded inventory incorrectly as 45. The correct total is 51: 17 images each for desktop, tablet, and phone.

## Change

- Wait up to three seconds for the audio setup overlay after the Enter-key name submission.
- Wait for the audio overlay to close before scenario testing begins.
- Preserve an explicit regression failure when Enter does not advance onboarding.
- Clear onboarding through the normal application function after a failure so later screenshots remain useful diagnostic evidence.
- Correct the documented capture total to 51.

## Preservation boundary

No application JavaScript, CSS, gameplay, dialogue, tracking, AI request, accessibility behavior, receiver, spreadsheet, raw archive, image, or audio asset changed. `PROMPTCRAFT_V429`, schema `V121`, receiver `V83`, receiver candidate `V84`, Babbage proxy `V373`, and asset manifest `v149` remain unchanged.
