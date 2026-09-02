#!/usr/bin/env python3
"""Generate the Phase 4 final-cascade CSS selector ownership inventory."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

import audit_css

ROOT = Path(__file__).resolve().parents[1]
CSS_ROOT = ROOT / "src/css"
OUTPUT = ROOT / "release/phase4-css-ownership.json"
FAMILY_PATTERNS = {
    "onboarding-menu": ("audio-setup", "pc-main-menu", "pc-menu-", "pc-brand-menu"),
    "vn-cast": ("vn-", "cast", "character-slot"),
    "s1-evidence-modal": ("pc-s1", "s1-", "evidence-modal"),
    "babbage-loading-results": ("babbage", "analysis-", "terminal"),
    "s2": ("s2-", "metacognition"),
    "s3": (
        "s3-",
        "authentic-assessment",
        "pc-drag-",
        "pc-design-snapshot",
        "pc-evidence-chain",
        "pc-transfer-",
    ),
    "teaching-progress": ("teaching-progress", "xp-", "level-"),
}


def browser_status() -> dict[str, object]:
    system_browser = next(
        (
            path
            for name in ("chromium", "chromium-browser", "google-chrome", "firefox")
            if (path := shutil.which(name))
        ),
        None,
    )
    node_browser = False
    if shutil.which("node"):
        probe = subprocess.run(
            [
                "node",
                "-e",
                (
                    "const fs=require('fs');"
                    "try{const {chromium}=require('playwright');"
                    "process.exit(fs.existsSync(chromium.executablePath())?0:1)}"
                    "catch(e){process.exit(1)}"
                ),
            ],
            cwd=ROOT,
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        node_browser = probe.returncode == 0
    available = bool(system_browser or node_browser)
    return {
        "status": "available" if available else "environment_blocked",
        "reason": (
            "Browser executable is available for computed-style and screenshot baselines"
            if available
            else "No Playwright or system browser executable is available"
        ),
        "structural_deletion_allowed": available,
    }


def build_inventory() -> dict[str, object]:
    ownership: dict[str, list[dict[str, object]]] = defaultdict(list)
    cascade: list[dict[str, object]] = []
    family_counts: dict[str, dict[str, int]] = {
        family: {} for family in FAMILY_PATTERNS
    }
    total_rules = 0
    total_important = 0

    for cascade_index, path in enumerate(audit_css.source_paths()):
        relative = path.relative_to(CSS_ROOT).as_posix()
        text = path.read_text(encoding="utf-8")
        rules = audit_css.parse_rules(
            audit_css.strip_comments(text),
            file_name=path.name,
        )
        important = text.count("!important")
        total_rules += len(rules)
        total_important += important
        cascade.append(
            {
                "cascade_index": cascade_index,
                "path": relative,
                "rule_count": len(rules),
                "important_declarations": important,
            }
        )
        for rule_index, (context, selector, declarations, _raw_selector) in enumerate(rules):
            occurrence = {
                "path": relative,
                "cascade_index": cascade_index,
                "rule_index": rule_index,
                "context": list(context),
                "important_declarations": declarations.count("!important"),
            }
            ownership[selector].append(occurrence)
            lowered = selector.lower()
            for family, patterns in FAMILY_PATTERNS.items():
                if any(pattern in lowered for pattern in patterns):
                    counts = family_counts[family]
                    counts[relative] = counts.get(relative, 0) + 1

    selector_ownership = [
        {
            "selector": selector,
            "occurrences": occurrences,
            "owner_count": len({item["path"] for item in occurrences}),
        }
        for selector, occurrences in ownership.items()
    ]
    selector_ownership.sort(
        key=lambda item: (
            item["occurrences"][0]["cascade_index"],
            item["occurrences"][0]["rule_index"],
            item["selector"],
        )
    )
    multi_owner = sum(1 for item in selector_ownership if item["owner_count"] > 1)

    final_path = CSS_ROOT / "responsive/final-overrides.css"
    final_text = final_path.read_text(encoding="utf-8")
    patch_markers = sorted(
        {
            int(value)
            for value in __import__("re").findall(r"/\*\s*V(\d+)", final_text)
        }
    )
    return {
        "inventory_version": 1,
        "application_build": "PROMPTCRAFT_V429",
        "research_schema": "V121",
        "receiver_version": "V83",
        "browser_cache_patch": 526,
        "runtime_css_changed": False,
        "cascade": cascade,
        "totals": {
            "owner_files": len(cascade),
            "active_rules": total_rules,
            "important_declarations": total_important,
            "normalized_selector_headers": len(selector_ownership),
            "multi_owner_selector_headers": multi_owner,
        },
        "final_overrides": {
            "path": "responsive/final-overrides.css",
            "line_count": len(final_text.splitlines()),
            "rule_count": next(
                item["rule_count"] for item in cascade if item["path"] == "responsive/final-overrides.css"
            ),
            "important_declarations": final_text.count("!important"),
            "patch_markers": patch_markers,
        },
        "migration_order": list(FAMILY_PATTERNS),
        "family_rule_ownership": family_counts,
        "selector_ownership": selector_ownership,
        "visual_baseline": browser_status(),
    }


def render(data: dict[str, object]) -> str:
    return json.dumps(data, indent=2, sort_keys=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    expected = render(build_inventory())
    if args.check:
        if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != expected:
            print(f"ERROR: stale CSS ownership inventory: {OUTPUT.relative_to(ROOT)}", file=sys.stderr)
            return 1
        print("PromptCraft CSS ownership inventory is current.")
        return 0
    OUTPUT.write_text(expected, encoding="utf-8")
    print(OUTPUT.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
