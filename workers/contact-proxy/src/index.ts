export interface Env {
  // Secret: upstream API endpoint that receives contact messages.
  CONTACT_API_ENDPOINT: string;
  // Secret: bearer token used only server-side.
  CONTACT_API_KEY: string;
  // Non-secret: comma-separated allowed browser origins.
  ALLOWED_ORIGINS?: string;
}

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Placeholder in-memory rate limit storage.
// Replace with Durable Objects/KV for strict production limits.
const ipBucket = new Map<string, { count: number; resetAt: number }>();

const jsonResponse = (data: Record<string, unknown>, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...headers
    }
  });

const getAllowedOrigins = (env: Env): string[] =>
  (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin: string | null, env: Env): boolean => {
  if (!origin) return false;
  return getAllowedOrigins(env).includes(origin);
};

const corsHeaders = (origin: string) => ({
  'access-control-allow-origin': origin,
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  'vary': 'Origin'
});

const sanitizeString = (value: unknown, maxLength: number) =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);

const validatePayload = (payload: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } => {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const body = payload as Record<string, unknown>;
  const data: ContactPayload = {
    name: sanitizeString(body.name, 120),
    email: sanitizeString(body.email, 160),
    subject: sanitizeString(body.subject, 180),
    message: sanitizeString(body.message, 4000)
  };

  if (!data.name || !data.email || !data.subject || !data.message) {
    return { ok: false, error: 'All fields are required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { ok: false, error: 'Invalid email.' };
  }

  return { ok: true, data };
};

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const bucket = ipBucket.get(ip);

  if (!bucket || now > bucket.resetAt) {
    ipBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  ipBucket.set(ip, bucket);
  return false;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/contact') {
      return jsonResponse({ error: 'Not found.' }, 404);
    }

    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin, env)) {
        return jsonResponse({ error: 'Origin not allowed.' }, 403);
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin as string) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    if (!isAllowedOrigin(origin, env)) {
      return jsonResponse({ error: 'Origin not allowed.' }, 403);
    }

    const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (isRateLimited(clientIp)) {
      return jsonResponse({ error: 'Too many requests. Please retry later.' }, 429, corsHeaders(origin as string));
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON.' }, 400, corsHeaders(origin as string));
    }

    const validated = validatePayload(payload);
    if (!validated.ok) {
      return jsonResponse({ error: validated.error }, 400, corsHeaders(origin as string));
    }

    try {
      const upstreamResponse = await fetch(env.CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Secret is added here only in the serverless runtime.
          'authorization': `Bearer ${env.CONTACT_API_KEY}`
        },
        body: JSON.stringify(validated.data)
      });

      if (!upstreamResponse.ok) {
        return jsonResponse({ error: 'Unable to process message.' }, 502, corsHeaders(origin as string));
      }

      // Return sanitized client-facing response only.
      return jsonResponse(
        { ok: true, message: 'Message received.' },
        200,
        corsHeaders(origin as string)
      );
    } catch {
      return jsonResponse({ error: 'Upstream request failed.' }, 502, corsHeaders(origin as string));
    }
  }
};
