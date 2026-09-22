# PromptCraft asset system

## Current baseline

- Application: `PROMPTCRAFT_V429`
- Browser patch: `574`
- Asset manifest: `v150`
- Research schema: `V121`
- Receiver source: `V85`

This document is the current operating guide for visual, audio, reference, and production documentation assets. Historical release notes preserve the baseline that existed when each release was created and should not be rewritten as current guidance.

## Sources of truth

| Information | Source |
|---|---|
| Asset role and lifecycle | `assets/asset-manifest.json` |
| Runtime asset paths | `src/js/app/config-and-assets.js` and the manifest |
| Actual files | `assets/` filesystem |
| Visual production status | `PromptCraft_Visual_Asset_Tracker_Simplified.xlsx` |
| Audio and recording status | `PromptCraft_Voice_Recording_Tracker.xlsx` |
| Project summary and open work | `PromptCraft_Production_Overview_Simplified.xlsx` |

## Asset lifecycle

Every file must have one explicit role:

1. **Runtime** — currently available to the application.
2. **Planned** — reserved for a specific future implementation.
3. **Reference** — concept or source material that must not be mistaken for production art.
4. **Archived** — retained only for history or migration evidence.
5. **Remove** — approved for deletion in a separate reviewed change.

A file that exists without one of these roles is an open classification problem. Do not create more files to work around it.

## Naming and folders

- Use lowercase kebab case for new media filenames.
- Keep characters under `assets/images/characters/<role>/<character>/`.
- Keep concept sheets and source references inside a `references/` subfolder.
- Keep current scenario scenes under `assets/images/scenes/`.
- Keep voice files under `assets/audio/voice/<speaker>/<scenario>/`.
- Use one stable line ID and one audio file for each approved spoken line.
- Do not reuse a retired audio filename for new wording.

Legacy folders and internal scenario numbers may remain where code, saved data, or receiver compatibility depends on them. Document that relationship instead of silently renaming files.

## Current Scenario 1 boundary

Scenario 1 is **Start With the Learning**. Maya is the current student character. The older Content Avalanche Canvas screenshots and Eli recording material remain legacy or dormant evidence; they do not describe the current player flow. Any future cleanup must decide whether those files are still needed by dormant modules or historical tests before moving or deleting them.

## Update workflow

1. Add or change the file in the correct asset folder.
2. Assign its lifecycle role in `assets/asset-manifest.json`.
3. Update the runtime registry only when application code uses the file.
4. Refresh the visual, audio, and production trackers from the manifest and filesystem.
5. Run `python tools/audit_assets.py`.
6. Test the affected scenario at desktop, tablet, and phone widths.
7. Package only the changed files and their updated documentation.

## Recording workflow

Do not record from an old Word script. First export the current approved dialogue from application source into the voice tracker, confirm speaker and scenario numbering, and mark each row Approved to Record. The Word recording guides describe session procedure and performance expectations; the tracker owns the line queue.
