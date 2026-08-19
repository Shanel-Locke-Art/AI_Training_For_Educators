#!/usr/bin/env python3
"""Regression checks for PromptCraft's reusable VN/workstation presentation.

Protects the contract established by S1 and reused by later scenarios:
- workstation-result geometry is shared rather than scenario-specific;
- the monitor text layer stays transparent over the photographed screen;
- single-character result scenes use the primary S1 character slot;
- dual-cast scenes change only cast staging, never dialogue geometry;
- phone dual-cast scenes show only the active speaker in the S1 anchor.
"""

from __future__ import annotations

import argparse
import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
VIEWPORTS = {
    "desktop": (1600, 1000),
    "nest-hub-max": (1280, 800),
    "nest-hub": (1024, 600),
    "foldable-tablet": (853, 1280),
    "surface-duo": (540, 720),
    "phone": (390, 844),
}
CONTENT_TYPES = {
    ".css": "text/css",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".js": "application/javascript",
    ".json": "application/json",
    ".mp3": "audio/mpeg",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}
TOLERANCE = 1.0


def close(a: float, b: float, tolerance: float = TOLERANCE) -> bool:
    return abs(a - b) <= tolerance


def rect_matches(a: dict, b: dict, keys=("x", "y", "w", "h"), tolerance=TOLERANCE) -> bool:
    return all(close(float(a[key]), float(b[key]), tolerance) for key in keys)


def with_test_base(html: str) -> str:
    return html.replace("<head>", '<head><base href="https://promptcraft.test/">', 1)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--viewport", choices=VIEWPORTS)
    parser.add_argument(
        "--skip-activities",
        action="store_true",
        help="Run only the shared VN geometry checks for the selected viewport.",
    )
    args = parser.parse_args()
    active_viewports = (
        {args.viewport: VIEWPORTS[args.viewport]} if args.viewport else VIEWPORTS
    )

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Python Playwright is required for shared VN tests.", file=sys.stderr)
        return 2

    chromium = os.environ.get("PROMPTCRAFT_CHROMIUM") or shutil.which("chromium") or shutil.which("google-chrome")
    if not chromium:
        print("ERROR: Chromium was not found. Set PROMPTCRAFT_CHROMIUM to its executable.", file=sys.stderr)
        return 2

    html = with_test_base((ROOT / "index.html").read_text(encoding="utf-8"))
    failures: list[str] = []

    def register_routes(page) -> None:
        def handle(route, request) -> None:
            parsed = urlparse(request.url)
            if parsed.hostname != "promptcraft.test":
                route.abort()
                return
            if request.method != "GET":
                route.fulfill(status=200, body="ok", content_type="text/plain")
                return
            relative = parsed.path.lstrip("/") or "index.html"
            path = ROOT / relative
            if not path.is_file():
                route.fulfill(status=404, body="missing", content_type="text/plain")
                return
            route.fulfill(
                status=200,
                body=path.read_bytes(),
                content_type=CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream"),
            )

        page.route("**/*", handle)

    result_state_js = """() => {
      const box = element => {
        const r = element.getBoundingClientRect();
        return { x:r.x, y:r.y, w:r.width, h:r.height };
      };
      const screen = document.querySelector('#babbageTerminalScene .babbage-terminal-screen');
      const style = getComputedStyle(screen);
      return {
        terminal: box(document.getElementById('babbageTerminalScene')),
        screen: box(screen),
        dialogue: box(document.getElementById('vnDialogue')),
        primary: box(document.getElementById('vnCharacter')),
        secondaryDisplay: getComputedStyle(document.getElementById('vnStudentCharacter')).display,
        primaryCharacter: document.getElementById('vnCharacter').dataset.pcCharacter || '',
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor
      };
    }"""

    cast_state_js = """() => {
      const item = element => {
        const r = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { x:r.x, y:r.y, w:r.width, h:r.height, display:style.display };
      };
      return {
        dialogue: item(document.getElementById('vnDialogue')),
        primary: item(document.getElementById('vnCharacter')),
        secondary: item(document.getElementById('vnStudentCharacter')),
        retiredTwoCharacter: document.getElementById('vnOverlay').classList.contains('pc-s2-two-character'),
        retiredNarrowJordan: document.getElementById('vnOverlay').classList.contains('pc-s2-narrow-jordan')
      };
    }"""

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=chromium, args=["--no-sandbox"])

        for label, (width, height) in active_viewports.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            register_routes(page)
            page.set_content(html, wait_until="domcontentloaded")
            page.wait_for_timeout(700)

            # Shared result: S1 and S2 must be the same renderer/geometry. Only
            # content and character identity are allowed to differ.
            page.evaluate(
                """() => {
                  document.body.dataset.pcScenario = 'engagement';
                  pcApplyViewportFamily();
                  pcShowSharedWorkstationResult({
                    terminalText:'AWAITING PREDICTION',
                    speakerName:'Professor Pixel',
                    character:'pixel',
                    expression:'thinking',
                    heading:'Your prediction is logged.',
                    bodyHTML:'Shared result geometry check.',
                    button:{ label:'Continue', action:'noop' }
                  });
                }"""
            )
            page.wait_for_timeout(1000)
            s1 = page.evaluate(result_state_js)

            page.evaluate("pcClearPredictionUI(); pcShowS2JordanRecordedDialogue('grade_compare');")
            page.wait_for_timeout(1000)
            s2 = page.evaluate(result_state_js)

            for part in ("terminal", "screen", "dialogue", "primary"):
                if not rect_matches(s1[part], s2[part]):
                    failures.append(f"{label}: S2 {part} geometry diverges from shared S1 result geometry.")
            if s2["secondaryDisplay"] != "none":
                failures.append(f"{label}: S2 result should use the primary S1 character slot only.")
            if s2["primaryCharacter"] != "jordan":
                failures.append(f"{label}: Jordan was not mounted into the primary shared character slot.")
            if s2["backgroundImage"] != "none" or s2["backgroundColor"] != "rgba(0, 0, 0, 0)":
                failures.append(f"{label}: Recorded Dialogue added a monitor background instead of using the photographed screen.")

            # Cast mode: the same dialogue component must retain identical
            # geometry while a secondary character is added.
            page.evaluate(
                """() => {
                  pcClearPredictionUI();
                  const overlay = document.getElementById('vnOverlay');
                  overlay.className = 'vn-overlay active scenario-intro-active';
                  document.body.dataset.pcScenario = 'engagement';
                  pcApplyViewportFamily();
                  vnSetDialogueCharacter('pixel','neutral','Professor Pixel',['pixel']);
                  pcApplyIpadLayout();
                }"""
            )
            page.wait_for_timeout(520)
            single = page.evaluate(cast_state_js)

            page.evaluate(
                """() => {
                  document.body.dataset.pcScenario = 'metacognition';
                  vnSetDialogueCharacter('pixel','neutral','Professor Pixel',[
                    {id:'pixel',slot:'right'}, {id:'jordan',slot:'left'}
                  ]);
                  pcApplyIpadLayout();
                }"""
            )
            page.wait_for_timeout(520)
            dual_pixel = page.evaluate(cast_state_js)

            if not rect_matches(single["dialogue"], dual_pixel["dialogue"]):
                failures.append(f"{label}: enabling dual cast changed the shared dialogue geometry.")
            if dual_pixel["retiredTwoCharacter"] or dual_pixel["retiredNarrowJordan"]:
                failures.append(f"{label}: retired S2-specific cast classes returned.")

            # Intro handoff: cast teardown must hide both slots immediately before
            # releasing dual-cast geometry. Otherwise the secondary portrait can
            # briefly render at intrinsic image size while the Mission Briefing mounts.
            reset_cast = page.evaluate(
                """() => {
                  pcResetVNCharacters();
                  const state = id => {
                    const el = document.getElementById(id);
                    const r = el.getBoundingClientRect();
                    const cs = getComputedStyle(el);
                    return { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, w:r.width, h:r.height };
                  };
                  return {
                    dual: document.getElementById('vnOverlay')?.classList.contains('pc-dual-character') || false,
                    primary: state('vnCharacter'),
                    secondary: state('vnStudentCharacter')
                  };
                }"""
            )
            if reset_cast["dual"]:
                failures.append(f"{label}: dual-cast layout class survived shared character teardown.")
            for slot_name in ("primary", "secondary"):
                slot = reset_cast[slot_name]
                if slot["display"] != "none" or slot["visibility"] != "hidden" or slot["opacity"] != "0":
                    failures.append(f"{label}: {slot_name} cast slot remains paintable during intro-to-workbench handoff.")

            if width > 700:
                if dual_pixel["primary"]["display"] == "none" or dual_pixel["secondary"]["display"] == "none":
                    failures.append(f"{label}: both cast members should be visible in wide dual-cast mode.")
                if not close(dual_pixel["primary"]["y"], dual_pixel["secondary"]["y"]):
                    failures.append(f"{label}: dual-cast slots do not share a vertical anchor.")
                if not close(dual_pixel["primary"]["h"], dual_pixel["secondary"]["h"]):
                    failures.append(f"{label}: dual-cast slots do not share a common height.")
                if dual_pixel["secondary"]["x"] >= width / 2 or dual_pixel["primary"]["x"] <= width / 2:
                    failures.append(f"{label}: left/right cast-slot assignment is not being honored.")
            else:
                # On phones, only the speaker is drawn and it uses S1's exact
                # vertical/center anchor regardless of which character speaks.
                if dual_pixel["secondary"]["display"] != "none":
                    failures.append(f"{label}: inactive phone cast member should be hidden.")
                if not close(single["primary"]["y"], dual_pixel["primary"]["y"]):
                    failures.append(f"{label}: phone Pixel dual-cast anchor diverges from S1.")

                page.evaluate(
                    """() => {
                      vnSetDialogueCharacter('jordan','neutral','Jordan',[
                        {id:'pixel',slot:'right'}, {id:'jordan',slot:'left'}
                      ]);
                      pcApplyIpadLayout();
                    }"""
                )
                page.wait_for_timeout(520)
                dual_jordan = page.evaluate(cast_state_js)
                if dual_jordan["primary"]["display"] != "none" or dual_jordan["secondary"]["display"] == "none":
                    failures.append(f"{label}: phone speaker swap did not exclusively show Jordan.")
                if not close(single["primary"]["y"], dual_jordan["secondary"]["y"]):
                    failures.append(f"{label}: Jordan phone anchor diverges vertically from S1.")
                if not close(single["primary"]["h"], dual_jordan["secondary"]["h"]):
                    failures.append(f"{label}: Jordan phone slot height diverges from S1.")
                single_center = single["primary"]["x"] + single["primary"]["w"] / 2
                jordan_center = dual_jordan["secondary"]["x"] + dual_jordan["secondary"]["w"] / 2
                if not close(single_center, jordan_center):
                    failures.append(f"{label}: Jordan phone slot is not using S1's horizontal anchor.")

            page.close()

        # Shared activity reuse: Decision 2 and Decision 3 must use the same
        # tagged-detail choice component, and a scenario switch must invalidate
        # stale delayed work before it can repaint the newly selected scenario.
        activity_viewports = {} if args.skip_activities else {
            "activity-desktop": (1600, 1000),
            "activity-phone": (390, 844),
        }
        for label, (width, height) in activity_viewports.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            register_routes(page)
            page.set_content(html, wait_until="domcontentloaded")
            page.wait_for_timeout(700)

            def tagged_choice_state(render_call: str) -> dict:
                page.evaluate(
                    f"""() => {{
                      pcScenarioHasLaunched = true;
                      pcActivateScenario(SCENARIO_INDEX.METACOGNITION, {{ playIntroduction:false }});
                      {render_call};
                    }}"""
                )
                page.wait_for_timeout(260)
                return page.evaluate(
                    """() => {
                      const grid = document.querySelector('.pc-choice-grid--tagged-detail');
                      const card = grid?.querySelector('.pc-choice-card');
                      const marker = card?.querySelector('.pc-choice-marker');
                      const body = card?.querySelector('.pc-choice-body');
                      const rect = el => {
                        const r = el.getBoundingClientRect();
                        return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};
                      };
                      const cardStyle = card ? getComputedStyle(card) : null;
                      const markerStyle = marker ? getComputedStyle(marker) : null;
                      return {
                        exists: Boolean(grid && card && marker && body),
                        className: grid?.className || '',
                        count: grid?.querySelectorAll('.pc-choice-card').length || 0,
                        cardDisplay: cardStyle?.display || '',
                        cardColumns: cardStyle?.gridTemplateColumns || '',
                        markerRadius: markerStyle?.borderRadius || '',
                        marker: marker ? rect(marker) : null,
                        body: body ? rect(body) : null
                      };
                    }"""
                )

            d2 = tagged_choice_state('renderS2EvidenceActivity()')
            d3 = tagged_choice_state('renderS2ThinkingMoveActivity()')
            for state_name, state in (("Decision 2", d2), ("Decision 3", d3)):
                if not state["exists"] or state["count"] != 4:
                    failures.append(f"{label}: {state_name} did not render the shared four-card tagged-detail component.")
                if "pc-choice-grid--tagged-detail" not in state["className"]:
                    failures.append(f"{label}: {state_name} is not using the shared tagged-detail grid class.")
                if state["cardDisplay"] != "grid":
                    failures.append(f"{label}: {state_name} cards are not using the shared grid layout.")
                if width > 480 and state["marker"] and state["body"] and state["marker"]["right"] > state["body"]["x"] + 0.5:
                    failures.append(f"{label}: {state_name} marker overlaps the option title/body.")
            if d2["cardDisplay"] != d3["cardDisplay"] or d2["markerRadius"] != d3["markerRadius"]:
                failures.append(f"{label}: Decision 2 and Decision 3 no longer share the same tagged-detail presentation.")

            page.evaluate(
                """() => {
                  window.__pcGuardedLeak = 0;
                  window.__pcNativeStaleAttempt = 0;
                  pcActivateScenario(SCENARIO_INDEX.METACOGNITION, { playIntroduction:false });
                  pcShowS2JordanRecordedDialogue('grade_compare');
                  pcScheduleScenarioTask(() => {
                    window.__pcGuardedLeak += 1;
                    pcShowS2JordanRecordedDialogue('grade_compare');
                  }, 120, SCENARIO_INDEX.METACOGNITION);
                  setTimeout(() => {
                    window.__pcNativeStaleAttempt += 1;
                    renderS2ThinkingMoveActivity();
                  }, 140);
                  pcActivateScenario(SCENARIO_INDEX.ENGAGEMENT, { playIntroduction:false });
                }"""
            )
            page.wait_for_timeout(520)
            reset_state = page.evaluate(
                """() => ({
                  scenarioIndex,
                  scenarioKey: document.body.dataset.pcScenario || '',
                  guardedLeak: window.__pcGuardedLeak || 0,
                  nativeAttempt: window.__pcNativeStaleAttempt || 0,
                  staleS2Activity: Boolean(document.getElementById('s2ThinkingTitle')),
                  recordingClass: document.getElementById('vnOverlay')?.classList.contains('pc-s2-jordan-recording') || false,
                  overlayActive: document.getElementById('vnOverlay')?.classList.contains('active') || false,
                  staleMountAccepted: mountScenarioActivity({
                    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
                    contentHTML:'<div id=\"pcStaleMountProbe\">stale</div>'
                  })
                })"""
            )
            if reset_state["scenarioIndex"] != 0 or reset_state["scenarioKey"] != "engagement":
                failures.append(f"{label}: scenario switch did not settle on a clean S1 state.")
            if reset_state["guardedLeak"] != 0:
                failures.append(f"{label}: delayed work from S2 survived the scenario-run reset.")
            if reset_state["nativeAttempt"] != 1:
                failures.append(f"{label}: stale-render test did not execute as expected.")
            if reset_state["staleS2Activity"] or reset_state["staleMountAccepted"]:
                failures.append(f"{label}: stale S2 activity was allowed to overwrite S1 after navigation.")
            if reset_state["recordingClass"] or reset_state["overlayActive"]:
                failures.append(f"{label}: VN/Recorded Dialogue presentation leaked into S1 after scenario switch.")

            page.close()

        browser.close()

    if failures:
        print("PromptCraft shared VN regression test FAILED:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(
        f"PromptCraft shared VN regression test passed across {len(active_viewports)} "
        f"viewport profile{'s' if len(active_viewports) != 1 else ''}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
