#!/usr/bin/env python3
"""V495 contract: complete named-device evidence and narrated next cases."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    dialogue = read("src/js/content/dialogue-data.js")
    responsive = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_dialogue = read("runtime/js/dialogue-data.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    assert "{ classroom = false }" in shared
    # V504 standardized every case briefing on the proven classroom cast.
    assert "pcPrepareS1ClassroomDialogueScene();" in shared
    assert "pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true })" in shared
    assert "return pcSelectS1PreviewCase(pcS1PreviewCaseIndex + 1)" not in shared

    for case_number in (2, 3, 4):
        assert f"Case file {case_number} of 4" in dialogue
        assert f"Case file {case_number} of 4" in runtime_dialogue

    targeted_profiles = responsive.split("/* V494", 1)[1]
    assert "width: 122vw !important" not in targeted_profiles
    assert "width: 112vw !important" not in targeted_profiles
    assert "width: 100vw !important" in targeted_profiles
    assert "min-width: 100vw !important" in targeted_profiles

    assert "pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true })" in runtime
    assert "width: 100vw !important" in runtime_css
    assert "patch=523" in index
    assert "DEV · 523" in index

    print("V495 complete evidence and narrated next-case contract passed.")


if __name__ == "__main__":
    main()
