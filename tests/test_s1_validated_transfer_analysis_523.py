#!/usr/bin/env python3
"""V523 contract: emulated-screen Read Size defaults and usable zoom guidance."""

import json
from pathlib import Path
import subprocess


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
        "Object.freeze([853, 1280])",
        "Object.freeze([912, 1368])",
        "Object.freeze([1024, 1366])",
        "Object.freeze([820, 1180])",
        "Object.freeze([768, 1024])",
        "[window.screen?.width, window.screen?.height]",
        "Choose Read size to zoom in, then scroll to inspect the Canvas screen.",
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

    default_zoom = shared[shared.index("const PC_S1_READ_SIZE_VIEWPORTS"):
                          shared.index("function pcCloseS1EvidenceModal")]
    assert "min-width" not in default_zoom
    assert "max-width" not in default_zoom
    assert "min-height" not in default_zoom

    js_probe = f"""
const window = {{ screen: {{ width: 0, height: 0 }}, innerWidth: 700, innerHeight: 900 }};
const document = {{ documentElement: {{ clientWidth: 700, clientHeight: 900 }} }};
{default_zoom}
const profiles = [[853,1280],[912,1368],[1024,1366],[820,1180],[768,1024]];
const results = profiles.map(([width,height]) => {{
  window.screen.width = width;
  window.screen.height = height;
  return pcGetS1EvidenceDefaultZoom();
}});
window.screen.width = 900;
window.screen.height = 1200;
results.push(pcGetS1EvidenceDefaultZoom());
process.stdout.write(JSON.stringify(results));
"""
    result = subprocess.run(
        ["node", "-e", js_probe], check=True, capture_output=True, text=True
    )
    assert json.loads(result.stdout) == ["read", "read", "read", "read", "read", "fit"]

    assert "patch=523" in index
    assert "DEV · 523" in index
    print("V523 emulated-screen Read Size and zoom-guidance contract passed.")


if __name__ == "__main__":
    main()
