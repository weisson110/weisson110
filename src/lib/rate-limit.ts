/**
 * Rate Limiter – Task 6
 * Mock Upstash Redis rate limiting, in-memory fallback.
 * In production, replace with @upstash/ratelimit + Redis.
 * 
 * Usage: await checkRateLimit(apiKey, 100) -> { success, remaining }
 */

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

export async function checkRateLimit(key: string, limit = 600, windowMs = 60_000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// Cleanup old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((v, k) => {
      if (now > v.resetAt) store.delete(k);
    });
  }, 60_000);
}
