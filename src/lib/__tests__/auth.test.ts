import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAuthUserId } from '../auth';

// Mock @clerk/nextjs/server
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';

describe('Auth Fail-Closed Security Policy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('fails closed in production when Clerk keys are missing', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;

    vi.mocked(auth).mockRejectedValue(new Error('Clerk keys missing'));

    const userId = await getAuthUserId();
    expect(userId).toBeNull();
  });

  it('fails closed in production when auth() returns null userId', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_123';
    process.env.CLERK_SECRET_KEY = 'sk_test_123';

    vi.mocked(auth).mockResolvedValue({ userId: null } as unknown as Awaited<ReturnType<typeof auth>>);

    const userId = await getAuthUserId();
    expect(userId).toBeNull();
  });

  it('returns clerkUserId when auth() succeeds in production', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_123';
    process.env.CLERK_SECRET_KEY = 'sk_test_123';

    vi.mocked(auth).mockResolvedValue({ userId: 'user_clerk_prod_999' } as unknown as Awaited<ReturnType<typeof auth>>);

    const userId = await getAuthUserId();
    expect(userId).toBe('user_clerk_prod_999');
  });

  it('allows local dev fallback ONLY in development when Clerk keys are missing', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;

    vi.mocked(auth).mockRejectedValue(new Error('Clerk keys missing in dev'));

    const userId = await getAuthUserId();
    expect(userId).toBe('user_local_dev');
  });

  it('returns null in test environment when explicitly mocked to null', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    vi.mocked(auth).mockResolvedValue({ userId: null } as unknown as Awaited<ReturnType<typeof auth>>);

    const userId = await getAuthUserId();
    expect(userId).toBeNull();
  });
});
