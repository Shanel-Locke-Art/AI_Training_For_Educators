#!/usr/bin/env python3
"""V504 contract: shared case intros and direct terminal continuation."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "const continueLabel = isFinalCase",
        "Continue to Design Your Week →",
        "Continue to case ${state.caseIndex + 2} →",
        "return pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true });",
        "return pcRenderS1WeekPlanner();",
        "Match S2's sequence: introduce the case on the ordinary classroom stage",
        "pcPrepareS1ClassroomDialogueScene();",
    ):
        assert token in shared
        assert token in runtime

    complete = shared[shared.index("function pcCompleteS1AfterReflection"):
                      shared.index("function pcRestoreS1CanvasDialogueScene")]
    assert "pcRenderS1PreviewEvidence();" not in complete
    assert "Return to case file →" not in shared

    for token in (
        ".pc-s1-evidence-modal-shell > header {",
        "position:relative;",
        "position:absolute;",
        "right:clamp(12px,2vw,22px);",
        "padding:10px 62px 10px 12px;",
    ):
        assert token in css
        assert token in runtime_css

    assert "patch=522" in index
    assert "DEV · 522" in index
    print("V504 shared case-introduction and terminal-continuation contract passed.")


if __name__ == "__main__":
    main()
