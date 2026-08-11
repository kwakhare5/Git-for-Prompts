import { auth } from '@clerk/nextjs/server';

/**
 * Returns the current authenticated user ID.
 * 1. Attempts to call Clerk's auth() (handles real Clerk sessions & Vitest mocks).
 * 2. If auth() succeeds and returns a userId, returns that userId.
 * 3. If auth() returns null or fails (e.g. offline dev without Clerk keys configured),
 *    falls back to 'user_local_dev' unless in test environment where null is explicit.
 */
export async function getAuthUserId(): Promise<string | null> {
  let clerkUserId: string | null = null;
  let authCalledSuccessfully = false;

  try {
    const res = await auth();
    clerkUserId = res?.userId ?? null;
    authCalledSuccessfully = true;
  } catch {
    // Clerk auth() threw because environment keys are missing or invalid
    authCalledSuccessfully = false;
  }

  if (clerkUserId) {
    return clerkUserId;
  }

  // Production environments MUST fail closed — no local auth fallback allowed in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // If Vitest/Jest test environment explicitly mocked auth() to return { userId: null },
  // respect that explicit null (e.g. testing unauthenticated access).
  if (process.env.NODE_ENV === 'test' && authCalledSuccessfully) {
    return null;
  }

  // Local development only: if Clerk keys are absent, fallback to 'user_local_dev'
  const hasClerkKeys = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  if (process.env.NODE_ENV === 'development' && !hasClerkKeys) {
    return 'user_local_dev';
  }

  return null;
}

