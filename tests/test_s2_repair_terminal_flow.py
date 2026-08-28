#!/usr/bin/env python3
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
proto = (ROOT/'src/js/scenarios/s2-metacognition.js').read_text()
shared = (ROOT/'src/js/scenarios/shared-components.js').read_text()
bundle = (ROOT/'runtime/js/promptcraft.bundle.js').read_text()
css = (ROOT/'runtime/css/promptcraft.css').read_text()
idx = (ROOT/'index.html').read_text()

# Read the live cache-buster patch number instead of hardcoding one, since it
# advances on every release.
_patch_match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", idx)
assert _patch_match, "Could not find promptcraft.css patch marker in index.html"
_patch = _patch_match.group(1)

checks = {
  'S2 requests shared full-width preview': "previewFullWidth: true" in proto,
  'shared workspace supports full-width footer': 'pc-guided-repair-footer' in shared and 'previewFullWidth = false' in shared,
  'inline review feedback removed': "panelId: 's2RepairFeedback'" not in proto,
  'loading terminal used before review request': "showBabbageConsultOverlay('Repair review'" in proto,
  'repair review maps to diagnostic sections': 'pcS2BuildRepairReviewDiagnosticText' in proto,
  'shared analysis report shown after review': 'showBabbageTerminalReport({' in proto,
  'final result waits for terminal Continue': 'onClose: () =>' in proto and 'renderS2FinalComparison();' in proto,
  'compiled bundle synchronized': all(x in bundle for x in ['previewFullWidth: true','pcS2BuildRepairReviewDiagnosticText','pc-guided-repair-footer']),
  'compiled CSS has full-width footer': '.pc-guided-repair-layout--full-preview .pc-guided-repair-footer' in css,
  'V429 cache/query markers current': f'runtime/css/promptcraft.css?v=429&patch={_patch}' in idx and f'runtime/js/promptcraft.bundle.js?v=429&amp;patch={_patch}&amp;receiver=82' in idx,
}
failed=[k for k,v in checks.items() if not v]
for k,v in checks.items(): print(('PASS' if v else 'FAIL'), k)
if failed: raise SystemExit('Failed: '+', '.join(failed))
