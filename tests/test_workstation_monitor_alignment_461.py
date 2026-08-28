#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
work=(ROOT/'src/js/ui/workstation-layout.js').read_text(encoding='utf-8')
analysis=(ROOT/'src/js/ui/completed-analysis-layout.js').read_text(encoding='utf-8')
bundle=(ROOT/'runtime/js/promptcraft.bundle.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')

checks={
 'shared measured glass constant': all(x in work for x in ["left: '22.2%'","top: '12.85%'","width: '40.3%'","height: '45.45%'"]),
 'prediction reuses glass constant': 'const PC_WIDE_PREDICTION_SCREEN_GEOMETRY = PC_WORKSTATION_MONITOR_GLASS_GEOMETRY;' in work,
 'completed analysis reuses glass constant': 'const PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY = PC_WORKSTATION_MONITOR_GLASS_GEOMETRY;' in analysis,
 'stale too-wide analysis width removed': "width: '42.2%'" not in analysis,
 'bundle has shared geometry': 'PC_WORKSTATION_MONITOR_GLASS_GEOMETRY' in bundle and "width: '40.3%'" in bundle,
}
# The cache patch only needs to be at or past 461 (when this fix shipped), not
# pinned to exactly 461, since it keeps advancing on every later release.
_patch_match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", idx)
checks['cache patch 461 or later'] = bool(_patch_match) and int(_patch_match.group(1)) >= 461

def source_block(rel):
    marker=f'/* SOURCE: {rel} */\n'
    start=bundle.index(marker)+len(marker)
    m=re.search(r'\n;\n/\* SOURCE:', bundle[start:])
    end=start+m.start() if m else len(bundle)
    return bundle[start:end].rstrip()
checks['workstation source/bundle sync']=source_block('src/js/ui/workstation-layout.js')==work.rstrip()
checks['completed analysis source/bundle sync']=source_block('src/js/ui/completed-analysis-layout.js')==analysis.rstrip()

for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+' - '+name)
if not all(checks.values()): raise SystemExit(1)
