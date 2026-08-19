#!/usr/bin/env python3
"""Static guard for the Babbage-to-VN handoff flash fix."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "src/js/ui/babbage-terminal.js").read_text(encoding="utf-8")
BUNDLE = (ROOT / "runtime/js/promptcraft.bundle.js").read_text(encoding="utf-8")

CHECKS = (
    ("direct VN handoff is detected explicitly", "const directVNHandoff = typeof cb === 'function' && handoff === 'vn';"),
    ("overlay stays active during direct handoff", "pcSetVNOverlayState({ active: directVNHandoff });"),
    ("handoff renders synchronously", "if (directVNHandoff) {\n    cb();\n    return;\n  }"),
)

failures = []
for label, needle in CHECKS:
    if needle not in SOURCE:
        failures.append(label)
    if needle not in BUNDLE:
        failures.append(f"{label} (compiled bundle)")

if "pcScheduleScenarioTask(cb, 250)" in SOURCE or "pcScheduleScenarioTask(cb, 250)" in BUNDLE:
    failures.append("retired 250 ms close/reopen gap returned")

if failures:
    print("PromptCraft transition-handoff guard FAILED:")
    for failure in failures:
        print(f"- {failure}")
    raise SystemExit(1)

print("PromptCraft transition-handoff guard passed: VN callbacks keep the overlay while app/workspace callbacks close it cleanly.")
