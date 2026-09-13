#!/usr/bin/env python3
"""Patch 536 contract for Scenario 1 visual alignment without gameplay drift."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
S1 = (ROOT / "src/js/scenarios/s1-canvas-evidence.js").read_text(encoding="utf-8")
CSS = (ROOT / "src/css/scenarios/shared.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")


def main() -> None:
    # S1 now uses the same briefing and stage vocabulary as playable S3/S4.
    assert "buildScenarioMissionHTML(SCENARIO_INDEX.CONTENT_AVALANCHE" in S1
    assert "buildScenarioProgressHTML({" in S1
    assert 'class="pc-s1-preview pc-scenario-stage"' in S1
    assert "pc-s1-preview-mission" in S1

    # The S1 evidence mechanic remains scenario-specific and intact.
    for marker in (
        'aria-label="Content Avalanche case files"',
        'data-pc-action="s1-open-evidence-modal"',
        'data-pc-action="s1-preview-toggle-state"',
        'id="pcS1CaseReflectionText"',
        'data-pc-action="s1-submit-case-reflection"',
    ):
        assert marker in S1

    # The old one-off hero/task presentation is no longer emitted.
    assert '<header class="pc-s1-preview-hero">' not in S1
    assert '<div class="pc-s1-preview-task"' not in S1

    # S1 stage geometry inherits the shared workbench measurements.
    assert ".pc-s1-preview.pc-scenario-stage" in CSS
    assert "Version 429 · Patch 538" in INDEX
    assert "DEV · 538" in INDEX

    print("PASS: Patch 536 S1 shared visual shell")


if __name__ == "__main__":
    main()
