#!/usr/bin/env python3
"""Static contract for the Canvas-oriented scenario roadmap introduced in patch 463."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def ui_object(registry: str, key: str) -> str:
    start = registry.index(f"key: '{key}'")
    next_key = registry.find("key: '", start + len(key) + 7)
    return registry[start: next_key if next_key >= 0 else registry.index("\n];", start)]


def main() -> None:
    state = read("src/js/app/runtime-state.js")
    registry = read("src/js/scenarios/registry.js")
    shared = read("src/js/scenarios/shared-components.js")
    terminal = read("src/js/ui/babbage-terminal.js")
    assessment = read("src/js/scenarios/s3-authentic-assessment.js")
    index = read("index.html")
    runtime = read("runtime/js/promptcraft.bundle.js")

    expected_indices = (
        "CONTENT_AVALANCHE: 0",
        "ACCESSIBILITY: 1",
        "METACOGNITION: 2",
        "ASSESSMENT: 3",
        "HALLUCINATION: 4",
        "PREDICTION: 5",
        "HUMAN_JUDGMENT: 6",
        "REFLECT_REVISE_REUSE: 7",
    )
    for token in expected_indices:
        assert token in state, f"missing scenario index: {token}"

    roadmap = (
        ("content-avalanche", "S1: The Content Avalanche", False),
        ("accessibility", "S2: Access Is Part of the Design", False),
        ("metacognition", "S3: The Confident Student Problem", True),
        ("assessment", "S4: The 96% Problem", True),
        ("hallucination", "S5: Hallucination Hunt", False),
        ("prediction", "S6: Predict the Output", False),
        ("human-judgment", "S7: The Human Judgment Line", False),
        ("reflect-revise-reuse", "S8: Reflect, Revise, Reuse", False),
    )
    for key, label, implemented in roadmap:
        block = ui_object(registry, key)
        assert f"dataLabel: '{label}'" in block
        assert f"tabLabel: '{label}'" in block
        assert f"implemented: {str(implemented).lower()}" in block
        assert label in index, f"static navigation is missing {label}"
        assert label in runtime, f"browser bundle is missing {label}"

    approved_copy = (
        "A Canvas module has plenty of content but no visible path.",
        "A polished Canvas course still creates barriers.",
        "A student is earning good grades but cannot explain what helped",
        "A high Canvas score may prove recall without proving transferable learning.",
        "An AI-generated course resource looks ready to publish in Canvas.",
        "A vague request can produce a polished but unusable Canvas item.",
        "Decide which course-design tasks AI can accelerate",
        "Apply what you have learned to a real Canvas item",
    )
    for fragment in approved_copy:
        assert fragment in registry, f"approved menu copy missing: {fragment}"

    assert "Scenario 1 has an unlocked Canvas evidence preview" in shared
    assert "Scenarios 3 and 4 are currently playable." in shared
    assert 'data-pc-scenario-index="2"' in shared
    assert "Play Scenario 3" in shared
    assert "scenarioIndex === SCENARIO_INDEX.METACOGNITION" in terminal
    assert "scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE" in terminal
    assert "scenario_index: 4" in assessment
    assert "scenario_label: 'S4: The 96% Problem'" in assessment
    assert "patch=523" in index

    retired = (
        "S1: Engagement",
        "S2: Metacognition",
        "S3: Assessment",
        "S4: Sync Bias",
        "S7: Overreliance",
        "S8: Reflect & Revise",
    )
    for label in retired:
        assert label not in registry
        assert label not in index
        assert label not in runtime

    print("Scenario menu roadmap 463 contract passed.")


if __name__ == "__main__":
    main()
