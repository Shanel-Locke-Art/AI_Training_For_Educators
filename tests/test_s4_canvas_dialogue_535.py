#!/usr/bin/env python3
"""Patch 535 contract for displayed Scenario 4 Canvas dialogue and evidence."""

import json
from pathlib import Path
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def workbook_text(relative: str) -> str:
    with ZipFile(ROOT / relative) as archive:
        return "\n".join(
            archive.read(name).decode("utf-8", "ignore")
            for name in archive.namelist()
            if name.endswith(".xml")
        )


def main() -> None:
    dialogue = read("src/js/content/dialogue-data.js")
    scenario = read("src/js/scenarios/s3-authentic-assessment.js")
    index = read("index.html")

    for marker in (
        "earned 96% on the Week 4 Canvas quiz",
        "opened the Canvas Assignment",
        "The gradebook shows 96%",
        "map what the Canvas quiz makes visible",
        "design the assignment, submission, and rubric",
        "The Canvas Assignment now gives me a county brief",
        "A Canvas task can look authentic",
        "Canvas shell changed, but the assessment claim did not",
        "give that Canvas evidence to Babbage",
        "One strong Canvas submission still does not prove",
        "Adding the changed constraint to the Canvas Assignment",
        "The gradebook summarizes performance",
    ):
        assert marker in dialogue, marker

    for line_id in (
        "p-s3-01", "p-s3-02", "p-s3-03", "p-s3-04",
        "maya-s3-01", "maya-s3-02", "maya-s3-03", "maya-s3-04",
        "p-s3-05", "p-s3-06", "maya-s3-05", "maya-s3-06",
        "p-s3-07a", "p-s3-08a", "maya-s3-07a", "maya-s3-08a",
        "p-s3-07b", "p-s3-08b", "maya-s3-07b", "maya-s3-08b",
        "p-s3-07c", "p-s3-08c", "maya-s3-07c", "maya-s3-08c",
        "p-s3-09", "p-s3-10", "maya-s3-09", "maya-s3-10",
        "p-s3-11", "p-s3-12", "maya-s3-11", "maya-s3-12",
        "p-s3-13", "p-s3-14", "maya-s3-13", "maya-s3-14",
    ):
        assert dialogue.count(f'"id": "{line_id}"') == 1, line_id

    assessment_start = dialogue.index('"scenarioStart_assessment"')
    assessment_end = dialogue.index('"s2_diagnosis_correct"', assessment_start)
    assert "click the" not in dialogue[assessment_start:assessment_end].lower()

    for marker in (
        "title: 'Canvas Student Evidence'",
        "resultLabel: 'Canvas quiz result'",
        "resultNote: 'Week 4 gradebook'",
        "aria-label=\"Scenario 4 learning outcome and current Canvas assessment\"",
    ):
        assert marker in scenario, marker

    assert "analysis_type: 's3_evidence_analysis'" in scenario
    assert "analysis_type: 's3_transfer_assessment'" in scenario
    assert "scenario_label: 'S4: The 96% Problem'" in scenario
    assert "Version 429 · Patch 544" in index
    assert "DEV · 544" in index

    tracker = workbook_text("docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx")
    for marker in (
        "Dialogue draft through patch 535",
        "Scenario 3 draft lines: 14",
        "Scenario 4 draft lines: 36",
        "S4: The 96% Problem",
        "Draft, Do Not Record",
        "maya-s3-14",
        "p-s3-14",
    ):
        assert marker in tracker, marker

    changed = read("release/patch535-changed-files.txt").splitlines()
    manifest = json.loads(read("release/patch535-manifest.json"))
    checksum_paths = {
        line.split("  ", 1)[1]
        for line in read("release/patch535-checksums.sha256").splitlines()
    }
    assert changed == sorted(changed)
    assert len(changed) == len(set(changed)) == manifest["patch_535"]["changed_file_count"]
    assert checksum_paths == set(changed) - {"release/patch535-checksums.sha256"}
    assert not any(path.startswith(("assets/", "apps-script/", "netlify/")) for path in changed)
    assert "runtime/css/promptcraft.css" not in changed
    assert all((ROOT / path).is_file() for path in changed)

    print("PASS: Patch 535 Scenario 4 Canvas dialogue draft")


if __name__ == "__main__":
    main()
