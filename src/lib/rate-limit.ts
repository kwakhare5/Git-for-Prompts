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

const inProcessCounts = new Map<string, { count: number; resetAt: number }>();
const IN_PROCESS_LIMIT = 60;
const IN_PROCESS_WINDOW_MS = 60_000; // 1 minute

function inProcessRateLimit(key: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = inProcessCounts.get(key);

  if (!record || record.resetAt < now) {
    inProcessCounts.set(key, { count: 1, resetAt: now + IN_PROCESS_WINDOW_MS });
    return { success: true, remaining: IN_PROCESS_LIMIT - 1 };
  }

  record.count++;
  const remaining = Math.max(0, IN_PROCESS_LIMIT - record.count);
  return { success: record.count <= IN_PROCESS_LIMIT, remaining };
}

// ─── Public interface ─────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/**
 * Check rate limit for a given key (usually IP or userId).
 * Limit: 60 requests per minute.
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  // Use Upstash when both env vars are present
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      // Dynamically import to avoid bundling when not configured
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');

      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        prefix: 'gfp_rl',
      });

      const result = await ratelimit.limit(key);
      return { success: result.success, remaining: result.remaining };
    } catch (err) {
      // If Upstash fails, degrade gracefully to in-process fallback
      console.warn('[RateLimit] Upstash unavailable, falling back to in-process:', err);
    }
  }

  // In-process fallback
  return inProcessRateLimit(key);
}
