#!/usr/bin/env python3
"""Guard Phase 6 architecture, version, and manifest-only packaging contracts."""

from __future__ import annotations

import hashlib
import importlib.util
import json
import sys
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_packager():
    sys.dont_write_bytecode = True
    path = ROOT / "tools/package_changed.py"
    spec = importlib.util.spec_from_file_location("package_changed", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


manifest = json.loads((ROOT / "release/phase6-manifest.json").read_text(encoding="utf-8"))
assert manifest["release_id"] == "PROMPTCRAFT_V429_PHASE6_P527"
assert manifest["application"] == {
    "build": "PROMPTCRAFT_V429",
    "research_schema": "V121",
    "browser_cache_patch": 527,
    "dialogue_asset_version": 149,
}
assert manifest["receiver"]["live_baseline_version"] == "V83"
assert manifest["receiver"]["candidate_version"] == "V84"
assert manifest["receiver"]["deployed"] is False

for relative, expected in manifest["protected_sha256"].items():
    assert digest(ROOT / relative) == expected, f"protected product file changed: {relative}"

changed = (ROOT / "release/phase6-changed-files.txt").read_text(encoding="utf-8").splitlines()
changed = [entry for entry in changed if entry]
assert changed == sorted(changed)
assert len(changed) == len(set(changed)) == manifest["phase_6"]["changed_file_count"]
assert not any(entry.startswith(("assets/", "runtime/", "src/", "apps-script/", "netlify/")) for entry in changed)
assert not any("__pycache__" in entry or entry.endswith(("desktop.ini", ".pyc", ".pyo")) for entry in changed)
assert all((ROOT / entry).is_file() for entry in changed)

checksum_lines = (ROOT / "release/phase6-checksums.sha256").read_text(encoding="utf-8").splitlines()
checksums = {}
for line in checksum_lines:
    if line:
        expected, relative = line.split("  ", 1)
        checksums[relative] = expected
assert set(checksums) == set(changed) - {"release/phase6-checksums.sha256"}
for relative, expected in checksums.items():
    assert digest(ROOT / relative) == expected, f"changed-file checksum mismatch: {relative}"

architecture = (ROOT / "docs/development/repository-map.md").read_text(encoding="utf-8")
phase_doc = (ROOT / "docs/development/phase-6-architecture-release.md").read_text(encoding="utf-8")
for required in (
    "src/js/app/config-and-assets.js",
    "src/js/scenarios/registry.js",
    "src/js/ui/viewport-controller.js",
    "src/js/research/tracking.js",
    "apps-script/",
    "tools/package_changed.py",
):
    assert required in architecture
assert "Browser/cache patch | `527`" in phase_doc
assert "Research schema | `V121`" in phase_doc
assert "Receiver candidate | `V84`" in phase_doc

packager = load_packager()
with tempfile.TemporaryDirectory() as raw_temp:
    temp = Path(raw_temp)
    (temp / "docs").mkdir()
    (temp / "docs/a.md").write_text("alpha\n", encoding="utf-8")
    (temp / "tools").mkdir()
    (temp / "tools/b.py").write_text("print('beta')\n", encoding="utf-8")
    files = packager.validate_entries(temp, ["docs/a.md", "tools/b.py"])
    first = temp / "first.zip"
    second = temp / "second.zip"
    packager.create_zip(first, files)
    packager.create_zip(second, files)
    assert first.read_bytes() == second.read_bytes()
    with zipfile.ZipFile(first) as archive:
        assert archive.namelist() == ["docs/a.md", "tools/b.py"]

    (temp / "runtime/js").mkdir(parents=True)
    (temp / "runtime/js/promptcraft.bundle.js").write_text("generated\n", encoding="utf-8")
    try:
        packager.validate_entries(temp, ["runtime/js/promptcraft.bundle.js"])
    except ValueError as error:
        assert "no changed source owner" in str(error)
    else:
        raise AssertionError("unowned runtime output was accepted")

print("Phase 6 architecture and changed-file packaging contract passed")
