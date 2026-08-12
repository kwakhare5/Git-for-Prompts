import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import dotenv from 'dotenv';
import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { inProcessCounts } from '@/lib/rate-limit';

dotenv.config({ path: '.env.local' });

import type { db as dbInstance } from '@/db';
import type * as schemaTypes from '@/db/schema';
import type { GET as getHandler } from './route';

let db: typeof dbInstance;
let GET: typeof getHandler;
let schema: typeof schemaTypes;

describe('GET /api/v1/prompts/[id]/latest Route Handler', () => {
  beforeEach(() => {
    inProcessCounts.clear();
  });

  // authenticateApiKey only accepts the production token shape: gfp_live_ + 32 lowercase hex chars.
  const plainTextKey = 'gfp_live_0123456789abcdef0123456789abcdef';
  const lookupHash = createHash('sha256').update(plainTextKey).digest('hex');
  const mockOwnerId = 'user_test_api_holder';
  const otherOwnerId = 'user_test_other_holder';

  let testApiKeyId: string;
  let testPromptId: string;
  let testVersionId: string;
  let otherPromptId: string;

  beforeAll(async () => {
    const dbModule = await import('@/db');
    const routeModule = await import('./route');
    const schemaModule = await import('@/db/schema');

    db = dbModule.db;
    GET = routeModule.GET;
    schema = schemaModule;

    try {
      await db.execute(sql`
        ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "scopes" text[] DEFAULT '{"prompts:read","prompts:write","versions:write"}' NOT NULL;
        ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "revoked_at" timestamp;
        ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;
      `);
    } catch {
      // Ignore if database lacks DDL execution permissions.
    }

    const [insertedKey] = await db
      .insert(schema.apiKeys)
      .values({
        ownerId: mockOwnerId,
        name: 'Integration Test Key',
        keyHash: 'sha256_only',
        keyLookupHash: lookupHash,
        keyPrefix: 'gfp_live_',
      })
      .returning();
    testApiKeyId = insertedKey.id;

    const [insertedPrompt] = await db
      .insert(schema.prompts)
      .values({
        name: 'Integration Prompt',
        description: 'Testing API endpoints',
        ownerId: mockOwnerId,
      })
      .returning();
    testPromptId = insertedPrompt.id;

    const [insertedVersion] = await db
      .insert(schema.versions)
      .values({
        promptId: testPromptId,
        versionNumber: 1,
        content: 'System: You are an integration grading assistant.',
        commitMessage: 'First API draft',
        createdBy: mockOwnerId,
      })
      .returning();
    testVersionId = insertedVersion.id;

    await db
      .update(schema.prompts)
      .set({ currentVersionId: testVersionId })
      .where(eq(schema.prompts.id, testPromptId));

    const [otherPrompt] = await db
      .insert(schema.prompts)
      .values({
        name: 'Other Organization Prompt',
        description: 'Private data',
        ownerId: otherOwnerId,
      })
      .returning();
    otherPromptId = otherPrompt.id;
  });

  afterAll(async () => {
    if (db && schema) {
      if (testVersionId) {
        await db.delete(schema.versions).where(eq(schema.versions.id, testVersionId));
      }
      if (testPromptId) {
        await db.delete(schema.prompts).where(eq(schema.prompts.id, testPromptId));
      }
      if (otherPromptId) {
        await db.delete(schema.prompts).where(eq(schema.prompts.id, otherPromptId));
      }
      if (testApiKeyId) {
        await db.delete(schema.apiKeys).where(eq(schema.apiKeys.id, testApiKeyId));
      }
    }
  });

  it('returns 200 with prompt data on valid key and valid prompt ID', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/prompts/${testPromptId}/latest`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${plainTextKey}`,
      },
    });

    const response = await GET(req, { params: Promise.resolve({ id: testPromptId }) });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.promptId).toBe(testPromptId);
    expect(body.promptName).toBe('Integration Prompt');
    expect(body.versionNumber).toBe(1);
    expect(body.content).toBe('System: You are an integration grading assistant.');
  }, 15_000);

  it('returns 401 when Authorization header is missing', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/prompts/${testPromptId}/latest`, {
      method: 'GET',
    });

    const response = await GET(req, { params: Promise.resolve({ id: testPromptId }) });
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toContain('Missing or invalid Authorization header');
  });

  it('returns 401 when API key format is incorrect', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/prompts/${testPromptId}/latest`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalid_prefix_key_123',
      },
    });

    const response = await GET(req, { params: Promise.resolve({ id: testPromptId }) });
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Invalid or expired API key');
  });

  it('returns 401 when API key is valid format but wrong value', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/prompts/${testPromptId}/latest`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer gfp_live_ffffffffffffffffffffffffffffffff',
      },
    });

    const response = await GET(req, { params: Promise.resolve({ id: testPromptId }) });
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Invalid or expired API key');
  });

  it('returns 404 when querying a prompt belonging to a different owner', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/prompts/${otherPromptId}/latest`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${plainTextKey}`,
      },
    });

    const response = await GET(req, { params: Promise.resolve({ id: otherPromptId }) });
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.error).toBe('Prompt not found');
  });
});
