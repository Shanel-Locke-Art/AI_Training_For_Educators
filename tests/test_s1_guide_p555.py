from pathlib import Path

root = Path(__file__).resolve().parents[1]
s1 = (root / 'src/js/scenarios/s1-start-with-learning.js').read_text(encoding='utf-8')
registry = (root / 'src/js/scenarios/registry.js').read_text(encoding='utf-8')
index = (root / 'index.html').read_text(encoding='utf-8')

required = [
    'Build Step 1 of My Course Guide',
    'Step 1 · Make the Learning Path Visible',
    'Why this matters',
    'What you built',
    'Babbage note for your guide',
    'Use this in your own Canvas course',
    'Course-design connection',
    'Try this with AI',
    'Add to My Guide',
    'Revise my module first',
    "data-pc-action=\"s1-learning-reflect-overview\"",
    "guide: pcLoadS1Guide()",
    'pcSaveS1Guide()',
]
for text in required:
    assert text in s1, f'missing S1 guide contract: {text}'

assert "normalized === SCENARIO_INDEX.CONTENT_AVALANCHE" in registry
for i in range(1, 8):
    marker = f'data-pc-scenario-index="{i}" disabled aria-disabled="true"'
    assert marker in index, f'scenario {i+1} tab is not locked in normal play'

contract = root / 'docs/PROMPTCRAFT_GAME_LOOP_CONTRACT.md'
assert contract.exists(), 'game-loop contract document missing'
print('P555 S1 guide-builder and scenario-lock contract passed.')
