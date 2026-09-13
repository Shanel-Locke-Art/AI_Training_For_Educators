#!/usr/bin/env python3
"""Patch 534: displayed Scenario 3 dialogue is grounded in planned Canvas evidence."""

from pathlib import Path
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def workbook_text(relative: str) -> str:
    with ZipFile(ROOT / relative) as workbook:
        return "\n".join(
            workbook.read(name).decode("utf-8", errors="ignore")
            for name in workbook.namelist()
            if name.startswith("xl/") and name.endswith(".xml")
        )


def test_scenario_3_opening_uses_canvas_evidence_without_becoming_a_tutorial():
    dialogue = read("src/js/content/dialogue-data.js")

    for marker in (
        "finished the Week 4 Canvas module",
        "84% on the module quiz",
        "Canvas shows my score",
        "The next module opens Monday",
        "The module shows what Jordan opened and what he scored",
        "Inspect the Canvas path and find the missing link",
    ):
        assert marker in dialogue, marker

    for stable_id in ("p86", "p88", "p89", "p90", "p91", "p92", "p93", "jordan-s2-01", "jordan-s2-02", "jordan-s2-03"):
        assert f'"{stable_id}"' in dialogue

    assert "click the" not in dialogue[dialogue.index('"scenarioStart_metacognition"'):dialogue.index('"scenarioStart_assessment"')].lower()


def test_scenario_3_intervention_responses_match_the_canvas_choices():
    dialogue = read("src/js/content/dialogue-data.js")
    scenario = read("src/js/scenarios/s2-metacognition.js")

    expected = (
        "Canvas reflection",
        "module page three times",
        "Canvas grade went from 76% to 84%",
        "On the Canvas practice check",
    )
    for marker in expected:
        assert marker in dialogue, marker
        assert marker in scenario, f"fallback response is not synchronized: {marker}"

    for voice_id in (
        "jordan-s2-intervention-confidence",
        "jordan-s2-intervention-strategy",
        "jordan-s2-intervention-grade",
        "jordan-s2-intervention-evidence",
    ):
        assert voice_id in dialogue
        assert voice_id in scenario


def test_recording_tracker_marks_scenario_3_as_draft_only():
    tracker = workbook_text("docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx")
    for marker in (
        "Draft, Do Not Record",
        "Scenario 3 draft lines",
        "Scenario 3 dialogue draft through patch 534",
        "84% on the module quiz",
        "Canvas grade went from 76% to 84%",
    ):
        assert marker in tracker, marker


def test_patch_and_compatibility_ids_remain_separate():
    index = read("index.html")
    assert "Version 429 · Patch 538" in index
    assert "DEV · 538" in index
    assert "PROMPTCRAFT_V429" in read("README.md")
    assert "V121" in read("docs/README.md")
    assert "analysis_type: 's2_draft'" in read("src/js/scenarios/s2-metacognition.js")


if __name__ == "__main__":
    test_scenario_3_opening_uses_canvas_evidence_without_becoming_a_tutorial()
    test_scenario_3_intervention_responses_match_the_canvas_choices()
    test_recording_tracker_marks_scenario_3_as_draft_only()
    test_patch_and_compatibility_ids_remain_separate()
    print("PASS: Patch 534 Scenario 3 Canvas dialogue draft")
