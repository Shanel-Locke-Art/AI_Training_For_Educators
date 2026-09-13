#!/usr/bin/env python3
"""Patch 530 contract for the optional shared analysis presentation model."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    index = read("index.html")
    terminal = read("src/js/ui/babbage-terminal.js")
    css = read("src/css/ui/completed-analysis.css")
    bundle = read("runtime/js/promptcraft.bundle.js")
    css_bundle = read("runtime/css/promptcraft.css")
    s2 = read("src/js/scenarios/s2-metacognition.js")
    s3 = read("src/js/scenarios/s3-authentic-assessment.js")

    assert 'runtime/css/promptcraft.css?v=429&patch=534' in index
    assert 'promptcraft.bundle.js?v=429&amp;patch=534&amp;receiver=84' in index
    assert 'Version 429 · Patch 534' in index
    assert 'DEV · 534' in index

    for token in (
        "function pcNormalizeBabbageFindingItems(items = [])",
        "function pcBuildBabbageFindingHTML(value, items = [], statusLabel = 'PASS')",
        "function pcBuildBabbageProcessExampleHTML(example = null)",
        "function buildBabbageAnalysisHTML(feedback, mock = false, mockReason = '', presentation = {})",
        "const workedItems = pcNormalizeBabbageFindingItems(presentation?.workedItems)",
        "const issueItems = pcNormalizeBabbageFindingItems(presentation?.issueItems)",
        "pcBuildBabbageFindingHTML(d.worked, workedItems, 'PASS')",
        "pcBuildBabbageFindingHTML(d.issue, issueItems, 'CHECK')",
        "pcBuildBabbageProcessExampleHTML(presentation?.processExample)",
        'class="analysis-finding-list"',
        'class="analysis-finding-row"',
        'class="analysis-finding-status"',
        'class="analysis-process-example"',
        'class="analysis-process-grid"',
        'role="list"',
        'role="listitem"',
        "presentation?.title || 'Scenario Diagnostic'",
        "presentation?.reportTitle || 'Babbage Analysis Report'",
        "presentation?.inputTitle || 'Repair brief submitted'",
    ):
        assert token in terminal, token

    for token in (
        ".analysis-finding-list",
        ".analysis-finding-row",
        ".analysis-finding-status",
        ".analysis-process-example",
        ".analysis-process-grid",
        "grid-template-columns: repeat(auto-fit, minmax(126px, 1fr))",
        "overflow-wrap: anywhere",
    ):
        assert token in css, token

    # Printing must read optional structure from the rendered shared report so
    # screen and PDF cannot silently drift apart during later scenario migrations.
    for token in (
        "const renderedFindingItems = selector =>",
        "whatWorkedItems = renderedFindingItems('.analysis-worked-card')",
        "issueItems = renderedFindingItems('.analysis-issue-card')",
        "const renderedProcessExample = report?.querySelector('.analysis-process-example')",
        "pc-print-path-grid",
    ):
        assert token in terminal, token

    # The legacy three-argument contract remains active even after later
    # scenarios opt into the optional presentation argument.
    assert "pcS2BuildRepairReviewPresentation(review)" in s2
    assert "pcS3BuildEvidencePresentation(analysis)" in s3
    assert "pcS3BuildTransferPresentation(state, analysis)" in s3

    assert terminal.rstrip() in bundle
    assert css.rstrip() in css_bundle

    changed = read("release/patch530-changed-files.txt").splitlines()
    manifest = json.loads(read("release/patch530-manifest.json"))
    assert changed == sorted(changed)
    assert len(changed) == len(set(changed)) == manifest["patch_530"]["changed_file_count"]
    assert not any(path.startswith("assets/") for path in changed)
    assert all((ROOT / path).is_file() for path in changed)

    checksums = {}
    for line in read("release/patch530-checksums.sha256").splitlines():
        expected, relative = line.split("  ", 1)
        checksums[relative] = expected
    assert set(checksums) == set(changed) - {"release/patch530-checksums.sha256"}
    assert all(
        len(expected) == 64 and all(character in "0123456789abcdef" for character in expected)
        for expected in checksums.values()
    )

    print("Patch 530 shared analysis presentation contract passed.")


if __name__ == "__main__":
    main()
