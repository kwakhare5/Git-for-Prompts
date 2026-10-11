import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest';
import * as authModule from '@/lib/auth';
import { generateApiKey, revokeApiKey } from '@/lib/actions/api-keys';
import { touchApiKeyLastUsed } from '@/lib/api-auth';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

const MAX_ACTIVE_KEYS_PER_USER = 10;

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Stage 2C — API Key Lifecycle & Limits (Real DB)', () => {
  const TEST_USER = `user_keys_${Date.now()}`;
  const createdKeyIds: string[] = [];

  afterAll(async () => {
    for (const id of createdKeyIds) {
      await db.delete(schema.apiKeys).where(eq(schema.apiKeys.id, id));
    }
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('generates high-entropy API key with gfp_live_ prefix without storing plaintext', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(TEST_USER);

    const res = await generateApiKey({ name: 'Prod Key' });
    expect(res).toBeDefined();
    expect(res.plainKey).toMatch(/^gfp_live_[a-f0-9]{32}$/);
    createdKeyIds.push(res.id);

    // Verify against real Postgres database
    const [stored] = await db
      .select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.id, res.id));

    expect(stored).toBeDefined();
    expect(stored.name).toBe('Prod Key');
    expect(stored.ownerId).toBe(TEST_USER);
    expect(stored.keyHash).toBeDefined();
    expect(stored.keyHash).not.toEqual(res.plainKey);
    expect(stored).not.toHaveProperty('plainKey');
  });

  it('enforces MAX_ACTIVE_KEYS_PER_USER cap with real database rows', async () => {
    const SPAM_USER = `user_spam_${Date.now()}`;
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(SPAM_USER);

    // Seed 10 active keys in PostgreSQL
    const seededKeys = Array.from({ length: MAX_ACTIVE_KEYS_PER_USER }, (_, i) => ({
      ownerId: SPAM_USER,
      name: `Key ${i + 1}`,
      keyPrefix: 'gfp_live_',
      keyHash: `hash_spam_${i}_${Date.now()}`,
      keyLookupHash: `lookup_hash_spam_${i}_${Date.now()}`,
    }));

    const inserted = await db.insert(schema.apiKeys).values(seededKeys).returning();
    inserted.forEach((k) => createdKeyIds.push(k.id));

    // Attempt to generate the 11th key
    await expect(generateApiKey({ name: 'Excess Key' })).rejects.toThrow(
      `Maximum active API keys limit (${MAX_ACTIVE_KEYS_PER_USER}) reached`
    );
  });

  it('soft-revokes API key via revokeApiKey in real database', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(TEST_USER);

    const created = await generateApiKey({ name: 'To Revoke' });
    createdKeyIds.push(created.id);

    await revokeApiKey({ id: created.id });

    const [updated] = await db
      .select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.id, created.id));

    expect(updated).toBeDefined();
    expect(updated.revokedAt).toBeInstanceOf(Date);
  });

  it('throttles lastUsedAt updates within 10-minute window in real database', async () => {
    const [key] = await db
      .insert(schema.apiKeys)
      .values({
        ownerId: TEST_USER,
        name: 'Throttled Key',
        keyPrefix: 'gfp_live_',
        keyHash: `hash_thrt_${Date.now()}`,
        keyLookupHash: `lookup_thrt_${Date.now()}`,
      })
      .returning();
    createdKeyIds.push(key.id);

    // 1. Recently updated 2 minutes ago -> should NOT trigger DB update
    const recentDate = new Date(Date.now() - 2 * 60 * 1000);
    await touchApiKeyLastUsed(key.id, recentDate);

    const [unmodified] = await db
      .select({ lastUsedAt: schema.apiKeys.lastUsedAt })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.id, key.id));

    expect(unmodified.lastUsedAt).toBeNull();

    // 2. Updated 15 minutes ago -> SHOULD trigger DB update
    const oldDate = new Date(Date.now() - 15 * 60 * 1000);
    await touchApiKeyLastUsed(key.id, oldDate);

    const [modified] = await db
      .select({ lastUsedAt: schema.apiKeys.lastUsedAt })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.id, key.id));

    expect(modified.lastUsedAt).toBeInstanceOf(Date);
  });
});
