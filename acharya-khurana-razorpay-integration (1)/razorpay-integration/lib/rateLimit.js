// lib/rateLimit.js
//
// A minimal per-instance rate limiter. Vercel serverless functions are
// stateless across invocations/regions, so this only limits bursts within
// a single warm instance — it is a speed bump, not a real distributed
// rate limit. For production-grade protection, put this behind
// Upstash Redis / Vercel's Edge Config + KV, or Vercel Firewall rules.

const buckets = new Map();

function rateLimit({ key, max = 10, windowMs = 60_000 }) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

function clientKey(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

module.exports = { rateLimit, clientKey };
