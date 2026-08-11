import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, inProcessCounts, MAP_CLEANUP_THRESHOLD, cleanupExpiredInProcessEntries } from '../rate-limit';

describe('Stage 2G — Rate Limiting & Deterministic Map Eviction', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    inProcessCounts.clear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    inProcessCounts.clear();
  });

  it('enforces standard rate limit (60 req/min)', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const key = 'api:standard_test_ip';
    for (let i = 1; i <= 60; i++) {
      const res = await checkRateLimit(key);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(60 - i);
    }

    const overflowRes = await checkRateLimit(key);
    expect(overflowRes.success).toBe(false);
    expect(overflowRes.remaining).toBe(0);
  });

  it('enforces expensive operation rate limit (20 req/min)', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const key = 'expensive:key_exp_test';
    for (let i = 1; i <= 20; i++) {
      const res = await checkRateLimit(key);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(20 - i);
    }

    const overflowRes = await checkRateLimit(key);
    expect(overflowRes.success).toBe(false);
    expect(overflowRes.remaining).toBe(0);
  });

  it('maintains strict quota separation between standard and expensive limiters', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const stdKey = 'api:sep_user_1';
    const expKey = 'expensive:sep_user_1';

    // Exhaust standard quota completely
    for (let i = 0; i < 60; i++) {
      await checkRateLimit(stdKey);
    }

    const stdBlocked = await checkRateLimit(stdKey);
    expect(stdBlocked.success).toBe(false);

    // Expensive quota remains fully available
    const expRes = await checkRateLimit(expKey);
    expect(expRes.success).toBe(true);
    expect(expRes.remaining).toBe(19);
  });

  it('enforces fail-closed for expensive operations and local fallback for cheap reads during Redis outage', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://fake-upstash-url.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';

    vi.doMock('@upstash/ratelimit', () => ({
      Ratelimit: {
        slidingWindow: vi.fn(),
      },
    }));
    vi.doMock('@upstash/redis', () => ({
      Redis: {
        fromEnv: () => {
          throw new Error('Redis connection timed out');
        },
      },
    }));

    const { checkRateLimit: checkRateLimitMocked } = await import('../rate-limit');

    const cheapRes = await checkRateLimitMocked('api:127.0.0.1');
    expect(cheapRes.success).toBe(true);

    const expensiveRes = await checkRateLimitMocked('expensive:key_123');
    expect(expensiveRes.success).toBe(false);
    expect(expensiveRes.remaining).toBe(0);
  });

  it('performs deterministic eviction of expired entries when map size exceeds threshold', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const now = Date.now();

    // Insert 300 expired entries
    for (let i = 0; i < 300; i++) {
      inProcessCounts.set(`expired_${i}`, { count: 5, resetAt: now - 1000 });
    }

    // Insert 201 active entries
    for (let i = 0; i < 201; i++) {
      inProcessCounts.set(`active_${i}`, { count: 1, resetAt: now + 60_000 });
    }

    expect(inProcessCounts.size).toBe(501);
    expect(inProcessCounts.size).toBeGreaterThan(MAP_CLEANUP_THRESHOLD);

    // Trigger cleanup via function call
    const cleanedCount = cleanupExpiredInProcessEntries(now);
    expect(cleanedCount).toBe(300);

    // Assert expired entries removed & active entries retained
    expect(inProcessCounts.size).toBe(201);
    expect(inProcessCounts.has('expired_0')).toBe(false);
    expect(inProcessCounts.has('active_0')).toBe(true);
  });
});
