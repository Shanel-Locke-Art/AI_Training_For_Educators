#!/usr/bin/env python3
"""Patch 529 contract for scannable findings and a visual module-path example."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    index = read("index.html")
    terminal = read("src/js/ui/babbage-terminal.js")
    bundle = read("runtime/js/promptcraft.bundle.js")

    assert 'runtime/css/promptcraft.css?v=429&patch=544' in index
    assert 'promptcraft.bundle.js?v=429&amp;patch=544&amp;receiver=84' in index
    assert 'Version 429 · Patch 544' in index
    assert 'DEV · 544' in index

    for token in (
        "const criterionItems = selector =>",
        "whatWorkedItems = criterionItems('.pc-s1-reflection-feedback li.is-met')",
        "issueItems = criterionItems('.pc-s1-reflection-feedback li.is-missing')",
        "pc-print-finding-list",
        "pc-print-finding-row",
        "pc-print-finding-status",
        "Suggested Canvas module layout",
        "pc-print-path-grid",
        "START HERE",
        "Overview + first action",
        "LEARN",
        "Readings + media",
        "PRACTICE",
        "Worked example + low-stakes check",
        "SUBMIT",
        "Task + criteria + submission location",
        "CONTINUE",
        "Feedback + reflection + next step",
        "aria-label=\"Suggested Canvas module sequence\"",
    ):
        assert token in terminal, token

    assert "${finding('What worked', whatWorked, 'worked', whatWorkedItems)}" in terminal
    assert "${finding('Issue detected', issue, 'issue', issueItems)}" in terminal
    assert "${pathExampleSection}" in terminal
    assert "break-inside:avoid" in terminal
    assert terminal.rstrip() in bundle
    print("Patch 529 structured findings and visual module-path print contract passed.")


if __name__ == "__main__":
    main()
