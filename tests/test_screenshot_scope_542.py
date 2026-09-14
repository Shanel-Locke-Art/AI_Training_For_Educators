#!/usr/bin/env python3
"""Static guard for Patch 542 scenario-overview and focused-view captures."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    runtime = (ROOT / "tests/test_runtime.py").read_text(encoding="utf-8")
    required = (
        "s1-00-overview",
        "s3-00-overview",
        "s4-00-overview",
        "block:'center'",
        "focus_selector is not None",
        "51 named internal scenario views",
    )
    for marker in required:
        assert marker in runtime, marker
    assert "focus.scroll_into_view_if_needed()" not in runtime
    print("Patch 542 scenario screenshot scope contract passed.")


if __name__ == "__main__":
    main()
