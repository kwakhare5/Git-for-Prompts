'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
import { revalidatePath } from 'next/cache';
import { createApiKeySchema, deleteApiKeySchema } from '@/lib/validations/api-key';

// ─────────────────────────────────────────────────────────────────────────────
// generateApiKey — creates a new key, hashes it, returns plaintext ONCE.
// The full key is never retrievable again after this call returns.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateApiKey(input: unknown) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { name } = createApiKeySchema.parse(input);

    // Build key: gfp_live_ prefix + 32 random hex chars (128 bits of entropy)
    const rawSecret = randomBytes(16).toString('hex');
    const fullKey = `gfp_live_${rawSecret}`;
    const keyPrefix = 'gfp_live_';

    // SHA-256 for fast O(1) indexed lookup — not reversible, 128-bit entropy key
    const keyLookupHash = createHash('sha256').update(fullKey).digest('hex');

    const [created] = await db
      .insert(apiKeys)
      .values({ name, ownerId: userId, keyHash: 'sha256_only', keyLookupHash, keyPrefix })
      .returning();

    revalidatePath('/dashboard/api-keys');

    // Return plaintext key to the client exactly once — never stored in DB
    return {
      id: created.id,
      name: created.name,
      plainKey: fullKey,
      createdAt: created.createdAt.toISOString(), // serialize for client consumption
    };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
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
