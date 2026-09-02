#!/usr/bin/env python3
"""Guard the Phase 6 canonical production workbook synchronization."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "release/phase6-spreadsheet-sync-manifest.json").read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def workbook_xml(relative: str) -> str:
    with ZipFile(ROOT / relative) as archive:
        return "\n".join(
            archive.read(name).decode("utf-8", "ignore")
            for name in archive.namelist()
            if name.endswith(".xml")
        )


assert MANIFEST["release_id"] == "PROMPTCRAFT_V429_PHASE6_SPREADSHEET_SYNC_P527"
assert MANIFEST["application"]["build"] == "PROMPTCRAFT_V429"
assert MANIFEST["application"]["research_schema"] == "V121"
assert MANIFEST["application"]["browser_cache_patch"] == 527
assert MANIFEST["receiver"]["live_baseline_version"] == "V83"
assert MANIFEST["receiver"]["candidate_version"] == "V84"
assert MANIFEST["assets"]["manifest_version"] == 149

for relative, expected in MANIFEST["workbook_sha256"].items():
    assert sha256(ROOT / relative) == expected, f"workbook hash mismatch: {relative}"

overview = workbook_xml("docs/asset-management/PromptCraft_Production_Overview_Simplified.xlsx")
visual = workbook_xml("docs/asset-management/PromptCraft_Visual_Asset_Tracker_Simplified.xlsx")
voice = workbook_xml("docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx")

for token in (
    "PROMPTCRAFT_V429",
    "schema V121",
    "patch 527",
    "receiver V83 live / V84 candidate",
    "asset manifest v149",
    "PromptCraft_Voice_Recording_Tracker.xlsx",
):
    assert token in overview, f"overview missing {token}"
for token in (
    "Canvas evidence",
    "asset-manifest v149",
    "Archived",
    "S3: The Confident Student Problem",
    "S4: The 96% Problem",
    "$E$5:$E$103",
):
    assert token in visual, f"visual tracker missing {token}"
for token in (
    "dialogue asset 149",
    "Phase 6 / patch 527",
    "S3: The Confident Student Problem",
    "legacy recording filenames preserved",
):
    assert token in voice, f"voice tracker missing {token}"

combined = overview + visual + voice
for stale in (
    "receiver V82",
    "asset-manifest v144",
    "S2: Metacognition",
    "PromptCraft_Voiceover_Tracker_Simplified.xlsx",
    "'Visual Assets'!E:E",
    "'Visual Assets'!B:B",
):
    assert stale not in combined, f"stale workbook token remains: {stale}"

sync = MANIFEST["spreadsheet_sync"]
assert sync == {
    "workbooks_changed": 3,
    "changed_file_count": 11,
    "visuals_in_use": 59,
    "visuals_planned": 3,
    "visuals_not_started": 18,
    "visuals_reference_only": 9,
    "visuals_archived": 10,
    "voice_lines_ready": 68,
    "runtime_audio_in_use": 3,
    "rows_deleted": 0,
    "raw_archives_changed": False,
}

print("Phase 6 canonical spreadsheet synchronization contract passed")
