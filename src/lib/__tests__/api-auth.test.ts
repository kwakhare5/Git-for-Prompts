import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { authenticateApiKey, touchApiKeyLastUsed } from '../api-auth';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

describe('API Key Authentication & Scope Verification (Real DB)', () => {
  const createdKeyIds: string[] = [];

  const rawValidToken = 'gfp_live_11112222333344445555666677778888';
  const validLookupHash = createHash('sha256').update(rawValidToken).digest('hex');

  const rawLegacyToken = 'gfp_live_legacy_key_11112222333344445555';
  const legacyLookupHash = createHash('sha256').update(rawLegacyToken).digest('hex');

  const rawScopedToken = 'gfp_live_read_only_key_11112222333344445555';
  const scopedLookupHash = createHash('sha256').update(rawScopedToken).digest('hex');

  const rawRevokedToken = 'gfp_live_revoked_key_11112222333344445555';
  const revokedLookupHash = createHash('sha256').update(rawRevokedToken).digest('hex');

  const rawExpiredToken = 'gfp_live_expired_key_11112222333344445555';
  const expiredLookupHash = createHash('sha256').update(rawExpiredToken).digest('hex');

  let throttleKeyId: string;

  beforeAll(async () => {
    // 1. Seed valid active key
    const [validKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_123',
        name: 'Valid Key',
        keyLookupHash: validLookupHash,
        keyPrefix: 'gfp_live_',
        scopes: ['prompts:read', 'prompts:write'],
      })
      .returning();
    createdKeyIds.push(validKey.id);

    // 2. Seed legacy key with empty scopes
    const [legacyKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_legacy',
        name: 'Legacy Key',
        keyLookupHash: legacyLookupHash,
        keyPrefix: 'gfp_live_',
        scopes: [],
      })
      .returning();
    createdKeyIds.push(legacyKey.id);

    // 3. Seed read-only key
    const [scopedKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_readonly',
        name: 'Read-only Key',
        keyLookupHash: scopedLookupHash,
        keyPrefix: 'gfp_live_',
        scopes: ['prompts:read'],
      })
      .returning();
    createdKeyIds.push(scopedKey.id);

    // 4. Seed revoked key
    const [revokedKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_revoked',
        name: 'Revoked Key',
        keyLookupHash: revokedLookupHash,
        keyPrefix: 'gfp_live_',
        scopes: ['prompts:read'],
        revokedAt: new Date(Date.now() - 3600_000),
      })
      .returning();
    createdKeyIds.push(revokedKey.id);

    // 5. Seed expired key
    const [expiredKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_expired',
        name: 'Expired Key',
        keyLookupHash: expiredLookupHash,
        keyPrefix: 'gfp_live_',
        scopes: ['prompts:read'],
        expiresAt: new Date(Date.now() - 10_000),
      })
      .returning();
    createdKeyIds.push(expiredKey.id);

    // 6. Seed key for touch throttling
    const [throttleKey] = await db
      .insert(apiKeys)
      .values({
        ownerId: 'user_throttle',
        name: 'Throttle Key',
        keyLookupHash: createHash('sha256').update('gfp_live_throttle_test').digest('hex'),
        keyPrefix: 'gfp_live_',
        lastUsedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
      })
      .returning();
    throttleKeyId = throttleKey.id;
    createdKeyIds.push(throttleKeyId);
  });

  afterAll(async () => {
    for (const id of createdKeyIds) {
      await db.delete(apiKeys).where(eq(apiKeys.id, id));
    }
  });

  it('rejects missing or malformed Authorization header', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest');
    const res = await authenticateApiKey(req);
    expect(res).toHaveProperty('status', 401);
  });

  it('rejects oversized Authorization header (>512 bytes)', async () => {
    const hugeToken = 'gfp_live_' + 'a'.repeat(600);
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${hugeToken}` },
    });
    const res = await authenticateApiKey(req);
    expect(res).toHaveProperty('status', 401);
  });

  it('authenticates valid active key with matching scope against real database', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${rawValidToken}` },
    });

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).not.toHaveProperty('status');
    expect(res).toEqual({
      ownerId: 'user_123',
      keyId: expect.any(String),
      scopes: ['prompts:read', 'prompts:write'],
    });
  });

  it('provides backward compatibility for legacy keys with empty scopes', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${rawLegacyToken}` },
    });

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).not.toHaveProperty('status');
    expect(res).toHaveProperty('ownerId', 'user_legacy');
    expect((res as { scopes: string[] }).scopes).toEqual(['prompts:read', 'prompts:write', 'versions:write']);
  });

  it('rejects key missing the required scope', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/versions', {
      headers: { Authorization: `Bearer ${rawScopedToken}` },
    });

    const res = await authenticateApiKey(req, 'versions:write');
    expect(res).toHaveProperty('status', 403);
  });

  it('rejects revoked keys with 401 status', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${rawRevokedToken}` },
    });

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).toHaveProperty('status', 401);
  });

  it('rejects expired keys with 401 status', async () => {
    const req = new NextRequest('https://example.com/api/v1/prompts/123/latest', {
      headers: { Authorization: `Bearer ${rawExpiredToken}` },
    });

    const res = await authenticateApiKey(req, 'prompts:read');
    expect(res).toHaveProperty('status', 401);
  });

  it('throttles lastUsedAt updates within 10-minute window by inspecting database state', async () => {
    // 1. Key was updated 2 mins ago -> should NOT change in database
    const initialKey = await db.select().from(apiKeys).where(eq(apiKeys.id, throttleKeyId));
    const initialTimestamp = initialKey[0].lastUsedAt!;

    await touchApiKeyLastUsed(throttleKeyId, initialTimestamp);

    const afterNoOp = await db.select().from(apiKeys).where(eq(apiKeys.id, throttleKeyId));
    expect(afterNoOp[0].lastUsedAt?.getTime()).toBe(initialTimestamp.getTime());

    // 2. Set key to 15 mins ago in database -> touchApiKeyLastUsed SHOULD update it to now
    const oldTimestamp = new Date(Date.now() - 15 * 60 * 1000);
    await db.update(apiKeys).set({ lastUsedAt: oldTimestamp }).where(eq(apiKeys.id, throttleKeyId));

    await touchApiKeyLastUsed(throttleKeyId, oldTimestamp);

    const afterUpdate = await db.select().from(apiKeys).where(eq(apiKeys.id, throttleKeyId));
    expect(afterUpdate[0].lastUsedAt!.getTime()).toBeGreaterThan(Date.now() - 5000);
  });
});
