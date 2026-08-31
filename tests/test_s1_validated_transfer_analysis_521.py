#!/usr/bin/env python3
"""V521 contract: replay reset, pictured intros, readable evidence, and stable handoffs."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    responsive = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    scenario_runtime = read("src/js/app/scenario-runtime.js")
    index = read("index.html")

    for token in (
        "function pcGetS1EvidenceDefaultZoom()",
        "(min-width: 740px) and (max-width: 1050px) and (min-height: 1000px) and (orientation: portrait)",
        "pcSetS1EvidenceModalZoom(pcGetS1EvidenceDefaultZoom()",
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
        'width: 1400px !important',
        'min-width: 1400px !important',
    ):
        assert token in responsive
        assert token in runtime_css

    for token in (
        "function pcResetScenarioTeachingProgress",
        "pcResetScenarioTeachingProgress(normalized)",
        "pcPrepareS1MissionBoardImage(0, 'before')",
        "progress.s1PracticeScores = Array(4).fill(0)",
    ):
        assert token in scenario_runtime
        assert token in runtime

    intro_done = scenario_runtime[scenario_runtime.index("const onDone = () => {"):
                                  scenario_runtime.index("if (window.scenarioIntroTimer)")]
    assert intro_done.index("pcResetVNCharacters();") < intro_done.index("overlay?.classList.remove('scenario-intro-active')")

    route = shared[shared.index("function pcRouteS1ReflectionToCasePage"):
                   shared.index("function pcPlayS1PreviewBriefing")]
    assert route.index("pcResetVNCharacters();") < route.index("document.body.classList.remove(")

    assert "patch=521" in index
    assert "DEV · 521" in index
    print("V521 replay, pictured intro, Read Size, and stable handoff contract passed.")


if __name__ == "__main__":
    main()
