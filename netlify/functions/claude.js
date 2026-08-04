const CORS_HEADERS = Object.freeze({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store'
});

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event = {}) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      ...jsonResponse(405, { error: { message: 'Method not allowed.' } }),
      headers: { ...jsonResponse(405, {}).headers, Allow: 'POST, OPTIONS' }
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse(503, { error: { message: 'Claude service is not configured.' } });
  }

  const rawBody = typeof event.body === 'string' ? event.body : '';
  if (!rawBody || Buffer.byteLength(rawBody, 'utf8') > 100_000) {
    return jsonResponse(rawBody ? 413 : 400, {
      error: { message: rawBody ? 'Request is too large.' : 'Request body is required.' }
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (_error) {
    return jsonResponse(400, { error: { message: 'Request body must be valid JSON.' } });
  }

  if (!payload || !Array.isArray(payload.messages) || payload.messages.length === 0) {
    return jsonResponse(400, { error: { message: 'At least one Claude message is required.' } });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (_error) {
      data = { error: { message: 'Claude returned an unreadable response.' } };
    }

    return jsonResponse(response.status, data);
  } catch (error) {
    console.error('[PromptCraft] Claude proxy request failed:', error);
    return jsonResponse(502, { error: { message: 'Claude is temporarily unavailable.' } });
  }
};
