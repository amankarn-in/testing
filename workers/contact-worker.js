/**
 * Contact Worker (Cloudflare Worker style)
 *
 * Runtime env vars (secrets):
 * - CONTACT_API_ENDPOINT
 * - CONTACT_API_KEY
 *
 * Non-secret runtime config:
 * - ALLOWED_ORIGINS (comma-separated)
 */

const rateBucket = new Map();
const idempotencyStore = new Map();

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const IDEMPOTENCY_TTL_MS = 10 * 60_000;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

function getAllowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function allowedOrigin(origin, env) {
  if (!origin) return false;
  return getAllowedOrigins(env).includes(origin);
}

function cors(origin) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin'
  };
}

function sanitizeText(value, max = 4000) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function validateBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const payload = {
    requestId: sanitizeText(body.requestId, 120),
    name: sanitizeText(body.name, 120),
    email: sanitizeText(body.email, 160),
    subject: sanitizeText(body.subject, 180),
    message: sanitizeText(body.message, 4000),
    timestamp: sanitizeText(body.timestamp, 80)
  };

  if (!payload.requestId || !payload.name || !payload.email || !payload.subject || !payload.message || !payload.timestamp) {
    return { ok: false, error: 'Missing required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return { ok: false, error: 'Invalid email.' };
  }

  return { ok: true, payload };
}

function rateLimited(clientKey) {
  const now = Date.now();
  const existing = rateBucket.get(clientKey);

  if (!existing || now > existing.resetAt) {
    rateBucket.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_MAX) {
    return true;
  }

  existing.count += 1;
  rateBucket.set(clientKey, existing);
  return false;
}

function getIdempotent(requestId) {
  const now = Date.now();
  const existing = idempotencyStore.get(requestId);
  if (!existing) return null;

  if (now > existing.expiresAt) {
    idempotencyStore.delete(requestId);
    return null;
  }

  return existing;
}

function setIdempotent(requestId, data) {
  idempotencyStore.set(requestId, {
    ...data,
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (url.pathname !== '/contact') {
      return json({ error: 'Not found.' }, 404);
    }

    if (request.method === 'OPTIONS') {
      if (!allowedOrigin(origin, env)) {
        return json({ error: 'Origin not allowed.' }, 403);
      }
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405);
    }

    if (!allowedOrigin(origin, env)) {
      return json({ error: 'Origin not allowed.' }, 403);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return json({ error: 'Rate limit exceeded.' }, 429, cors(origin));
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON.' }, 400, cors(origin));
    }

    const validated = validateBody(body);
    if (!validated.ok) {
      return json({ error: validated.error }, 400, cors(origin));
    }

    const { payload } = validated;

    // Idempotency handling: safe retries return prior success without duplicate forward.
    const existing = getIdempotent(payload.requestId);
    if (existing) {
      console.log({ event: 'contact.submit', requestId: payload.requestId, status: 'duplicate' });
      return json({ ok: true, status: 'duplicate', requestId: payload.requestId }, 200, cors(origin));
    }

    try {
      const upstream = await fetch(env.CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Secret injected server-side only.
          authorization: `Bearer ${env.CONTACT_API_KEY}`,
          // Forward idempotency key for upstream dedupe if supported.
          'x-idempotency-key': payload.requestId
        },
        body: JSON.stringify(payload)
      });

      if (!upstream.ok) {
        // Dead-letter queue placeholder:
        // enqueue payload to durable store/queue for offline reprocessing.
        console.log({ event: 'contact.submit', requestId: payload.requestId, status: 'upstream_error' });
        return json({ error: 'Unable to process message.', retryable: true }, 502, cors(origin));
      }

      setIdempotent(payload.requestId, { status: 'accepted' });
      console.log({ event: 'contact.submit', requestId: payload.requestId, status: 'accepted' });
      return json({ ok: true, status: 'accepted', requestId: payload.requestId }, 200, cors(origin));
    } catch {
      // Dead-letter queue placeholder:
      // enqueue payload to durable store/queue for offline reprocessing.
      console.log({ event: 'contact.submit', requestId: payload.requestId, status: 'network_error' });
      return json({ error: 'Upstream transport failed.', retryable: true }, 502, cors(origin));
    }
  }
};
