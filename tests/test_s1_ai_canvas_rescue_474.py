#!/usr/bin/env python3
"""Static contract for S1 case feedback and its superseding transfer task."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    dialogue = read("src/js/content/dialogue-data.js")
    css = read("src/css/scenarios/shared.css")
    registry = read("src/js/scenarios/registry.js")
    runtime_js = read("runtime/js/promptcraft.bundle.js")
    runtime_dialogue = read("runtime/js/dialogue-data.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")
    babbage = read("src/js/ai/babbage-client.js")
    proxy = read("netlify/functions/babbage.js")

    for token in (
        "PC_S1_RESCUE_BRIEF_SECTIONS",
        "PC_S1_RESCUE_PROPOSALS",
        "pcShowS1ReflectionAnalysis",
        "pcRenderS1CanvasRescue",
        "pcGenerateS1RescueDraft",
        "pcRenderS1RescueDraftReview",
        "pcUpdateS1RescueProposalState",
        "pcCompleteS1RescueReview",
        "pcHandleS1PreviewNext",
        "Design Your Week →",
        "Send brief to Babbage →",
        "Run student-view test →",
        "AI can inventory, extract, reorganize, compare, and draft.",
        "s1-rescue-select-brief",
        "s1-rescue-generate-draft",
        "s1-rescue-review-proposal",
        "s1-rescue-complete-review",
    ):
        assert token in shared, f"source S1 rescue missing: {token}"
        assert token in runtime_js, f"runtime S1 rescue missing: {token}"

    assert shared.count("aiDemoKey:") == 4
    assert shared.count("summary: 'AI") == 4
    assert "pcS1PreviewChecks.every(check => check.answered)" in shared
    assert "simulated" not in shared.lower(), "The player-facing interface should not claim a hidden simulation."
    assert "requestBabbageAnalysis({" in shared
    assert "analysis_type: 's1_canvas_rescue'" in shared
    assert "context === 's1-canvas-rescue'" in babbage
    assert "S1_CANVAS_RESCUE_SCHEMA" in proxy
    assert "promptcraft_s1_canvas_rescue_v1" in proxy
    assert "PROMPTCRAFT_BABBAGE_PROXY_VERSION = 'V373'" in proxy

    for token in (
        "s1_case_module_ai_demo",
        "s1_case_student_path_ai_demo",
        "s1_case_assignment_ai_demo",
        "s1_case_expectations_ai_demo",
        "s1_canvas_rescue_complete",
        "extract the requirements, cite where each one appears, and do not invent missing criteria",
        "AI accelerated the inventory, extraction, and first draft",
    ):
        assert token in dialogue, f"source S1 AI dialogue missing: {token}"
        assert token in runtime_dialogue, f"runtime S1 AI dialogue missing: {token}"

    for selector in (
        ".pc-s1-ai-workspace",
        ".pc-s1-ai-workspace-content",
        ".pc-s1-ai-workspace-review-card",
        ".pc-s1-case-handoff",
        ".pc-s1-rescue",
        ".pc-s1-rescue-brief-grid",
        ".pc-s1-rescue-loading",
        ".pc-s1-rescue-proposal",
        ".pc-s1-rescue-result-list",
        ".pc-s1-rescue-principle",
    ):
        assert selector in css, f"source CSS missing {selector}"
        assert selector in runtime_css, f"runtime CSS missing {selector}"

    s1_start = registry.index("key: 'content-avalanche'")
    s2_start = registry.index("key: 'accessibility'")
    s1 = registry[s1_start:s2_start]
    assert "implemented: false" in s1, "Keep S1 out of persistent completion until the development mission is accepted."
    assert "previewAvailable: true" in s1

    patch_match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", index)
    assert patch_match, "Could not find promptcraft.css patch marker in index.html"
    patch = patch_match.group(1)
    assert f"patch={patch}" in index
    assert f"DEV · {patch}" in index
    assert f"dialogue-data.js?v=149&amp;patch={patch}" in index
    print("S1 AI assistance contract and superseding week-planner route passed.")


if __name__ == "__main__":
    main()
