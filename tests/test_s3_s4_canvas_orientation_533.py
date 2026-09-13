#!/usr/bin/env python3
"""Patch 533: displayed Scenarios 3 and 4 use Canvas as the teaching context."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def test_displayed_scenario_3_has_a_concrete_canvas_learning_loop():
    scenario = read("src/js/scenarios/s2-metacognition.js")
    required = (
        "Canvas location",
        "Week 4 Canvas module",
        "Canvas practice check",
        "Canvas reflection assignment",
        "Canvas module reflection sequence",
        "OPEN MODULE",
        "TRY THE CHECK",
        "USE FEEDBACK",
        "CHOOSE NEXT MOVE",
        "Canvas is the learning environment, not the subject of the activity",
        "Scenario 3 progress",
    )
    for marker in required:
        assert marker in scenario, f"Scenario 3 is missing Canvas context: {marker}"

    assert "scenarioStart_metacognition" in read("src/js/content/dialogue-data.js")


def test_displayed_scenario_4_maps_assessment_evidence_to_canvas_surfaces():
    scenario = read("src/js/scenarios/s3-authentic-assessment.js")
    required = (
        "Canvas location",
        "Week 4 Canvas module",
        "Canvas quiz",
        "Canvas Assignment",
        "Canvas submission",
        "Canvas rubric",
        "Canvas assessment evidence sequence",
        "MODULE CONTEXT",
        "ASSIGNMENT",
        "SUBMISSION",
        "REASONING",
        "RUBRIC",
        "Canvas is the delivery environment rather than the learning outcome",
        "Scenario 4 progress",
        "Canvas course or module context (optional)",
        "Current Canvas assessment",
    )
    for marker in required:
        assert marker in scenario, f"Scenario 4 is missing Canvas context: {marker}"

    assert "scenarioStart_assessment" in read("src/js/content/dialogue-data.js")


def test_canvas_reorientation_preserves_compatibility_contracts():
    index = read("index.html")
    scenario_3 = read("src/js/scenarios/s2-metacognition.js")
    scenario_4 = read("src/js/scenarios/s3-authentic-assessment.js")
    receiver = read("apps-script/PromptCraft_Receiver_V83_Readable_Prompt_Data.js")

    assert "Version 429 · Patch 538" in index
    assert "PROMPTCRAFT_V429" in read("README.md")
    assert "V121" in read("docs/README.md")
    assert "analysis_type: 's2_draft'" in scenario_3
    assert "analysis_type: 's2_review'" in scenario_3
    assert "analysis_type: 's3_evidence_analysis'" in scenario_4
    assert "analysis_type: 's3_transfer_assessment'" in scenario_4
    assert "scenario_label: 'S4: The 96% Problem'" in scenario_4
    assert "V83" in receiver


def test_patch_533_is_changed_files_only():
    changed = read("release/patch533-changed-files.txt").splitlines()
    manifest = json.loads(read("release/patch533-manifest.json"))
    checksum_paths = {
        line.split("  ", 1)[1]
        for line in read("release/patch533-checksums.sha256").splitlines()
    }

    assert changed == sorted(changed)
    assert len(changed) == len(set(changed)) == manifest["patch_533"]["changed_file_count"]
    assert checksum_paths == set(changed) - {"release/patch533-checksums.sha256"}
    assert not any(path.startswith(("assets/", "apps-script/", "netlify/", "docs/asset-management/")) for path in changed)
    assert "runtime/css/promptcraft.css" not in changed
    assert "src/js/content/dialogue-data.js" not in changed
    assert all((ROOT / path).is_file() for path in changed)


if __name__ == "__main__":
    test_displayed_scenario_3_has_a_concrete_canvas_learning_loop()
    test_displayed_scenario_4_maps_assessment_evidence_to_canvas_surfaces()
    test_canvas_reorientation_preserves_compatibility_contracts()
    test_patch_533_is_changed_files_only()
    print("PASS: Patch 533 Canvas orientation contracts")
