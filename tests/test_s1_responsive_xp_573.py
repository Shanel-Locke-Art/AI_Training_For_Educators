"""Patch 573 contracts for exact S1 XP and responsive navigation."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = (ROOT / "src/js/app/scenario-runtime.js").read_text(encoding="utf-8")
S1 = (ROOT / "src/js/scenarios/s1-start-with-learning.js").read_text(encoding="utf-8")
CSS = (ROOT / "src/css/scenarios/s1-start-with-learning.css").read_text(encoding="utf-8")


def test_s1_xp_uses_the_named_checkpoint_values():
    assert "? s1RawScore" in RUNTIME
    assert "Math.round((s1RawScore / 17) * 50)" not in RUNTIME


def test_review_navigation_targets_distinct_sections():
    for section_id in ("pcS1ReviewFeedback", "pcS1ReviewImprovements", "pcS1ReviewPattern"):
        assert f'data-pc-review-section="{section_id}"' in S1
    assert "function pcScrollS1ReviewSection" in S1


def test_responsive_fixes_cover_phone_tablet_and_diagnosis():
    for token in (
        ".pc-s1-canvas-course-nav a:nth-child(n+4)",
        ".pc-s1-guide-preview .pc-s1-guide-paper-header",
        ".pc-s1-diagnosis-result .pc-s1-learning-workspace",
        "@media (min-width: 641px) and (max-width: 1050px)",
        "@media (min-width: 900px) and (max-width: 1399px)",
    ):
        assert token in CSS
