const DEFAULT_CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
const PROMPTCRAFT_CLAUDE_PROXY_VERSION = 'V359';

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

function requestId_(event) {
  return (
    event?.headers?.['x-nf-request-id'] ||
    event?.headers?.['X-Nf-Request-Id'] ||
    event?.headers?.['x-request-id'] ||
    `pc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}

exports.handler = async (event = {}) => {
  const requestId = requestId_(event);

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
    console.error(`[PromptCraft Claude] ${requestId} rejected: ANTHROPIC_API_KEY unavailable.`);
    return jsonResponse(503, {
      error: {
        message: 'Claude service is not configured. ANTHROPIC_API_KEY is unavailable to the Netlify Function.'
      },
      proxy_version: PROMPTCRAFT_CLAUDE_PROXY_VERSION
    });
  }

  const rawBody = typeof event.body === 'string' ? event.body : '';
  if (!rawBody || Buffer.byteLength(rawBody, 'utf8') > 100_000) {
    console.warn(
      `[PromptCraft Claude] ${requestId} rejected: ${
        rawBody ? `request too large (${Buffer.byteLength(rawBody, 'utf8')} bytes)` : 'request body missing'
      }.`
    );
    return jsonResponse(rawBody ? 413 : 400, {
      error: { message: rawBody ? 'Request is too large.' : 'Request body is required.' }
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (_error) {
    console.warn(`[PromptCraft Claude] ${requestId} rejected: invalid JSON.`);
    return jsonResponse(400, { error: { message: 'Request body must be valid JSON.' } });
  }

  if (!payload || !Array.isArray(payload.messages) || payload.messages.length === 0) {
    console.warn(`[PromptCraft Claude] ${requestId} rejected: no Claude messages supplied.`);
    return jsonResponse(400, { error: { message: 'At least one Claude message is required.' } });
  }

  // Keep the model server-side so an old browser bundle cannot strand the game
  // on a retired model ID.
  payload.model = DEFAULT_CLAUDE_MODEL;

  const baseUrl = anthropicBaseUrl_();
  const upstreamUrl = `${baseUrl}/v1/messages`;
  const route = anthropicRoute_();
  const startedAt = Date.now();

  console.log(
    `[PromptCraft Claude] ${requestId} start route=${route} model=${payload.model} ` +
    `messages=${payload.messages.length} max_tokens=${payload.max_tokens || 'default'}`
  );

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

    const elapsedMs = Date.now() - startedAt;
    const responseText = await response.text();

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (_error) {
      data = { error: { message: 'Claude returned an unreadable response.' } };
    }

    if (response.ok) {
      const stopReason = data?.stop_reason || 'unknown';
      const inputTokens = data?.usage?.input_tokens ?? 'unknown';
      const outputTokens = data?.usage?.output_tokens ?? 'unknown';
      console.log(
        `[PromptCraft Claude] ${requestId} success status=${response.status} elapsed_ms=${elapsedMs} ` +
        `stop_reason=${stopReason} input_tokens=${inputTokens} output_tokens=${outputTokens}`
      );
    } else {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        responseText.slice(0, 500) ||
        'No provider error message';
      console.error(
        `[PromptCraft Claude] ${requestId} upstream_error status=${response.status} elapsed_ms=${elapsedMs} ` +
        `route=${route} message=${providerMessage}`
      );

      if (data && typeof data === 'object') {
        data.promptcraft_proxy = {
          version: PROMPTCRAFT_CLAUDE_PROXY_VERSION,
          route,
          upstream_status: response.status,
          elapsed_ms: elapsedMs,
          request_id: requestId
        };
      }
    }

    return jsonResponse(response.status, data);
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    console.error(
      `[PromptCraft Claude] ${requestId} network_error elapsed_ms=${elapsedMs} route=${route}`,
      error
    );

    return jsonResponse(502, {
      error: {
        message: `Claude proxy could not reach ${route}.`
      },
      promptcraft_proxy: {
        version: PROMPTCRAFT_CLAUDE_PROXY_VERSION,
        route,
        elapsed_ms: elapsedMs,
        request_id: requestId
      }
    });
  }
};
