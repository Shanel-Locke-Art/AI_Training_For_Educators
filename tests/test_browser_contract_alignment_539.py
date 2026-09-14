#!/usr/bin/env python3
"""Static guard for the browser assertions realigned in Patch 539."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    index = read("index.html")
    runtime = read("tests/test_runtime.py")
    shared_vn = read("tests/test_shared_vn.py")
    draft = read("tests/test_s2_draft_flow.py")
    final = read("tests/test_s2_final_reuse.py")
    menu = read("tests/test_s2_menu_dev.py")
    dialogue = read("tests/test_s2_recorded_dialogue_guard.py")
    assessment = read("tests/test_s3_dragdrop.py")
    progress = read("tests/test_teaching_progress.py")

    assert 'Version 429 · Patch 543' in index
    assert 'DEV · 543' in index
    assert 'Next: Learning Path Builder' in index
    assert 'data-pc-action="dev-fill-scenario" data-pc-scenario-index="2"' in index
    assert 'configured_chromium or playwright.chromium.executable_path' in runtime
    assert 'chatText:' in runtime and 'workspaceMode:' in runtime
    assert 'SCENARIO_INDEX.CONTENT_AVALANCHE' in shared_vn
    assert 'SCENARIO_INDEX.ENGAGEMENT' not in shared_vn
    assert '"content-avalanche"' in shared_vn
    assert 'Compare Canvas grades' in draft
    assert 'My Canvas grade went from 76% to 84%' in draft
    assert 'Repaired Canvas Reflection Activity' in final
    assert '#s2DiagnosisChoices .pc-choice-marker' in menu
    assert 'window.devFillScenario(2)' in menu
    assert "before['text'] not in after_click['text']" in dialogue
    assert 'Maya earned 96% on the Week 4 Canvas quiz' in assessment
    assert 'opened the Canvas Assignment' in assessment
    assert "'Learning Path Builder'" in progress

    print('Patch 539 browser contract alignment guard passed.')


if __name__ == "__main__":
    main()
