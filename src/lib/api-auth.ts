/**
 * Shared API key authentication for v1 API routes.
 *
 * Both `GET /api/v1/prompts/[id]/latest` and `POST /api/v1/prompts/[id]/versions`
 * implement the identical 5-step auth sequence. This module hides that sequence
 * behind a single deep interface — one call site per route instead of 30 lines
 * of duplicated auth logic.
 *
 * Interface:
 *   authenticateApiKey(req) → { ownerId, keyId } | NextResponse (401)
 *
 * The caller checks `instanceof NextResponse` and returns early on auth failure.
 * On success it gets { ownerId, keyId } and proceeds with its real logic.
 *
 * Seam note: two callers already exist (latest, versions). A third (e.g. a
 * future DELETE /prompts route) gets auth for free. The seam is real, not
 * speculative.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

export type AuthenticatedKey = {
  ownerId: string;
  keyId: string;
};

/**
 * Authenticate a Bearer API key from the Authorization header.
 *
 * Returns `{ ownerId, keyId }` on success.
 * Returns a `NextResponse` (401) on any failure — the caller should
 * `return` it immediately.
 *
 * Does NOT update `lastUsedAt` — callers fire that as a void side-effect
 * after the real work is done, keeping the hot path clean.
 */
export async function authenticateApiKey(
  req: NextRequest
): Promise<AuthenticatedKey | NextResponse> {
  // 1. Extract Bearer token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Use: Authorization: Bearer <your-key>' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7).trim();

  // 2. Validate key format (fast reject — no DB round-trip)
  if (!token.startsWith('gfp_live_')) {
    return NextResponse.json({ error: 'Invalid API key format' }, { status: 401 });
  }

  // 3. SHA-256 hash for O(1) indexed lookup.
  //    128-bit entropy keys make collision attacks infeasible.
  //    SHA-256 is both the lookup key and the verification — no bcrypt needed.
  const lookupHash = createHash('sha256').update(token).digest('hex');

  // 4. Look up the key
  const [candidateKey] = await db
    .select({ id: apiKeys.id, ownerId: apiKeys.ownerId })
    .from(apiKeys)
    .where(eq(apiKeys.keyLookupHash, lookupHash))
    .limit(1);

  if (!candidateKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  return { ownerId: candidateKey.ownerId, keyId: candidateKey.id };
}
