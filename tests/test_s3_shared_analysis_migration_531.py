#!/usr/bin/env python3
"""Patch 531 contract for displayed Scenario 3's shared analysis migration."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    index = read("index.html")
    scenario = read("src/js/scenarios/s2-metacognition.js")
    terminal = read("src/js/ui/babbage-terminal.js")
    bundle = read("runtime/js/promptcraft.bundle.js")

    assert 'runtime/css/promptcraft.css?v=429&patch=543' in index
    assert 'promptcraft.bundle.js?v=429&amp;patch=543&amp;receiver=84' in index
    assert 'Version 429 · Patch 543' in index
    assert 'DEV · 543' in index

    for token in (
        "function pcS2BuildImprovementItems(review = {})",
        "function pcS2BuildRepairReviewPresentation(review = {})",
        "title: 'Canvas Reflection Repair Analysis'",
        "reportTitle: 'Canvas Reflection Activity Analysis'",
        "inputTitle: 'Repaired Canvas reflection submitted'",
        "workedItems: pcS2BuildImprovementItems(review)",
        "label: 'Remaining limitation'",
        "title: 'Canvas module reflection sequence'",
        "ariaLabel: 'Four-step Canvas module reflection sequence'",
        "label: 'OPEN MODULE'",
        "label: 'TRY THE CHECK'",
        "label: 'USE FEEDBACK'",
        "label: 'CHOOSE NEXT MOVE'",
        "pcS2BuildRepairReviewPresentation(review)",
        "...improvedItems.map(item => ({ label: item.label, value: item.detail }))",
        "function pcS2PrintFinalAnalysis()",
        "data-pc-action=\"s2-print-final-analysis\"",
        "'s2-print-final-analysis': () => pcS2PrintFinalAnalysis()",
        "Print / Save PDF",
        "Scenario 3 complete",
        "controlsTitle: 'Scenario 3 result'",
        ">Revise reflection</button>",
    ):
        assert token in scenario, token

    # The original terminal text remains available for TTS and fallback output.
    for heading in (
        "'WHAT WORKED'",
        "'ISSUE DETECTED'",
        "'RECOMMENDED REPAIR'",
        "'EXPECTED IMPACT'",
    ):
        assert heading in scenario

    # Legacy internal ownership is preserved for saved data and receiver mapping.
    assert "analysis_type: 's2_review'" in scenario
    assert "SCENARIO_INDEX.METACOGNITION" in scenario
    assert "data.s2ReviewSource" in scenario
    assert "s2_review: review" in scenario
    assert "src/js/scenarios/s2-metacognition.js" in bundle

    # Printing continues through the shared document-first implementation.
    assert "'print-babbage-report': () => pcPrintCurrentBabbageReport()" in terminal
    assert scenario.rstrip() in bundle

    changed = read("release/patch531-changed-files.txt").splitlines()
    manifest = json.loads(read("release/patch531-manifest.json"))
    assert changed == sorted(changed)
    assert len(changed) == len(set(changed)) == manifest["patch_531"]["changed_file_count"]
    assert not any(path.startswith(("assets/", "apps-script/", "netlify/")) for path in changed)
    assert "src/css/ui/completed-analysis.css" not in changed
    assert "runtime/css/promptcraft.css" not in changed
    assert all((ROOT / path).is_file() for path in changed)

    checksums = {}
    for line in read("release/patch531-checksums.sha256").splitlines():
        expected, relative = line.split("  ", 1)
        checksums[relative] = expected
    assert set(checksums) == set(changed) - {"release/patch531-checksums.sha256"}
    assert all(
        len(expected) == 64 and all(character in "0123456789abcdef" for character in expected)
        for expected in checksums.values()
    )

    print("Patch 531 displayed Scenario 3 shared-analysis migration contract passed.")


if __name__ == "__main__":
    main()
