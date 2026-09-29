# PromptCraft asset system

## Current baseline

- Application: `PROMPTCRAFT_V429`
- Browser patch: `598`
- Asset manifest: `v151`
- Research schema: `V121`
- Receiver source: `V94`

This document is the current operating guide for visual, audio, reference, and production documentation assets. Historical release notes preserve the baseline that existed when each release was created and should not be rewritten as current guidance.

## Sources of truth

| Information | Source |
|---|---|
| Asset role and lifecycle | `assets/asset-manifest.json` |
| Runtime asset paths | `src/js/app/config-and-assets.js` and the manifest |
| Actual files | `assets/` filesystem |
| Required S1 artwork, dimensions, and status | `PromptCraft_Visual_Asset_Tracker_Simplified.xlsx` |
| S1 approval, recording queue, and fixed branching text | `PromptCraft_Voice_Recording_Tracker.xlsx` |
| Production order and file guide | `PromptCraft_Production_Overview_Simplified.xlsx` |
| Filename patterns and codes | `ASSET_NAMING_STANDARD.md` |

## Asset lifecycle

Every file must have one explicit role:

1. **Planned** — named and specified, but not started.
2. **In progress** — production has begun but the file is not ready for review.
3. **Ready for review** — exported and awaiting production approval.
4. **Approved** — filename, quality, and responsive use are confirmed.

A file that exists without one of these roles is an open classification problem. Do not create more files to work around it.

## Naming and folders

- Follow `ASSET_NAMING_STANDARD.md` for every new audio or visual file.
- Use lowercase letters, numbers, and underscores in media filenames.
- Keep characters under `assets/images/characters/<role>/<character>/`.
- Keep concept sheets and source references inside a `references/` subfolder.
- Keep current scenario scenes under `assets/images/scenes/`.
- Keep voice files under `assets/audio/voice/<speaker>/<scenario>/`.
- Use one stable line ID and one audio file for each approved spoken line.
- Keep one approved filename tied to one exact spoken line.

Scenario 1 is **Start With the Learning**. Maya and Professor Pixel are the planned speakers. The production trackers contain only work required for the current route.

## Update workflow

1. Add or change the file in the correct asset folder.
2. Assign its lifecycle role in `assets/asset-manifest.json`.
3. Update the runtime registry only when application code uses the file.
4. Update the visual, audio, and production trackers when an item moves to a new production status.
5. Run `python tools/audit_assets.py`.
6. Test the affected scenario at desktop, tablet, and phone widths.
7. Package only the changed files and their updated documentation.

## Recording workflow

The active Word scripts cover Scenario 1 only: Professor Pixel and Maya. They
transcribe current application text and label spoken dialogue separately from
on-screen quotes. Review each spoken line against the current application,
confirm its file name in the voice tracker, and mark it Approved to Record before
recording. On-screen quotes need a separate voice decision. Conditional text
containing placeholders must be resolved into exact lines first. The tracker
owns the approved recording queue. Its S1 Choices & Feedback tab also preserves
the fixed choices, branch responses, validation messages, fallback feedback, and
dynamic templates that are not part of the spoken-line queue.

The S1 visual brief is `S1_ARTWORK_PLAN.md`. It lists every required visual with
its ideal dimensions, aspect ratio, export format, and responsive-production notes.
