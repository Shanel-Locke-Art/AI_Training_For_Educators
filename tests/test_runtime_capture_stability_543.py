#!/usr/bin/env python3
"""Static guard for Patch 543 deterministic onboarding and capture totals."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    runtime = (ROOT / "tests/test_runtime.py").read_text(encoding="utf-8")
    scope = (ROOT / "tests/test_screenshot_scope_542.py").read_text(encoding="utf-8")
    required_runtime = (
        "PlaywrightTimeoutError",
        "wait_for(state=\"visible\", timeout=3000)",
        "wait_for(state=\"hidden\", timeout=3000)",
        "51 named internal scenario views",
    )
    for marker in required_runtime:
        assert marker in runtime, marker
    assert "45 named internal scenario views" not in runtime
    assert "51 named internal scenario views" in scope
    print("Patch 543 runtime capture stability contract passed.")


if __name__ == "__main__":
    main()
