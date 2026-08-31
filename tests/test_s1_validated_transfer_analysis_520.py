#!/usr/bin/env python3
"""V520 contract: reliable board imagery, device defaults, and transfer analysis."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    responsive = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "const useReadDefault = window.matchMedia(",
        "(min-width: 740px) and (max-width: 1050px) and (min-height: 1000px) and (orientation: portrait)",
        "pcSetS1EvidenceModalZoom(useReadDefault ? 'read' : 'fit'",
        "function pcPrepareS1MissionBoardImage(caseIndex = pcS1PreviewCaseIndex, state = 'before')",
        "pcPrepareS1MissionBoardImage(caseIndex, 'after')",
        "--pc-s1-mission-board-image",
        "function pcShowS1WeekPlanLoading",
        "function pcRunS1WeekPlanAnalysis",
        "BABBAGE TRANSFER ANALYSIS BOOT",
        "function pcNormalizeS1WeekPlanAnalysis",
        "function pcBuildS1WeekPlanCriteria",
        "function pcRenderS1WeekPlanAnalysis",
        "Module Path Analysis",
        "LEARNING PATH SIGNALS · ${score} OF 5 VISIBLE",
        "LIVE + LOCAL VALIDATION",
        "Never return only a status or an empty next step.",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        "opacity: .84 !important",
        "object-fit: contain !important",
        "object-position: center !important",
        "var(--pc-s1-mission-board-image",
    ):
        assert token in responsive
        assert token in runtime_css

    assert "patch=520" in index
    assert "DEV · 520" in index
    print("V520 reliable board, device defaults, and transfer analysis contract passed.")


if __name__ == "__main__":
    main()
