import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { and, eq, isNull, lt, or } from 'drizzle-orm';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';

export type AuthenticatedKey = {
  ownerId: string;
  keyId: string;
  scopes: string[];
};

export async function authenticateApiKey(
  req: NextRequest,
  requiredScope?: string
): Promise<AuthenticatedKey | NextResponse> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader.length > 512 || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Use: Authorization: Bearer <your-key>' },
      { status: 401 }
    );
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!/^gfp_live_[a-f0-9]{32}$/.test(token)) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  const lookupHash = createHash('sha256').update(token).digest('hex');
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

  if (!candidateKey || candidateKey.revokedAt !== null) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  if (candidateKey.expiresAt !== null && new Date(candidateKey.expiresAt) <= new Date()) {
    return NextResponse.json({ error: 'Invalid or expired API key' }, { status: 401 });
  }

  // Empty scopes are intentionally denied. Treating them as full access would
  // turn a malformed/migrated key into a privilege-escalation path.
  const activeScopes = candidateKey.scopes ?? [];
  if (requiredScope && !activeScopes.includes(requiredScope)) {
    return NextResponse.json(
      { error: `API key lacks required scope '${requiredScope}'` },
      { status: 403 }
    );
  }

  void touchApiKeyLastUsed(candidateKey.id, candidateKey.lastUsedAt).catch((error) => {
    console.error('[api-auth] Failed to update lastUsedAt:', error);
  });

  return { ownerId: candidateKey.ownerId, keyId: candidateKey.id, scopes: activeScopes };
}

export async function touchApiKeyLastUsed(
  keyId: string,
  currentLastUsed: Date | null
): Promise<void> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  if (currentLastUsed && new Date(currentLastUsed) >= tenMinutesAgo) return;

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
