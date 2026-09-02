#!/usr/bin/env python3
"""Guard the Phase 4 CSS ownership inventory and visual deletion boundary."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "release/phase4-css-ownership.json"


def main() -> int:
    result = subprocess.run(
        [sys.executable, "tools/css_ownership_inventory.py", "--check"],
        cwd=ROOT,
        check=False,
    )
    assert result.returncode == 0, "Phase 4 CSS ownership inventory is stale"

    data = json.loads(INVENTORY.read_text(encoding="utf-8"))
    assert data["browser_cache_patch"] == 526
    assert data["runtime_css_changed"] is False
    assert data["visual_baseline"]["status"] == "environment_blocked"
    assert data["visual_baseline"]["structural_deletion_allowed"] is False
    assert data["cascade"][0]["path"] == "foundation/base.css"
    assert data["cascade"][-1]["path"] == "ui/gfc-theme.css"
    assert data["totals"]["owner_files"] == 20
    assert data["totals"]["active_rules"] == 4642
    assert data["totals"]["important_declarations"] > 11000
    assert data["final_overrides"]["path"] == "responsive/final-overrides.css"
    assert data["final_overrides"]["line_count"] == 5657
    assert data["migration_order"] == [
        "onboarding-menu",
        "vn-cast",
        "s1-evidence-modal",
        "babbage-loading-results",
        "s2",
        "s3",
        "teaching-progress",
    ]
    print("Phase 4 CSS ownership inventory and visual deletion boundary passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
