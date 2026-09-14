#!/usr/bin/env python3
"""Guard the internal scenario screenshot inventory introduced in Patch 540."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    runtime = (ROOT / "tests/test_runtime.py").read_text(encoding="utf-8")
    expected = (
        "s1-01-canvas-case-before",
        "s1-02-canvas-case-after",
        "s3-01-diagnosis",
        "s3-02-audit-babbage",
        "s3-03-guided-repair",
        "s3-04-final-result",
        "s4-01-diagnosis",
        "s4-02-assessment-blueprint",
        "s4-03-stress-test",
        "s4-04-audit-babbage",
        "s4-05-repair-inference",
        "s4-06-final-result",
    )
    for name in expected:
        assert name in runtime, name
    assert "capture_internal_scenario_views" in runtime
    assert "scenario-views" in runtime
    assert "page.screenshot(path=str(args.output / f\"{viewport_name}-scenario-" not in runtime
    print("Patch 540 internal scenario capture inventory passed.")


if __name__ == "__main__":
    main()
