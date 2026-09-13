/**
 * Rate limiter for the public API.
 *
 * Uses Upstash Redis when configured (production).
 * Falls back to a simple in-process sliding window in dev / when env vars are absent.
 *
 * Why this pattern:
 * - Upstash is edge-compatible and globally distributed
 * - The in-process fallback means local dev and CI require zero extra infra
 * - Both paths share the same interface so the route handler never knows the difference
 */

// ─── In-process fallback (dev / no Redis) ────────────────────────────────────

export const inProcessCounts = new Map<string, { count: number; resetAt: number }>();
export const MAP_CLEANUP_THRESHOLD = 500;
const IN_PROCESS_WINDOW_MS = 60_000; // 1 minute

export function cleanupExpiredInProcessEntries(now: number = Date.now()): number {
  let cleaned = 0;
  for (const [k, record] of inProcessCounts.entries()) {
    if (record.resetAt <= now) {
      inProcessCounts.delete(k);
      cleaned++;
    }
  }
  return cleaned;
}

function inProcessRateLimit(key: string, limit: number): RateLimitResult {
  const now = Date.now();

  // Bounded deterministic sweep when size exceeds threshold
  if (inProcessCounts.size >= MAP_CLEANUP_THRESHOLD) {
    cleanupExpiredInProcessEntries(now);
  }

  const record = inProcessCounts.get(key);

  if (!record || record.resetAt <= now) {
    const resetAt = now + IN_PROCESS_WINDOW_MS;
    inProcessCounts.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: limit - 1,
      limit,
      reset: Math.ceil(resetAt / 1000),
    };
  }

  record.count++;
  const remaining = Math.max(0, limit - record.count);
  return {
    success: record.count <= limit,
    remaining,
    limit,
    reset: Math.ceil(record.resetAt / 1000),
  };
}

// ─── Upstash singletons (lazy-initialized on first use) ──────────────────────

let _standardRatelimit: import('@upstash/ratelimit').Ratelimit | null = null;
let _expensiveRatelimit: import('@upstash/ratelimit').Ratelimit | null = null;

async function getStandardRatelimit(): Promise<import('@upstash/ratelimit').Ratelimit> {
  if (_standardRatelimit) return _standardRatelimit;
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');
  _standardRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'gfp_rl_std',
  });
  return _standardRatelimit;
}

async function getExpensiveRatelimit(): Promise<import('@upstash/ratelimit').Ratelimit> {
  if (_expensiveRatelimit) return _expensiveRatelimit;
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');
  _expensiveRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    prefix: 'gfp_rl_exp',
  });
  return _expensiveRatelimit;
}

// ─── Public interface ─────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;
}

/**
 * Standard RFC headers for rate limiting and deprecation signaling.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const nowSeconds = Math.ceil(Date.now() / 1000);
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
    'RateLimit-Reset': String(result.reset),
    'Sunset': 'Wed, 01 Sep 2027 00:00:00 GMT',
  };
  if (!result.success) {
    headers['Retry-After'] = String(Math.max(1, result.reset - nowSeconds));
  }
  return headers;
}

/**
 * Check rate limit for a given key.
 * - Standard operations: 60 requests/minute
 * - Expensive operations (`expensive:...` prefix): 20 requests/minute
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const isExpensive = key.startsWith('expensive:');
  const maxLimit = isExpensive ? 20 : 60;

  // Use Upstash when both env vars are present
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const ratelimit = isExpensive
        ? await getExpensiveRatelimit()
        : await getStandardRatelimit();
      const result = await ratelimit.limit(key);
      const resetInSeconds = result.reset
        ? (result.reset > 1_000_000_000_000 ? Math.ceil(result.reset / 1000) : result.reset)
        : Math.ceil((Date.now() + 60_000) / 1000);
      return {
        success: result.success,
        remaining: result.remaining,
        limit: maxLimit,
        reset: resetInSeconds,
      };
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis unavailable:', err);
      // Expensive operations fail closed on Redis outage
      if (isExpensive) {
        return {
          success: false,
          remaining: 0,
          limit: maxLimit,
          reset: Math.ceil((Date.now() + 60_000) / 1000),
        };
      }
    }
  }

  // In-process fallback for cheap reads / dev / CI
  return inProcessRateLimit(key, maxLimit);
}
