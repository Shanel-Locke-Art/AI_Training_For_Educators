#!/usr/bin/env python3
"""V517 contract: complete evidence scrolling and granular S1 feedback XP."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    progress = read("src/js/app/scenario-runtime.js")
    state = read("src/js/app/runtime-state.js")
    css = read("src/css/scenarios/shared.css")
    index = read("index.html")

    modal = shared[shared.index("function pcRefreshS1EvidenceModalLayout()"):
                   shared.index("let pcS1EvidenceModalResizeFrame")]
    assert "const usePhoneLayout = width <= 560" in modal
    assert ": evidence.src;" in modal
    assert "useCompactLayout" not in modal
    assert "scrollbar-gutter:stable both-edges" in css
    assert "height:auto !important" in css
    assert "max-height:none !important" in css

    for token in ("s1PracticeScores", "s1TransferScore"):
        assert token in state
        assert token in progress
    for token in (
        "function awardS1PracticeXP",
        "function awardS1TransferXP",
        "function pcGetLevelProgressSnapshot",
        "Math.round((s1RawScore / 17) * 50)",
    ):
        assert token in progress

    for token in (
        "function pcBuildS1PixelProgressFeedback",
        "awardS1PracticeXP(caseIndex, score)",
        "awardS1TransferXP(transferScore)",
        'data-pc-action="s1-complete-week-plan"',
        "function pcCompleteS1WeekPlan()",
        "Your pathway gives students a visible destination",
    ):
        assert token in shared

    assert "Your Level bar is now" not in shared
    assert "You earned ${" not in shared

    assert "patch=522" in index
    assert "DEV · 522" in index
    print("V517 scrollable evidence and Pixel progress feedback contract passed.")


if __name__ == "__main__":
    main()
