const DEFAULT_CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
const PROMPTCRAFT_CLAUDE_PROXY_VERSION = 'V358';

const CORS_HEADERS = Object.freeze({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

function anthropicBaseUrl_() {
  return String(process.env.ANTHROPIC_BASE_URL || DEFAULT_ANTHROPIC_BASE_URL).replace(/\/+$/, '');
}

function anthropicRoute_() {
  return anthropicBaseUrl_() === DEFAULT_ANTHROPIC_BASE_URL
    ? 'anthropic-direct'
    : 'netlify-ai-gateway-or-custom-base';
}

exports.handler = async (event = {}) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return jsonResponse(200, {
      status: 'ok',
      service: 'PromptCraft Claude proxy',
      proxy_version: PROMPTCRAFT_CLAUDE_PROXY_VERSION,
      configured: Boolean(process.env.ANTHROPIC_API_KEY),
      model: DEFAULT_CLAUDE_MODEL,
      route: anthropicRoute_(),
      base_url_configured: Boolean(process.env.ANTHROPIC_BASE_URL),
      message: process.env.ANTHROPIC_API_KEY
        ? `Claude proxy is reachable and configured through ${anthropicRoute_()}.`
        : 'Claude proxy is reachable, but no Anthropic/Netlify AI Gateway API key is available.'
    });
  }

  if (event.httpMethod !== 'POST') {
    return {
      ...jsonResponse(405, { error: { message: 'Method not allowed.' } }),
      headers: { ...jsonResponse(405, {}).headers, Allow: 'GET, POST, OPTIONS' }
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse(503, {
      error: {
        message: 'Claude service is not configured. ANTHROPIC_API_KEY is unavailable to the Netlify Function.'
      },
      proxy_version: PROMPTCRAFT_CLAUDE_PROXY_VERSION
    });
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

  // Keep the model server-side. PromptCraft currently targets Sonnet 4.6.
  // If ANTHROPIC_MODEL is set in Netlify, that supported model takes precedence.
  payload.model = DEFAULT_CLAUDE_MODEL;

  const baseUrl = anthropicBaseUrl_();
  const upstreamUrl = `${baseUrl}/v1/messages`;

  try {
    const response = await fetch(upstreamUrl, {
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

    // Keep the provider response intact, but add safe diagnostic metadata when
    // there is an error so PromptCraft can report the real backend problem.
    if (!response.ok && data && typeof data === 'object') {
      data.promptcraft_proxy = {
        version: PROMPTCRAFT_CLAUDE_PROXY_VERSION,
        route: anthropicRoute_(),
        upstream_status: response.status
      };
    }

    return jsonResponse(response.status, data);
  } catch (error) {
    console.error('[PromptCraft] Claude proxy request failed:', error);
    return jsonResponse(502, {
      error: {
        message: `Claude proxy could not reach ${anthropicRoute_()}.`
      },
      promptcraft_proxy: {
        version: PROMPTCRAFT_CLAUDE_PROXY_VERSION,
        route: anthropicRoute_()
      }
    });
  }
};
