const LIMITER_WINDOW_SECONDS = Number(process.env.CONTACT_FORM_RATE_LIMIT_WINDOW_SECONDS ?? '60');
const LIMITER_MAX_REQUESTS = Number(process.env.CONTACT_FORM_RATE_LIMIT_MAX ?? '5');

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

const createFallbackResult = (): RateLimitResult => ({
  allowed: true,
  remaining: LIMITER_MAX_REQUESTS,
  reset: LIMITER_WINDOW_SECONDS
});

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const getResultValue = (entry: unknown): number => {
  if (typeof entry === 'number') {
    return entry;
  }

  if (typeof entry === 'string') {
    const parsed = Number(entry);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (entry && typeof entry === 'object' && 'result' in (entry as Record<string, unknown>)) {
    const value = (entry as Record<string, unknown>).result;

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
  }

  return 0;
};

const contactRateLimiter = {
  async limit(identifier: string): Promise<RateLimitResult> {
    if (!REST_URL || !REST_TOKEN) {
      return createFallbackResult();
    }

    const key = `ratelimit:contact:${encodeURIComponent(identifier)}`;

    try {
      const response = await fetch(`${REST_URL}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REST_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, LIMITER_WINDOW_SECONDS],
          ['PTTL', key]
        ])
      });

      if (!response.ok) {
        console.error('Rate limit request failed:', response.status, response.statusText);
        return createFallbackResult();
      }

      const data = (await response.json()) as unknown[];
      const currentCount = getResultValue(data[0]);
      const ttlMilliseconds = getResultValue(data[2]);

      const remaining = Math.max(0, LIMITER_MAX_REQUESTS - currentCount);
      const allowed = currentCount <= LIMITER_MAX_REQUESTS;
      const reset = ttlMilliseconds > 0 ? Math.ceil(ttlMilliseconds / 1000) : LIMITER_WINDOW_SECONDS;

      return {
        allowed,
        remaining,
        reset
      };
    } catch (error) {
      console.error('Unexpected error while executing rate limit request:', error);
      return createFallbackResult();
    }
  }
};

export { contactRateLimiter };
