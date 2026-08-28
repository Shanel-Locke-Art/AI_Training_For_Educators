#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
s3=(ROOT/'src/js/scenarios/s3-authentic-assessment.js').read_text(encoding='utf-8')
shared=(ROOT/'src/js/scenarios/shared-components.js').read_text(encoding='utf-8')
tracking=(ROOT/'src/js/research/tracking.js').read_text(encoding='utf-8')
css=(ROOT/'src/css/scenarios/shared.css').read_text(encoding='utf-8')
bundle=(ROOT/'runtime/js/promptcraft.bundle.js').read_text(encoding='utf-8')
cssb=(ROOT/'runtime/css/promptcraft.css').read_text(encoding='utf-8')
net=(ROOT/'netlify/functions/babbage.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')

checks={
 'normal ending enters transfer lab': "'s3-final-dialogue': () => s3PlayCastSequence('s3_final_exchange', completeS3CaseAndStartTransfer)" in s3,
 'shared transfer input builder': 'function buildTransferLabInputHTML' in shared and "backLabel = 'Back'" in shared,
 'shared transfer revision builder': 'function buildTransferRevisionWorkbenchHTML' in shared,
 'shared transfer comparison builder': 'function buildTransferComparisonHTML' in shared,
 'human diagnosis precedes Babbage': 'Human diagnosis first' in s3 and 'submitS3TransferDiagnosis' in s3,
 'transfer can be skipped to result': 'Skip Transfer Lab · View result' in s3,
 'five revision dimensions': all(x in s3 for x in ['s3TransferSituation','s3TransferPerformance','s3TransferEvidence','s3TransferReasoning','s3TransferCriteria']),
 'transfer analysis contract': "analysis_type: 's3_transfer_assessment'" in s3 and 'S3_TRANSFER_ASSESSMENT_SCHEMA' in net,
 'print report': 'function pcPrintS3TransferLabReport()' in s3 and 'Assessment Design Analysis' in s3,
 'Ideas Wall explicit idea payload': "type: 'idea'" in s3 and "review_status: 'Needs Review'" in s3,
 'raw assessment excluded from idea payload': 'idea: `${title}\\n\\n${summary}`' in s3,
 'research stores transfer metadata': 's3_transfer_metadata_json' in tracking,
 'research note excludes raw transfer text': 'Raw faculty text deliberately stays out of research saves.' in s3,
 'shared transfer CSS': '.pc-transfer-lab' in css and '.pc-s3-transfer' not in css,
 'cache patch 461 or later': bool(re.search(r'patch=(\d+)', idx)) and int(re.search(r'patch=(\d+)', idx).group(1)) >= 461,
 'receiver unchanged': 'receiver=82' in idx,
}

def js_source_block(text, rel):
    marker=f'/* SOURCE: {rel} */\n'
    start=text.index(marker)+len(marker)
    m=re.search(r'\n;\n/\* SOURCE:', text[start:])
    end=start+m.start() if m else len(text)
    return text[start:end].rstrip()

checks['shared source/bundle sync'] = js_source_block(bundle,'src/js/scenarios/shared-components.js') == shared.rstrip()
checks['s3 source/bundle sync'] = js_source_block(bundle,'src/js/scenarios/s3-authentic-assessment.js') == s3.rstrip()
checks['tracking source/bundle sync'] = js_source_block(bundle,'src/js/research/tracking.js') == tracking.rstrip()

for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+' - '+name)
if not all(checks.values()): raise SystemExit(1)
