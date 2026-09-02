#!/usr/bin/env python3
"""V518 contract: saved XP resets and S1 evidence remains readable by viewport."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    runtime = read("src/js/app/scenario-runtime.js")
    dev = read("src/js/dev/development-tools.js")
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css")
    responsive = read("src/css/responsive/final-overrides.css")
    index = read("index.html")

    for token in (
        "function pcResetTeachingProgress()",
        "localStorage.removeItem(PC_PROGRESS_STORAGE_KEY)",
        "s1PracticeScores: Array(4).fill(0)",
        "s1TransferScore: 0",
        "scenarioCompleted = Array(SCENARIO_COUNT).fill(false)",
        "pcResetTeachingProgress();",
    ):
        assert token in runtime

    assert "function devResetProgress()" in dev
    assert 'data-pc-action="dev-reset-progress"' in index
    assert "Reset Run + XP" in index

    for token in (
        "function pcSetS1EvidenceModalZoom",
        "data-pc-evidence-zoom=\"read\"",
        "data-pc-evidence-zoom=\"fit\"",
        "Read size",
        "Fit image",
        "'s1-evidence-zoom'",
    ):
        assert token in shared

    for token in (
        'data-pc-evidence-zoom="read"',
        "min-width:1400px",
        'data-pc-evidence-zoom="fit"',
        ".pc-s1-evidence-modal-zoom",
    ):
        assert token in css

    for token in (
        "object-fit: cover",
        "width: min(38vw, 160px)",
        "width: min(88vw, 860px)",
    ):
        assert token in responsive

    assert "patch=527" in index
    assert "DEV · 527" in index
    print("V518 reset, introduction evidence, and modal readability contract passed.")


if __name__ == "__main__":
    main()
