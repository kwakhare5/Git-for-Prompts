'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
import { revalidatePath } from 'next/cache';
import { createApiKeySchema, deleteApiKeySchema } from '@/lib/validations/api-key';

const MAX_ACTIVE_KEYS_PER_USER = 10;

// ─────────────────────────────────────────────────────────────────────────────
// generateApiKey — creates a new key with optional expiration and scopes.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateApiKey(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { name, expiresAt, scopes } = createApiKeySchema.parse(input);

    // Validate maximum active keys per user
    const existingKeys = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(and(eq(apiKeys.ownerId, userId), isNull(apiKeys.revokedAt)));

    if (existingKeys.length >= MAX_ACTIVE_KEYS_PER_USER) {
      throw new Error(`Maximum active API keys limit (${MAX_ACTIVE_KEYS_PER_USER}) reached.`);
    }

    const parsedExpiresAt = expiresAt ? new Date(expiresAt) : null;
    if (parsedExpiresAt && parsedExpiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future.');
    }

    // Build key: gfp_live_ prefix + 32 random hex chars (128 bits of entropy)
    const rawSecret = randomBytes(16).toString('hex');
    const fullKey = `gfp_live_${rawSecret}`;
    const keyPrefix = 'gfp_live_';

    // SHA-256 for fast O(1) indexed lookup
    const keyLookupHash = createHash('sha256').update(fullKey).digest('hex');

    const [created] = await db
      .insert(apiKeys)
      .values({
        name,
        ownerId: userId,
        keyHash: 'sha256_only',
        keyLookupHash,
        keyPrefix,
        expiresAt: parsedExpiresAt,
        scopes: scopes && scopes.length > 0 ? scopes : ['prompts:read', 'prompts:write', 'versions:write'],
      })
      .returning();

    revalidatePath('/dashboard/api-keys');

    return {
      id: created.id,
      name: created.name,
      plainKey: fullKey,
      expiresAt: created.expiresAt ? created.expiresAt.toISOString() : null,
      scopes: created.scopes,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error) throw err;
    throw new Error('Failed to generate API key');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// listApiKeys — returns safe display data only (no hashes).
// ─────────────────────────────────────────────────────────────────────────────
export async function listApiKeys() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    return db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        revokedAt: apiKeys.revokedAt,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.ownerId, userId));
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    throw new Error('Failed to list API keys');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// revokeApiKey — soft delete. Instantly revokes key while maintaining audit history.
// ─────────────────────────────────────────────────────────────────────────────
export async function revokeApiKey(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { id } = deleteApiKeySchema.parse(input);

    await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.ownerId, userId)));

    revalidatePath('/dashboard/api-keys');
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    throw new Error('Failed to revoke API key');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// deleteApiKey — hard delete. Always verifies ownerId before deleting.
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteApiKey(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { id } = deleteApiKeySchema.parse(input);

    await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.ownerId, userId)));

    revalidatePath('/dashboard/api-keys');
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    throw new Error('Failed to delete API key');
  }
}
