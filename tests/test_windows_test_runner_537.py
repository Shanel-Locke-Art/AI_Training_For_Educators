#!/usr/bin/env python3
"""Patch 537 contract for Windows-compatible regression execution."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHECK = (ROOT / "tools/check.py").read_text(encoding="utf-8")
VIEWPORT = (ROOT / "tests/test_viewport_controller_526.js").read_text(encoding="utf-8")
S2 = (ROOT / "tests/test_s2_repair_terminal_flow.py").read_text(encoding="utf-8")
PROGRESS = (ROOT / "tests/test_teaching_progress.py").read_text(encoding="utf-8")
REQ = ROOT / "requirements-dev.txt"
ATTRS = ROOT / ".gitattributes"


def main() -> None:
    assert "PROMPTCRAFT_CHROMIUM" in CHECK
    assert "playwright.chromium.executable_path" in CHECK
    assert 'popen_kwargs = {"cwd": ROOT, "env": env}' in CHECK
    assert "split(path.sep).join('/')" in VIEWPORT
    assert S2.count("read_text(encoding='utf-8')") == 5
    assert "os.environ.get('PROMPTCRAFT_CHROMIUM')" in PROGRESS
    assert "playwright" in REQ.read_text(encoding="utf-8").lower()
    assert "pillow" in REQ.read_text(encoding="utf-8").lower()
    assert "PromptCraft_Receiver_V83_Readable_Prompt_Data.js -text" in ATTRS.read_text(encoding="utf-8")
    print("PASS: Patch 537 Windows test-runner portability")


if __name__ == "__main__":
    main()
