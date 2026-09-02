#!/usr/bin/env python3
"""V505 contract: S2-staged S1 dialogue and row-based spoken analysis."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    registry = read("src/js/scenarios/registry.js")
    runtime_app = read("src/js/app/scenario-runtime.js")
    tts = read("src/js/audio/babbage-tts.js")
    css = read("src/css/scenarios/shared.css") + read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    assert "introCast: 'dual'" in registry
    assert "introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'eli', slot: 'left' }]" in registry
    assert "pcPlayS1PreviewBriefing(0, onDone);" in runtime_app
    assert "playPixelSequence('s1_canvas_evidence_intro'" not in runtime_app

    for token in (
        "const queueCanvasDiscussion = () =>",
        "challengeBoard.textContent = item.beforeCue;",
        "pcPrepareS1CanvasDialogueScene(normalized, 'before');",
        "queueLine(lines[0], queueCanvasDiscussion);",
        "overlay?.classList.remove('pc-s1-mobile-evidence-reader', 'pc-s1-mission-board-image');",
        "Framed Canvas evidence with Professor Pixel and Eli dialogue",
        "id=\"babbageTTSBtn\"",
        "data-pc-action=\"toggle-babbage-tts\"",
    ):
        assert token in shared
        assert token in runtime

    assert "← Revise response" not in shared
    assert "#pcS1ReflectionAnalysis .pc-s1-reflection-analysis-content" in tts
    assert "#pcS1ReflectionAnalysis .pc-s1-reflection-analysis-content" in runtime

    for token in (
        ".pc-s1-reflection-analysis--terminal .pc-s1-reflection-feedback ol",
        "grid-template-columns:minmax(0,1fr) !important;",
        ".pc-s1-reflection-analysis--terminal .pc-s1-reflection-tts",
        ".pc-s1-intro-evidence-card",
        ".pc-s1-intro-evidence-picture img",
    ):
        assert token in css
        assert token in runtime_css

    assert "patch=527" in index
    assert "DEV · 527" in index
    print("V505 S2-staged Canvas dialogue and analysis-row contract passed.")


if __name__ == "__main__":
    main()
