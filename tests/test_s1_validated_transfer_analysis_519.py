#!/usr/bin/env python3
"""V519 contract: device defaults, pictured feedback, and validated transfer analysis."""

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
        "const useReadDefault = width >= 740 && width <= 1050 && height >= 1000 && height > width",
        "pcSetS1EvidenceModalZoom(useReadDefault ? 'read' : 'fit'",
        "function pcPrepareS1MissionBoardImage(caseIndex = pcS1PreviewCaseIndex, state = 'before')",
        "pcPrepareS1MissionBoardImage(caseIndex, 'after')",
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
    ):
        assert token in responsive
        assert token in runtime_css

    assert "patch=519" in index
    assert "DEV · 519" in index
    print("V519 validated transfer analysis and device defaults contract passed.")


if __name__ == "__main__":
    main()
