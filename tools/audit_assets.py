#!/usr/bin/env python3
"""Validate PromptCraft's asset manifest, runtime references, and orphan files."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "assets"
MANIFEST_PATH = ASSET_ROOT / "asset-manifest.json"
SOURCE_GLOBS = (
    "index.html",
    "wall.html",
    "src/js/**/*.js",
    "src/css/**/*.css",
)


def manifest_paths(manifest: dict) -> tuple[set[str], set[str]]:
    required: set[str] = set()
    planned: set[str] = set(manifest.get("planned_audio", []))

    for key in ("runtime_images", "planned_runtime_images", "runtime_audio"):
        required.update(manifest.get(key, {}).values())
    for key in ("development_reference_images", "asset_documentation"):
        required.update(manifest.get(key, []))

    return required, planned


def referenced_asset_paths() -> set[str]:
    references: set[str] = set()
    pattern = re.compile(r"(?:\.\./|\./)?(assets/[A-Za-z0-9_./-]+\.[A-Za-z0-9]+(?:\?[^\"')\s]+)?)")

    for glob_pattern in SOURCE_GLOBS:
        for path in ROOT.glob(glob_pattern):
            text = path.read_text(encoding="utf-8")
            for match in pattern.finditer(text):
                references.add(match.group(1).split("?", 1)[0])
    return references


def main() -> int:
    errors: list[str] = []
    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        print(f"ERROR: Could not read {MANIFEST_PATH.relative_to(ROOT)}: {error}", file=sys.stderr)
        return 1

    required, planned = manifest_paths(manifest)
    for relative in sorted(required):
        if not (ROOT / relative).is_file():
            errors.append(f"Manifest asset is missing: {relative}")

    actual = {
        path.relative_to(ROOT).as_posix()
        for path in ASSET_ROOT.rglob("*")
        if path.is_file() and path != MANIFEST_PATH
    }
    documented = required | planned
    orphaned = sorted(actual - documented)
    if orphaned:
        errors.append("Unclassified asset files: " + ", ".join(orphaned))

    references = referenced_asset_paths()
    for relative in sorted(references):
        if relative in planned:
            continue
        if not (ROOT / relative).is_file():
            errors.append(f"Source references a missing asset: {relative}")

    runtime_assets = (
        set(manifest.get("runtime_images", {}).values())
        | set(manifest.get("runtime_audio", {}).values())
    )
    unreferenced_runtime = sorted(runtime_assets - references)
    # Some runtime assets are selected indirectly by registry key. They are still
    # expected to appear in source text through the central ASSETS registry.
    if unreferenced_runtime:
        errors.append("Runtime assets absent from source registries: " + ", ".join(unreferenced_runtime))

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(
        "PromptCraft asset audit passed: "
        f"{len(actual)} classified files, {len(references)} source references, "
        f"{len(planned)} planned audio files."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
