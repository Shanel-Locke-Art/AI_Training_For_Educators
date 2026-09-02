'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const tracking = fs.readFileSync(path.join(ROOT, 'src/js/research/tracking.js'), 'utf8');
const config = fs.readFileSync(path.join(ROOT, 'src/js/app/config-and-assets.js'), 'utf8');
const bundle = fs.readFileSync(path.join(ROOT, 'runtime/js/promptcraft.bundle.js'), 'utf8');

for (const source of [tracking, bundle]) {
  assert.match(source, /function pcCreateTrackingEventId\s*\(/);
  assert.match(source, /function pcTrackingActivityId\s*\(/);
  assert.match(source, /function pcTrackingScoreScaleMax\s*\(/);
  assert.match(source, /event_id:\s*pcCreateTrackingEventId\s*\(/);
  assert.match(source, /activity_id:\s*activityId/);
  assert.match(source, /score_scale_max:\s*scoreScaleMax/);
  assert.match(source, /s1_evidence_analysis_complete[\s\S]{0,300}return 3/);
}

assert.match(config, /event_id:\s*pcCreateTrackingEventId\s*\(/);
assert.match(config, /activity_id:\s*'receiver-connection-test'/);
assert.match(config, /score_scale_max:\s*5/);
assert.doesNotMatch(tracking, /schema_version:\s*['"]V122/);
assert.match(tracking, /schema_version:\s*PC_APP_SCHEMA_VERSION/);

console.log('PromptCraft Phase 5 tracking identity, activity, and score-scale contract passed.');
