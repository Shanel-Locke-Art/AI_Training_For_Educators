#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
terminal=(ROOT/'src/js/ui/babbage-terminal.js').read_text(encoding='utf-8')
s2=(ROOT/'src/js/scenarios/s2-metacognition.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'src/css/responsive/final-overrides.css').read_text(encoding='utf-8')
bundle=(ROOT/'runtime/js/promptcraft.bundle.js').read_text(encoding='utf-8')
cssb=(ROOT/'runtime/css/promptcraft.css').read_text(encoding='utf-8')

checks={
 'shared print function': 'function pcPrintCurrentBabbageReport()' in terminal,
 'print uses structured report': "#babbageTerminalOutput .analysis-report" in terminal,
 'print includes submitted repair context': 'Repair brief submitted' in terminal,
 'print/save action registered': "'print-babbage-report': () => pcPrintCurrentBabbageReport()" in terminal,
 'Ideas Wall action registered': "'open-ideas-wall': () => window.open('wall.html'" in terminal,
 'Ideas Wall is on main menu': 'data-pc-action="open-ideas-wall"' in idx,
 'S1 completed diagnosis opts into print': "printLabel: 'Print / Save PDF'" in terminal,
 'S2 completed repair diagnosis opts into print': "printLabel: 'Print / Save PDF'" in s2,
 'S2 intermediate draft does not opt into print': s2.count("printLabel: 'Print / Save PDF'") == 1,
 'mobile completed diagnosis uses three controls': ':has(.babbage-print-btn)' in css,
 'print includes GFC logo': 'great-falls-college-logo.jpg' in terminal,
 'print uses GFC navy': '--navy:#112650' in terminal,
 'print uses GFC gold': '--gold:#e6a51d' in terminal,
 'print is document-first not CRT clone': 'Babbage Analysis Report' in terminal and 'Diagnostic findings' in terminal and 'reportClone.outerHTML' not in terminal,
 'print waits for logo before print': 'Promise.all(images.map' in terminal,
 'print replaces about:blank URL': "printUrl.hash = 'babbage-analysis-report'" in terminal,
 'app build stays receiver-compatible V429': 'runtime/js/promptcraft.bundle.js?v=429&amp;patch=443&amp;receiver=82' in idx,
 'compiled JS contains print feature': 'function pcPrintCurrentBabbageReport()' in bundle,
 'compiled CSS contains print control rule': ':has(.babbage-print-btn)' in cssb,
}

def source_block(text, rel):
    marker=f'/* SOURCE: {rel} */\n'
    start=text.index(marker)+len(marker)
    m=re.search(r'\n;\n/\* SOURCE:', text[start:])
    end=start+m.start() if m else len(text)
    return text[start:end].rstrip()

checks['Babbage terminal source/bundle synchronized'] = source_block(bundle,'src/js/ui/babbage-terminal.js') == terminal.rstrip()
checks['S2 source/bundle synchronized'] = source_block(bundle,'src/js/scenarios/s2-metacognition.js') == s2.rstrip()
css_marker='/* SOURCE: src/css/responsive/final-overrides.css */\n'
css_start=cssb.index(css_marker)+len(css_marker)
css_next=cssb.find('\n/* SOURCE:', css_start)
css_end=css_next if css_next != -1 else len(cssb)
checks['responsive CSS source/bundle synchronized'] = cssb[css_start:css_end].rstrip() == css.rstrip()

for name, ok in checks.items():
    print(('PASS' if ok else 'FAIL') + ' - ' + name)
if not all(checks.values()):
    raise SystemExit(1)
