#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
vn=(ROOT/'functions/app-vn.js').read_text(encoding='utf-8')
proto=(ROOT/'functions/app-scenario-prototypes.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/120-late-responsive.css').read_text(encoding='utf-8')
bundle=(ROOT/'functions/app.bundle.js').read_text(encoding='utf-8')
cssb=(ROOT/'styles/promptcraft.css').read_text(encoding='utf-8')

checks={
 'shared print function': 'function pcPrintCurrentBabbageReport()' in vn,
 'print uses structured report': "#claudeTerminalOutput .analysis-report" in vn,
 'print includes teacher prompt/repair': 'Your prompt / repair' in vn,
 'print/save action registered': "'print-babbage-report': () => pcPrintCurrentBabbageReport()" in vn,
 'Ideas Wall action registered': "'open-ideas-wall': () => window.open('wall.html'" in vn,
 'Ideas Wall is on main menu': 'data-pc-action="open-ideas-wall"' in idx,
 'S1 completed diagnosis opts into print': "printLabel: 'Print / Save PDF'" in vn,
 'S2 completed repair diagnosis opts into print': "printLabel: 'Print / Save PDF'" in proto,
 'S2 intermediate draft does not opt into print': proto.count("printLabel: 'Print / Save PDF'") == 1,
 'mobile completed diagnosis uses three controls': ':has(.claude-print-btn)' in css,
 'app build stays receiver-compatible V429': 'app.bundle.js?v=429&amp;patch=430&amp;receiver=79' in idx,
 'compiled JS contains print feature': 'function pcPrintCurrentBabbageReport()' in bundle,
 'compiled CSS contains print control rule': ':has(.claude-print-btn)' in cssb,
}

def source_block(text, rel):
    marker=f'/* SOURCE: {rel} */\n'
    start=text.index(marker)+len(marker)
    m=re.search(r'\n;\n/\* SOURCE:', text[start:])
    end=start+m.start() if m else len(text)
    return text[start:end].rstrip()

checks['app-vn source/bundle synchronized'] = source_block(bundle,'functions/app-vn.js') == vn.rstrip()
checks['scenario prototype source/bundle synchronized'] = source_block(bundle,'functions/app-scenario-prototypes.js') == proto.rstrip()
marker='/* SOURCE: styles/120-late-responsive.css */\n'
checks['responsive CSS source/bundle synchronized'] = cssb.split(marker,1)[1].rstrip() == css.rstrip()

for name, ok in checks.items():
    print(('PASS' if ok else 'FAIL') + ' - ' + name)
if not all(checks.values()):
    raise SystemExit(1)
