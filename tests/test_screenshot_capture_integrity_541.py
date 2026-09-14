#!/usr/bin/env python3
"""Static guard for Patch 541 screenshot fidelity and asset handling."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    runtime = (ROOT / "tests/test_runtime.py").read_text(encoding="utf-8")
    required = (
        '".svg": "image/svg+xml"',
        '".webp": "image/webp"',
        "brandLogoLoaded",
        "scrollIntoView({block:'center', inline:'nearest'})",
        "full_page=False",
        "s3-05-final-result-details",
        "s4-07-final-result-details",
        "S1 Before and After captures are identical",
    )
    for marker in required:
        assert marker in runtime, marker
    assert "full_page=True" not in runtime
    assert "focus.scroll_into_view_if_needed()" not in runtime
    print("Patch 541 screenshot capture integrity contract passed.")


if __name__ == "__main__":
    main()
