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

function inProcessRateLimit(key: string, limit: number): { success: boolean; remaining: number } {
  const now = Date.now();

  // Bounded deterministic sweep when size exceeds threshold
  if (inProcessCounts.size >= MAP_CLEANUP_THRESHOLD) {
    cleanupExpiredInProcessEntries(now);
  }

  const record = inProcessCounts.get(key);

  if (!record || record.resetAt <= now) {
    inProcessCounts.set(key, { count: 1, resetAt: now + IN_PROCESS_WINDOW_MS });
    return { success: true, remaining: limit - 1 };
  }

  record.count++;
  const remaining = Math.max(0, limit - record.count);
  return { success: record.count <= limit, remaining };
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
      return { success: result.success, remaining: result.remaining };
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis unavailable:', err);
      // Expensive operations fail closed on Redis outage
      if (isExpensive) {
        return { success: false, remaining: 0 };
      }
    }
  }

  // In-process fallback for cheap reads / dev / CI
  return inProcessRateLimit(key, maxLimit);
}
