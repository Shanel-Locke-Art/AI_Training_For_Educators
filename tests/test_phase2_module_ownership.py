#!/usr/bin/env python3
"""Guard Phase 2 JavaScript ownership and the current Scenario 1 route."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative_path: str) -> str:
    return (ROOT / relative_path).read_text(encoding="utf-8")


manifest_data = json.loads(read("src/js/manifest.json"))
manifest = manifest_data["bundle"]
shared = read("src/js/scenarios/shared-components.js")
shared_shell = read("src/js/scenarios/shared-shell.js")
s1_evidence = read("src/js/scenarios/s1-canvas-evidence.js")
s1_engagement = read("src/js/scenarios/s1-engagement.js")
action_routing = read("src/js/app/action-routing.js")
development_tools = read("src/js/dev/development-tools.js")
registry = read("src/js/scenarios/registry.js")
runtime = read("src/js/app/scenario-runtime.js")

# Shared code loads before scenario owners. Action routing loads after all
# handlers it delegates to and before bootstrap installs the application.
assert manifest.index("scenarios/shared-shell.js") < manifest.index("scenarios/shared-components.js")
assert manifest.index("scenarios/shared-shell.js") < manifest.index("scenarios/s1-canvas-evidence.js")
assert manifest.index("scenarios/s1-canvas-evidence.js") < manifest.index("scenarios/shared-components.js")
assert manifest.index("scenarios/s1-canvas-evidence.js") < manifest.index("scenarios/registry.js")
assert manifest.index("scenarios/s1-engagement.js") < manifest.index("app/action-routing.js")
assert manifest.index("app/action-routing.js") < manifest.index("app/bootstrap.js")

# Scenario 1 Canvas evidence and transfer behavior has one production owner.
for symbol in (
    "PC_S1_PREVIEW_CASES",
    "renderS1ContentAvalanchePreview",
    "pcOpenS1EvidenceModal",
    "pcAnalyzeS1WeekPlan",
):
    assert symbol in s1_evidence, f"missing S1 owner symbol: {symbol}"
    assert symbol not in shared, f"S1 symbol leaked into shared owner: {symbol}"

# Reusable builders remain scenario-neutral.
for symbol in (
    "buildScenarioProgressHTML",
    "buildDragSortBoardHTML",
    "buildGuidedRepairWorkspaceHTML",
    "mountScenarioActivity",
):
    assert symbol in shared, f"missing shared builder: {symbol}"

for symbol in ("getScenarioUI", "buildScenarioMissionHTML", "renderScenarioPlaceholder"):
    assert symbol in shared_shell, f"missing shared shell helper: {symbol}"

# Generic navigation and development actions no longer belong to S1 gameplay.
for action in ("'switch-scenario'", "'navigate-next'"):
    assert action in action_routing, f"missing routed action: {action}"
    assert action not in s1_engagement, f"generic action remains in S1 owner: {action}"

for action in ("'dev-go-scenario'", "'dev-fill-s1-transfer'", "'dev-reset-progress'"):
    assert action in development_tools, f"missing development action: {action}"
    assert action not in action_routing, f"development action leaked into app routing: {action}"
    assert action not in s1_engagement, f"development action remains in S1 owner: {action}"

for action in ("'send-guided'", "'revise-s1'", "'show-s1-reflection'"):
    assert action in s1_engagement, f"S1 action moved out of its scenario owner: {action}"

# The current registry/runtime path points at the Canvas evidence implementation,
# not either legacy prototype. This is a deterministic route guard; browser
# interaction evidence is still required before deleting the dormant modules.
assert "'content-avalanche-preview': () => renderS1ContentAvalanchePreview()" in registry
assert "rendererKey: 'content-avalanche-preview'" in registry
assert "renderS1ContentAvalanchePreview" not in runtime
assert "renderS1CourseDesignStandby" not in registry
assert "rendererKey: 'guided-builder'" not in registry

retained_dormant = {item["source"] for item in manifest_data["retained_dormant_modules"]}
assert retained_dormant == {
    "scenarios/s1-course-design.js",
    "scenarios/s1-engagement.js",
}

print("Phase 2 module ownership and current S1 route contract passed.")
