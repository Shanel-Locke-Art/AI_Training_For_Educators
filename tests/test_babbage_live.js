const assert = require('node:assert/strict');

const baseUrl = String(process.argv[2] || process.env.PROMPTCRAFT_URL || 'https://promptcraft-test.netlify.app').replace(/\/+$/, '');
const runContracts = process.argv.includes('--contracts');
const endpoint = `${baseUrl}/.netlify/functions/babbage`;

const contractCases = [
  ['scenario1', 'Return a concise Scenario 1 analysis.'],
  ['s2_draft', 'Create a short metacognition reflection activity with one deliberate weakness.'],
  ['s2_review', 'Review a repaired metacognition reflection activity.'],
  ['s3_draft', 'Create a short authentic assessment with one deliberate weakness.'],
  ['s3_review', 'Review a repaired authentic assessment.'],
  ['s4_draft', 'Create synchronous and asynchronous participation paths with one deliberate weakness.'],
  ['s4_review', 'Review a repaired equivalent-participation plan.'],
  ['s5_brief', 'Create a four-claim closed-evidence brief.'],
  ['s5_review', 'Review a corrected evidence claim.']
];

async function getJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch (_error) {}
  if (!response.ok) throw new Error(`${response.status} ${text}`);
  return body;
}

async function main() {
  const health = await getJson(endpoint);
  assert.equal(health.status, 'ok');
  assert.equal(health.service, 'PromptCraft Babbage proxy');
  assert.equal(health.provider, 'openai');
  assert.equal(health.proxy_version, 'V369');
  assert.equal(health.configured, true, 'OPENAI_API_KEY is not available to the deployed function.');
  assert.ok(Array.isArray(health.supported_contracts));
  console.log(`Health OK: ${health.proxy_version} / ${health.model}`);
  console.log(`Contracts: ${health.supported_contracts.join(', ')}`);

  if (!runContracts) {
    console.log('GET-only smoke test passed. Add --contracts to make live model calls for every structured contract.');
    return;
  }

  for (const [analysisType, instruction] of contractCases) {
    const body = await getJson(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysis_type: analysisType,
        system: 'You are Babbage. This is a deployment smoke test. Follow the requested strict schema and keep all text brief.',
        messages: [{ role: 'user', content: instruction }],
        max_output_tokens: 1800
      })
    });
    assert.equal(body.status, 'ok');
    assert.equal(body.analysis_type, analysisType === 'scenario1' ? 'scenario1' : analysisType);
    assert.ok(body.analysis && typeof body.analysis === 'object');
    console.log(`${analysisType}: OK (${body.elapsed_ms} ms, ${body.analysis_schema})`);
  }
}

main().catch(error => {
  console.error(`Live Babbage smoke test failed: ${error.message}`);
  process.exitCode = 1;
});
