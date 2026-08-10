const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/claude.js');

async function run() {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalBase = process.env.ANTHROPIC_BASE_URL;
  const originalModel = process.env.ANTHROPIC_MODEL;
  const originalFetch = global.fetch;

  try {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_BASE_URL;
    delete process.env.ANTHROPIC_MODEL;

    const get = await handler({ httpMethod: 'GET' });
    assert.equal(get.statusCode, 200);
    const healthWithoutKey = JSON.parse(get.body);
    assert.equal(healthWithoutKey.status, 'ok');
    assert.equal(healthWithoutKey.configured, false);
    assert.equal(healthWithoutKey.model, 'claude-sonnet-4-6');
    assert.equal(healthWithoutKey.route, 'anthropic-direct');
    assert.equal(healthWithoutKey.proxy_version, 'V358');

    const noKey = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ max_tokens: 32, messages: [{ role: 'user', content: 'Test' }] })
    });
    assert.equal(noKey.statusCode, 503);

    process.env.ANTHROPIC_API_KEY = 'test-key';

    let lastUrl = '';
    let lastOptions = null;
    global.fetch = async (url, options) => {
      lastUrl = url;
      lastOptions = options;
      return {
        status: 200,
        ok: true,
        text: async () => JSON.stringify({
          id: 'msg_test',
          type: 'message',
          role: 'assistant',
          content: [{ type: 'text', text: 'Connected.' }]
        })
      };
    };

    const direct = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        model: 'retired-client-model',
        max_tokens: 64,
        system: 'Test system',
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });
    assert.equal(direct.statusCode, 200);
    assert.equal(lastUrl, 'https://api.anthropic.com/v1/messages');
    assert.equal(lastOptions.headers['x-api-key'], 'test-key');
    assert.equal(lastOptions.headers['anthropic-version'], '2023-06-01');
    let outbound = JSON.parse(lastOptions.body);
    assert.equal(outbound.model, 'claude-sonnet-4-6');

    process.env.ANTHROPIC_BASE_URL = 'https://gateway.example.test/anthropic/';
    const gatewayHealth = await handler({ httpMethod: 'GET' });
    const gatewayHealthBody = JSON.parse(gatewayHealth.body);
    assert.equal(gatewayHealthBody.route, 'netlify-ai-gateway-or-custom-base');
    assert.equal(gatewayHealthBody.base_url_configured, true);

    const gateway = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        max_tokens: 64,
        messages: [{ role: 'user', content: 'Hello through gateway' }]
      })
    });
    assert.equal(gateway.statusCode, 200);
    assert.equal(lastUrl, 'https://gateway.example.test/anthropic/v1/messages');

    console.log('PromptCraft Claude proxy tests passed.');
  } finally {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;

    if (originalBase === undefined) delete process.env.ANTHROPIC_BASE_URL;
    else process.env.ANTHROPIC_BASE_URL = originalBase;

    if (originalModel === undefined) delete process.env.ANTHROPIC_MODEL;
    else process.env.ANTHROPIC_MODEL = originalModel;

    global.fetch = originalFetch;
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
