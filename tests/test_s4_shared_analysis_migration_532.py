#!/usr/bin/env python3
"""Patch 532 contract for displayed Scenario 4 analysis and print parity."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def function_block(source: str, name: str, next_name: str) -> str:
    start = source.index(f"function {name}")
    end = source.index(f"function {next_name}", start)
    return source[start:end]


def main() -> None:
    index = read("index.html")
    scenario = read("src/js/scenarios/s3-authentic-assessment.js")
    terminal = read("src/js/ui/babbage-terminal.js")
    bundle = read("runtime/js/promptcraft.bundle.js")
    transfer_test = read("tests/test_s3_transfer_lab.py")

    assert 'runtime/css/promptcraft.css?v=429&patch=543' in index
    assert 'promptcraft.bundle.js?v=429&amp;patch=543&amp;receiver=84' in index
    assert 'Version 429 · Patch 543' in index
    assert 'DEV · 543' in index

    for token in (
        "function pcS3BuildAssessmentSequence()",
        "function pcS3BuildEvidencePresentation(analysis = S3_LOCAL_BABBAGE_ANALYSIS)",
        "function pcS3BuildTransferPresentation(state, analysis)",
        "function pcS3BuildTransferSubmittedWork(state)",
        "title: 'Canvas Assessment Evidence Analysis'",
        "reportTitle: 'Canvas Assessment Evidence Analysis'",
        "reportTitle: 'Canvas Assessment Design Analysis'",
        "title: 'Canvas assessment evidence sequence'",
        "ariaLabel: 'Five-step Canvas assessment evidence sequence'",
        "label: 'MODULE CONTEXT'",
        "label: 'ASSIGNMENT'",
        "label: 'SUBMISSION'",
        "label: 'REASONING'",
        "label: 'RUBRIC'",
        "label: 'Alignment gap'",
        "label: 'Remaining limitation'",
        "pcS3BuildEvidencePresentation(analysis)",
        "pcS3BuildTransferPresentation(state, analysis)",
        "printLabel: 'Print / Save PDF'",
        "function pcPrintS3CaseAnalysis()",
        "function pcPrintS3TransferLabReport()",
        "return pcPrintCurrentBabbageReport();",
        "data-pc-action=\"s3-print-case-analysis\"",
        "'s3-print-case-analysis': () => pcPrintS3CaseAnalysis()",
        "Scenario 4 complete",
        "controlsTitle: 'Scenario 4 result'",
        ">Replay Scenario 4</button>",
    ):
        assert token in scenario, token

    # All fields from the retired custom print document remain represented in
    # the shared report input or findings.
    for label in (
        "Course / context:",
        "Learning outcome:",
        "Original assessment:",
        "Original success criteria:",
        "Evidence currently visible:",
        "Weakest link identified:",
        "Revised assessment design:",
        "Current evidence",
        "Authenticity opportunity",
        "Why the revision is stronger",
    ):
        assert label in scenario, label

    custom_printer = function_block(
        scenario,
        "pcPrintS3TransferLabReport()",
        "completeS3CaseAndStartTransfer()",
    )
    assert "window.open" not in custom_printer
    assert "document.write" not in custom_printer
    assert "<!doctype html>" not in custom_printer
    assert "buildS3TransferReportHTML" in custom_printer
    assert "pcPrintCurrentBabbageReport" in custom_printer

    assert "data-print-submitted-work" in terminal
    assert "report.dataset.printSubmittedWork" in terminal
    assert "function pcPrintCurrentBabbageReport()" in terminal

    # Legacy scenario and research identifiers stay unchanged.
    assert "analysis_type: 's3_evidence_analysis'" in scenario
    assert "analysis_type: 's3_transfer_assessment'" in scenario
    assert "SCENARIO_INDEX.ASSESSMENT" in scenario
    assert "s3_transfer_metadata_json" in read("src/js/research/tracking.js")
    assert "function pcPrintS3TransferLabReport()" in transfer_test
    assert scenario.rstrip() in bundle
    assert terminal.rstrip() in bundle

    changed = read("release/patch532-changed-files.txt").splitlines()
    manifest = json.loads(read("release/patch532-manifest.json"))
    assert changed == sorted(changed)
    assert len(changed) == len(set(changed)) == manifest["patch_532"]["changed_file_count"]
    assert not any(path.startswith(("assets/", "apps-script/", "netlify/")) for path in changed)
    assert "src/css/ui/completed-analysis.css" not in changed
    assert "runtime/css/promptcraft.css" not in changed
    assert all((ROOT / path).is_file() for path in changed)

    checksums = {}
    for line in read("release/patch532-checksums.sha256").splitlines():
        expected, relative = line.split("  ", 1)
        checksums[relative] = expected
    assert set(checksums) == set(changed) - {"release/patch532-checksums.sha256"}
    assert all(
        len(expected) == 64 and all(character in "0123456789abcdef" for character in expected)
        for expected in checksums.values()
    )

    print("Patch 532 displayed Scenario 4 shared-analysis and print-parity contract passed.")


if __name__ == "__main__":
    main()
