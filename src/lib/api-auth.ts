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
import { eq, and, or, isNull, lt } from 'drizzle-orm';
import { createHash } from 'crypto';

export type AuthenticatedKey = {
  ownerId: string;
  keyId: string;
  scopes: string[];
};

/**
 * Authenticates a Bearer API key from the Authorization header.
 * Checks revocation, expiration, and optional required scope.
 * Returns `{ ownerId, keyId, scopes }` on success or `NextResponse` (401/403) on failure.
 */
export async function authenticateApiKey(
  req: NextRequest,
  requiredScope?: string
): Promise<AuthenticatedKey | NextResponse> {
  const authHeader = req.headers.get('Authorization');
  
  // 1. Strict header format validation & size cap (max 512 bytes to prevent DOS)
  if (!authHeader || authHeader.length > 512 || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Use: Authorization: Bearer <your-key>' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7).trim();

  // 2. Validate key format & length
  if (!token.startsWith('gfp_live_') || token.length < 20 || token.length > 256) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  // 3. SHA-256 hash for O(1) indexed lookup
  const lookupHash = createHash('sha256').update(token).digest('hex');

  // 4. Look up key from database
  const [candidateKey] = await db
    .select({
      id: apiKeys.id,
      ownerId: apiKeys.ownerId,
      scopes: apiKeys.scopes,
      revokedAt: apiKeys.revokedAt,
      expiresAt: apiKeys.expiresAt,
      lastUsedAt: apiKeys.lastUsedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.keyLookupHash, lookupHash))
    .limit(1);

  if (!candidateKey) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  // 5. Check revocation (generic 401 failure to prevent status leakage)
  if (candidateKey.revokedAt !== null) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  // 6. Check expiration (generic 401 failure)
  if (candidateKey.expiresAt !== null && new Date(candidateKey.expiresAt) <= new Date()) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  // 7. Check scope permission if required (with backward compatibility fallback)
  const activeScopes = candidateKey.scopes && candidateKey.scopes.length > 0
    ? candidateKey.scopes
    : ['prompts:read', 'prompts:write', 'versions:write'];

  if (requiredScope && !activeScopes.includes(requiredScope)) {
    return NextResponse.json(
      { error: `API key lacks required scope '${requiredScope}'` },
      { status: 403 }
    );
  }

  // 8. Schedule throttled lastUsedAt update (non-blocking)
  touchApiKeyLastUsed(candidateKey.id, candidateKey.lastUsedAt).catch((err) =>
    console.error('[api-auth] Throttled lastUsedAt update failed:', err)
  );

  return {
    ownerId: candidateKey.ownerId,
    keyId: candidateKey.id,
    scopes: activeScopes,
  };
}

/**
 * Throttled lastUsedAt update.
 * Updates the database only if lastUsedAt is null or older than 10 minutes.
 * Prevents DB write-amplification on API hot paths.
 */
export async function touchApiKeyLastUsed(keyId: string, currentLastUsed: Date | null): Promise<void> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  if (!currentLastUsed || new Date(currentLastUsed) < tenMinutesAgo) {
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(
        and(
          eq(apiKeys.id, keyId),
          or(isNull(apiKeys.lastUsedAt), lt(apiKeys.lastUsedAt, tenMinutesAgo))
        )
      );
  }
}
