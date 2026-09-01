#!/usr/bin/env python3
"""V515 contract: framed intro evidence, visible mission art, purpose prompts."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "function pcRenderS1IntroEvidenceCard",
        "pc-s1-intro-evidence-card",
        "CASE ${Number(caseIndex) + 1} · ${evidence.state.toUpperCase()} CANVAS EVIDENCE",
        "evidence.mobileSrc",
        "evidence.compactSrc",
        "Describe what each part of the path should do.",
        "For each header, explain its purpose for students.",
        "How will this section orient students to the week, the goal, and what they will accomplish?",
        "Let students rehearse with a discussion, knowledge check, worked example, or draft.",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        "/* V515 - the case introduction now uses the same framed evidence language",
        ".pc-s1-intro-evidence-card",
        ".pc-s1-intro-evidence-picture img",
        "opacity: 1 !important",
        "pc-s1-intro-evidence-active.pc-dual-character",
    ):
        assert token in css
        assert token in runtime_css

    assert "patch=524" in index
    assert "DEV · 524" in index
    print("V515 framed introduction evidence and purpose-focused transfer task passed.")


if __name__ == "__main__":
    main()
