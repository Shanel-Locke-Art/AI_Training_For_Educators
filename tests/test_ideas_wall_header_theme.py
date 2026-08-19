#!/usr/bin/env python3
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
wall=(ROOT/'wall.html').read_text(encoding='utf-8')
css=(ROOT/'src/css/pages/ideas-wall.css').read_text(encoding='utf-8')
boot=(ROOT/'src/js/app/bootstrap.js').read_text(encoding='utf-8')
checks={
  'wall has dropdown details': 'class="wall-brand-menu"' in wall,
  'wall uses Babbage mark': 'assets/images/ui/babbage-mark.svg' in wall,
  'wall menu has main menu': '>Main Menu<' in wall,
  'wall menu has audio destination': 'index.html?open=audio' in wall,
  'wall menu has Meet Babbage destination': 'index.html?open=babbage' in wall,
  'wall menu retains Ideas Wall current item': 'wall-brand-menu-ideas' in wall and 'aria-current="page"' in wall,
  'wall header is GFC navy': '#071a36' in css and '#0b2852' in css,
  'wall hero uses blue endpoint': '#0b668f' in css,
  'wall no longer uses old dark green hero endpoint': '#1b563d' not in css,
  'wall Ideas emphasis remains gold': '#6f5104' in css and '#d9a21b' in css,
  'app supports external babbage target': "externalOpenTarget === 'babbage'" in boot,
  'app supports external audio target': "externalOpenTarget === 'audio'" in boot,
}
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+' - '+name)
if not all(checks.values()): raise SystemExit(1)
