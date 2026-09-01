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
    ("Apps Script receiver V83 characterization fixtures", ["node", "tests/test_receiver_v83_fixture.js"]),
    ("Structural hardening", [sys.executable, "tools/validate.py"]),
    ("S1 Canvas evidence assets", [sys.executable, "tests/test_s1_canvas_evidence_assets.py"]),
    ("Canvas scenario menu roadmap", [sys.executable, "tests/test_scenario_menu_roadmap_463.py"]),
    ("S1 Content Avalanche evidence station", [sys.executable, "tests/test_s1_content_avalanche_preview_464.py"]),
    ("Great Falls College theme contract", [sys.executable, "tests/test_gfc_theme.py"]),
    ("Babbage-to-VN transition handoff", [sys.executable, "tests/test_transition_handoff.py"]),
    ("Print, Save PDF, and Ideas Wall", [sys.executable, "tests/test_print_save_ideas_wall.py"]),
    ("S2 repair terminal contract", [sys.executable, "tests/test_s2_repair_terminal_flow.py"]),
    ("Dialogue cleanup", [sys.executable, "tests/test_dialogue_cleanup.py"]),
    ("GFC action borders", [sys.executable, "tests/test_gfc_action_borders.py"]),
    ("Ideas Wall header theme", [sys.executable, "tests/test_ideas_wall_header_theme.py"]),
    ("S1 comparison modal 490", [sys.executable, "tests/test_s1_comparison_modal_490.py"]),
    ("S1 case input and capture 491", [sys.executable, "tests/test_s1_case_input_and_capture_491.py"]),
    ("S1 AI Canvas Rescue contract", [sys.executable, "tests/test_s1_ai_canvas_rescue_474.py"]),
    ("S1 AI workspace 476", [sys.executable, "tests/test_s1_ai_workspace_476.py"]),
    ("S1 Canvas compact interface 481", [sys.executable, "tests/test_s1_canvas_compact_interface_481.py"]),
    ("S1 Canvas mobile module 483", [sys.executable, "tests/test_s1_canvas_mobile_module_483.py"]),
    ("S1 case-page-only terminal 488", [sys.executable, "tests/test_s1_case_page_only_terminal_488.py"]),
    ("S1 case-page reflection 486", [sys.executable, "tests/test_s1_case_page_reflection_486.py"]),
    ("S1 compact evidence reader 479", [sys.executable, "tests/test_s1_compact_evidence_reader_479.py"]),
    ("S1 connected AI handoff 480", [sys.executable, "tests/test_s1_connected_ai_handoff_480.py"]),
    ("S1 documented-device crop 489", [sys.executable, "tests/test_s1_documented_device_crop_489.py"]),
    ("S1 edge-to-edge Canvas 482", [sys.executable, "tests/test_s1_edge_to_edge_canvas_482.py"]),
    ("S1 mobile evidence lens 477", [sys.executable, "tests/test_s1_mobile_evidence_lens_477.py"]),
    ("S1 mobile fullscreen reader 478", [sys.executable, "tests/test_s1_mobile_fullscreen_reader_478.py"]),
    ("S1 real Canvas edge crop 487", [sys.executable, "tests/test_s1_real_canvas_edge_crop_487.py"]),
    ("S1 real mobile captures 485", [sys.executable, "tests/test_s1_real_mobile_captures_485.py"]),
    ("S1 evidence and variable analysis 493", [sys.executable, "tests/test_s1_evidence_analysis_493.py"]),
    ("S1 targeted profiles and resilient analysis 494", [sys.executable, "tests/test_s1_targeted_profiles_analysis_494.py"]),
    ("S1 complete evidence and narrated case transitions 495", [sys.executable, "tests/test_s1_complete_evidence_case_transition_495.py"]),
    ("S1 reused dialogue and documented Canvas fit 496", [sys.executable, "tests/test_s1_reused_dialogue_canvas_fit_496.py"]),
    ("S1 centered tablet and adaptive phone cast 497", [sys.executable, "tests/test_s1_centered_tablet_adaptive_cast_497.py"]),
    ("S1 emulated device fit and current-case DEV fill 498", [sys.executable, "tests/test_s1_emulated_fit_current_dev_case_498.py"]),
    ("S1 full-width documented Canvas stage 499", [sys.executable, "tests/test_s1_full_width_documented_stage_499.py"]),
    ("S1 adaptive Canvas dialogue cast 500", [sys.executable, "tests/test_s1_adaptive_canvas_cast_500.py"]),
    ("S1 order-independent Canvas viewport 501", [sys.executable, "tests/test_s1_order_independent_viewport_501.py"]),
    ("S1 dialogue-anchored adaptive cast 502", [sys.executable, "tests/test_s1_dialogue_anchored_cast_502.py"]),
    ("S1 responsive full-size evidence modal 503", [sys.executable, "tests/test_s1_responsive_full_size_modal_503.py"]),
    ("S1 shared case introduction and terminal continuation 504", [sys.executable, "tests/test_s1_shared_intro_direct_terminal_504.py"]),
    ("S1 S2-staged Canvas dialogue and analysis rows 505", [sys.executable, "tests/test_s1_s2_staged_dialogue_analysis_rows_505.py"]),
    ("S1 readable Canvas backdrop, focused analysis, and example planner 506", [sys.executable, "tests/test_s1_readable_backdrop_focused_analysis_planner_506.py"]),
    ("S1 Eli character and dialogue integration 507", [sys.executable, "tests/test_s1_eli_character_dialogue_507.py"]),
    ("S1 mission image and contained Canvas dialogue 508", [sys.executable, "tests/test_s1_mission_canvas_dialogue_fit_508.py"]),
    ("S1 responsive evidence and transfer DEV fill 509", [sys.executable, "tests/test_s1_responsive_modal_transfer_dev_509.py"]),
    ("Connection recovery 510", [sys.executable, "tests/test_connection_recovery_510.py"]),
    ("S1 live evidence tracking 512", [sys.executable, "tests/test_s1_live_evidence_tracking_512.py"]),
    ("Build version detection 513", [sys.executable, "tests/test_build_version_detection_513.py"]),
    ("S1 quality and transfer tracking 514", [sys.executable, "tests/test_s1_quality_transfer_tracking_514.py"]),
    ("S1 framed introduction and transfer purpose 515", [sys.executable, "tests/test_s1_framed_intro_path_purpose_515.py"]),
    ("S1 viewport-family introduction layout 516", [sys.executable, "tests/test_s1_viewport_family_intro_layout_516.py"]),
    ("S1 scrollable evidence and Pixel progress feedback 517", [sys.executable, "tests/test_s1_scrollable_modal_pixel_xp_517.py"]),
    ("S1 reset and responsive evidence inspection 518", [sys.executable, "tests/test_s1_reset_intro_modal_518.py"]),
    ("S1 validated transfer analysis and device defaults 523", [sys.executable, "tests/test_s1_validated_transfer_analysis_523.py"]),
    ("S1 visual handoff 475", [sys.executable, "tests/test_s1_visual_handoff_475.py"]),
    ("S3 Authentic Assessment contract", [sys.executable, "tests/test_s3_authentic_assessment.py"]),
    ("S3 Transfer Lab contract", [sys.executable, "tests/test_s3_transfer_lab.py"]),
    ("Teaching Progress heading 448", [sys.executable, "tests/test_teaching_progress_heading_448.py"]),
    ("Workstation monitor alignment 461", [sys.executable, "tests/test_workstation_monitor_alignment_461.py"]),
    ("Netlify Babbage proxy unit tests", ["node", "tests/test_netlify_function.js"]),
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
    ("S3 authentic-assessment drag/drop", [sys.executable, "tests/test_s3_dragdrop.py"]),
    ("S1 guided-repair assembled brief geometry", [sys.executable, "tests/test_s1_guided_repair.py"]),
    ("S3 transfer lab runtime", [sys.executable, "tests/test_s3_transfer_lab_runtime.py"]),
    ("Teaching Progress HUD", [sys.executable, "tests/test_teaching_progress.py"]),
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
