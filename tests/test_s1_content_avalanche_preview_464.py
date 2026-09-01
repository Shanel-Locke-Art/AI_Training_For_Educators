#!/usr/bin/env python3
"""Static contract for the readable S1 Content Avalanche evidence station."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    registry = read("src/js/scenarios/registry.js")
    shared = read("src/js/scenarios/shared-components.js")
    scenario_runtime = read("src/js/app/scenario-runtime.js")
    dialogue = read("src/js/content/dialogue-data.js")
    runtime_dialogue = read("runtime/js/dialogue-data.js")
    css = read("src/css/scenarios/shared.css")
    config = read("src/js/app/config-and-assets.js")
    runtime_js = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    s1_start = registry.index("key: 'content-avalanche'")
    s2_start = registry.index("key: 'accessibility'")
    s1 = registry[s1_start:s2_start]

    assert "rendererKey: 'content-avalanche-preview'" in s1
    assert "developmentStatus: 'Preview available · In development'" in s1
    assert "implemented: false" in s1, "Preview must not be counted as completed gameplay."
    assert "previewAvailable: true" in s1
    assert "previewIntroduction: true" in s1
    assert "introCast: 'dual'" in s1
    assert "introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'eli', slot: 'left' }]" in s1
    assert "'content-avalanche-preview': () => renderS1ContentAvalanchePreview()" in registry
    assert "ui.previewAvailable || ui.rendererKey === 'content-avalanche-preview'" in scenario_runtime
    assert "if (previewAvailable)" in scenario_runtime
    assert "const introductionAvailable = implemented || Boolean(ui.previewIntroduction);" in scenario_runtime

    for token in (
        "function renderS1ContentAvalanchePreview(",
        "Development preview · Evidence station",
        "Your mission",
        "Find the learning path hidden inside the content.",
        "Reveal After",
        "Open full size ⛶",
        "s1-preview-select-case",
        "s1-preview-toggle-state",
        "s1-submit-case-reflection",
        "pcPrepareS1ClassroomDialogueScene",
        "pcPrepareS1CanvasDialogueScene",
        "pcRestoreS1CanvasDialogueScene",
        "pcRouteS1ReflectionToCasePage",
        "pcPlayS1PreviewBriefing",
        "instructor-before-module",
        "instructor-after-module",
        "student-before-module",
        "student-after-module",
        "instructor-before-comparison-assignment",
        "instructor-after-submit-assignment",
        "instructor-before-buried-directions",
        "instructor-after-start-here",
        "Exit preview",
    ):
        assert token in shared, f"missing S1 preview contract token: {token}"
        assert token in runtime_js, f"browser bundle missing S1 preview token: {token}"

    for selector in (
        ".pc-s1-preview",
        ".pc-s1-preview-hero",
        ".pc-s1-preview-task",
        ".pc-s1-case-tabs",
        ".pc-s1-evidence-station",
        ".pc-s1-state-switch",
        ".pc-s1-evidence-viewer",
        ".pc-s1-inspection-panel",
        ".pc-s1-dialogue-choice-list",
        ".pc-s1-dialogue-choice-btn",
        ".pc-vn-enter-slide-left",
        ".pc-s1-preview-next",
    ):
        assert selector in css, f"source CSS missing {selector}"
        assert selector in runtime_css, f"runtime CSS missing {selector}"

    for token in (
        '"scenarioStart_content-avalanche"',
        "s1_case_module_briefing",
        "s1_case_student_path_briefing",
        "s1_case_assignment_briefing",
        "s1_case_expectations_briefing",
        "s1_canvas_evidence_intro",
        "s1_case_module_explanation",
        "s1_case_module_ai_demo",
        "s1_case_module_reveal",
        "s1_case_student_path_explanation",
        "s1_case_student_path_ai_demo",
        "s1_case_student_path_reveal",
        "s1_case_assignment_explanation",
        "s1_case_assignment_ai_demo",
        "s1_case_assignment_reveal",
        "s1_case_expectations_explanation",
        "s1_case_expectations_ai_demo",
        "s1_case_expectations_reveal",
        "Before we open Canvas, here is the situation.",
        "This course does not lack content, expertise, or instructor effort.",
        "We are not judging the instructor",
        "Now let us open the actual Week 4 module.",
        "Eli will describe the learner experience",
        "PC_S1_PIXEL_ONLY_CAST",
        '"entrance": "slide-left"',
    ):
        assert token in dialogue, f"source dialogue missing {token}"
        assert token in runtime_dialogue, f"runtime dialogue missing {token}"

    assert "Why this matters" not in shared
    assert "pc-s1-canvas-smartboard-active" in css
    assert "pcS1CanvasDialogueMode" in shared
    assert "pcGetS1CanvasDialogueCast" in shared
    assert "sceneCast" in runtime_js
    assert "pcRestoreS1CanvasDialogueScene" in runtime_js
    assert "pcRenderS1IntroEvidenceCard(item, evidence, pcS1CanvasDialogueCaseIndex)" in shared
    assert "pc-s1-intro-evidence-active" in shared
    assert "smartboard: Object.freeze({" in config
    assert config.count("smartboardSrc:") == 8
    assert 'content: "Canvas focus · Before"' in css
    assert 'content: "Canvas focus · After"' in css
    assert "Choose the strongest repair. Pixel and Jordan will explain why." not in shared
    assert "panel.id = 'pcS1DialogueChoices'" not in shared
    assert "function pcRouteS1ReflectionToCasePage" in runtime_js
    assert "pcAnimateVNCharacterEntrance" in runtime_js
    assert "pc-s1-quick-check" not in shared
    assert "s1-preview-submit-diagnosis" not in shared
    assert 'data-pc-s1-canvas-state="after"' in css
    assert "pcPlayS1PreviewBriefing(0, onDone)" in scenario_runtime
    assert "typeof onDone === 'function'" in shared
    assert "s1-preview-play-briefing" not in shared
    assert "data-pc-cast-side=\"left\"" in css
    assert "data-pc-cast-side=\"right\"" in css
    assert "width: min(58vw, 1040px) !important" in css
    assert "aspect-ratio: 16 / 9.8 !important" in css
    assert ".vn-board-img.loaded" in css
    assert "object-fit: contain !important" in css
    assert "patch=524" in index
    assert "DEV · 524" in index
    assert "runtime/js/dialogue-data.js?v=149&amp;patch=524" in index
    print("S1 Content Avalanche edge-to-edge Canvas reader 482 contract passed.")


if __name__ == "__main__":
    main()
