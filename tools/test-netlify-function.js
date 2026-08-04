#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/claude.js');

async function run() {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;

  try {
    delete process.env.ANTHROPIC_API_KEY;

    const options = await handler({ httpMethod: 'OPTIONS' });
    assert.equal(options.statusCode, 204);
    assert.equal(options.headers['Access-Control-Allow-Methods'], 'POST, OPTIONS');

    const get = await handler({ httpMethod: 'GET' });
    assert.equal(get.statusCode, 405);
    assert.equal(get.headers.Allow, 'POST, OPTIONS');

    const unavailable = await handler({ httpMethod: 'POST', body: '{}' });
    assert.equal(unavailable.statusCode, 503);

    process.env.ANTHROPIC_API_KEY = 'test-key';

    const empty = await handler({ httpMethod: 'POST', body: '' });
    assert.equal(empty.statusCode, 400);

    const malformed = await handler({ httpMethod: 'POST', body: '{' });
    assert.equal(malformed.statusCode, 400);

    const noMessages = await handler({ httpMethod: 'POST', body: '{"messages":[]}' });
    assert.equal(noMessages.statusCode, 400);

    const oversized = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'x'.repeat(100_001) }] })
    });
    assert.equal(oversized.statusCode, 413);

    global.fetch = async (url, options) => {
      assert.equal(url, 'https://api.anthropic.com/v1/messages');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers['x-api-key'], 'test-key');
      assert.equal(options.headers['anthropic-version'], '2023-06-01');
      return {
        status: 429,
        text: async () => JSON.stringify({ error: { message: 'Rate limited.' } })
      };
    };

    const upstream = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Test' }] })
    });
    assert.equal(upstream.statusCode, 429);
    assert.equal(JSON.parse(upstream.body).error.message, 'Rate limited.');
    assert.equal(upstream.headers['Cache-Control'], 'no-store');

    global.fetch = async () => {
      throw new Error('network unavailable');
    };
    console.error = () => {};
    const failed = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Test' }] })
    });
    assert.equal(failed.statusCode, 502);
  } finally {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  }

  console.log('PromptCraft Claude proxy tests passed.');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
