#!/usr/bin/env python3
"""Run the PromptCraft pre-release regression suite from one command.

The default suite runs structural/static checks plus the focused S1/S2 contract tests.
Use ``--full`` before packaging or beginning a new scenario to include browser-based
responsive and interaction regression tests.
"""

from __future__ import annotations

import argparse
import os
import signal
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

QUICK_CHECKS = (
    ("Source/runtime synchronization", [sys.executable, "tools/build.py", "--check"]),
    ("Structural hardening", [sys.executable, "tools/validate.py"]),
    ("Great Falls College theme contract", [sys.executable, "tests/test_gfc_theme.py"]),
    ("Babbage-to-VN transition handoff", [sys.executable, "tests/test_transition_handoff.py"]),
    ("Print, Save PDF, and Ideas Wall", [sys.executable, "tests/test_print_save_ideas_wall.py"]),
    ("S2 repair terminal contract", [sys.executable, "tests/test_s2_repair_terminal_flow.py"]),
)

BROWSER_CHECKS = (
    ("Scenario runtime smoke suite", [sys.executable, "tests/test_runtime.py"]),
    ("Shared VN geometry: desktop + activity reuse", [sys.executable, "tests/test_shared_vn.py", "--viewport", "desktop"]),
    ("Shared VN geometry: Nest Hub Max", [sys.executable, "tests/test_shared_vn.py", "--viewport", "nest-hub-max", "--skip-activities"]),
    ("Shared VN geometry: Nest Hub", [sys.executable, "tests/test_shared_vn.py", "--viewport", "nest-hub", "--skip-activities"]),
    ("Shared VN geometry: foldable tablet", [sys.executable, "tests/test_shared_vn.py", "--viewport", "foldable-tablet", "--skip-activities"]),
    ("Shared VN geometry: Surface Duo", [sys.executable, "tests/test_shared_vn.py", "--viewport", "surface-duo", "--skip-activities"]),
    ("Shared VN geometry: phone", [sys.executable, "tests/test_shared_vn.py", "--viewport", "phone", "--skip-activities"]),
    ("Analysis overflow", [sys.executable, "tests/test_analysis_overflow.py"]),
    ("S2 draft flow", [sys.executable, "tests/test_s2_draft_flow.py"]),
    ("S2 guided repair", [sys.executable, "tests/test_s2_guided_repair.py"]),
    ("S2 final-result reuse", [sys.executable, "tests/test_s2_final_reuse.py"]),
    ("S2 menu/development shell", [sys.executable, "tests/test_s2_menu_dev.py"]),
    ("S2 recorded-dialogue guard", [sys.executable, "tests/test_s2_recorded_dialogue_guard.py"]),
)


def _terminate_process_tree(process: subprocess.Popen) -> None:
    """Terminate the test process and any browser children it spawned.

    Playwright/Chromium can leave helper processes alive after an otherwise
    successful test. Isolating each check in its own session prevents those
    helpers from accumulating and starving later viewport tests.
    """
    if os.name == "posix":
        try:
            os.killpg(process.pid, signal.SIGTERM)
        except ProcessLookupError:
            return
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
        return

    if process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()


def run(label: str, command: list[str]) -> bool:
    print(f"\n== {label} ==", flush=True)
    popen_kwargs = {"cwd": ROOT}
    if os.name == "posix":
        popen_kwargs["start_new_session"] = True
    process = subprocess.Popen(command, **popen_kwargs)
    timed_out = False
    try:
        returncode = process.wait(timeout=180)
    except subprocess.TimeoutExpired:
        timed_out = True
        returncode = None
    finally:
        # Always reap the isolated process group. Successful Playwright tests
        # occasionally leave Chromium helpers behind even after Python exits.
        _terminate_process_tree(process)

    if timed_out:
        print(f"TIMEOUT: {label}", file=sys.stderr)
        return False
    if returncode:
        print(f"FAILED: {label}", file=sys.stderr)
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--full",
        action="store_true",
        help="Include browser-based responsive and interaction regression tests.",
    )
    args = parser.parse_args()

    checks = QUICK_CHECKS + (BROWSER_CHECKS if args.full else ())
    failures = [label for label, command in checks if not run(label, command)]

    print()
    if failures:
        print("PromptCraft regression suite failed: " + ", ".join(failures), file=sys.stderr)
        return 1
    mode = "full" if args.full else "quick"
    print(f"PromptCraft {mode} regression suite passed ({len(checks)} checks).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
