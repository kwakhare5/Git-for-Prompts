import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import * as authModule from '@/lib/auth';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updatePrompt, deletePrompt, togglePromptVisibility } from '@/lib/actions/prompts';
import { createVersion, restoreVersion } from '@/lib/actions/versions';
import { createTestCase, deleteTestCase, runTestsForVersion } from '@/lib/actions/tests';
import { deleteApiKey } from '@/lib/actions/api-keys';
import { deleteWebhook } from '@/lib/actions/webhooks';

// Only mock next/cache to prevent context errors during tests
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Cross-Tenant Authorization / BOLA Security Matrix (Real DB)', () => {
  const USER_A = `user_bola_a_${Date.now()}`;
  const USER_B = `user_bola_b_${Date.now()}`;

  let promptBId: string;
  let versionBId: string;
  let testCaseBId: string;
  let apiKeyBId: string;
  let webhookBId: string;

  beforeAll(async () => {
    // 1. Seed User B real assets in PostgreSQL
    const [promptB] = await db
      .insert(schema.prompts)
      .values({
        name: `secure-prompt-b-${Date.now()}`,
        description: 'User B confidential prompt',
        ownerId: USER_B,
      })
      .returning();
    promptBId = promptB.id;

    const [versionB] = await db
      .insert(schema.versions)
      .values({
        promptId: promptBId,
        versionNumber: 1,
        content: 'Confidential User B instructions',
        createdBy: USER_B,
      })
      .returning();
    versionBId = versionB.id;

    await db
      .update(schema.prompts)
      .set({ currentVersionId: versionBId })
      .where(eq(schema.prompts.id, promptBId));

    const [testCaseB] = await db
      .insert(schema.testCases)
      .values({
        promptId: promptBId,
        name: 'Secret assertion',
        inputText: 'User B input',
        expectedCriteria: 'Must stay private',
      })
      .returning();
    testCaseBId = testCaseB.id;

    const [apiKeyB] = await db
      .insert(schema.apiKeys)
      .values({
        name: 'Key B',
        ownerId: USER_B,
        keyPrefix: 'gfp_live_',
        keyHash: `hash_b_${Date.now()}`,
        keyLookupHash: `lookup_b_${Date.now()}`,
      })
      .returning();
    apiKeyBId = apiKeyB.id;

    const [webhookB] = await db
      .insert(schema.webhooks)
      .values({
        ownerId: USER_B,
        url: 'https://example.com/webhook',
        secretHash: 'webhook_secret_b_hash',
        label: 'Webhook B',
      })
      .returning();
    webhookBId = webhookB.id;
  });

  afterAll(async () => {
    // Clean up all seeded test data
    if (promptBId) {
      await db.delete(schema.testCases).where(eq(schema.testCases.promptId, promptBId));
      await db.delete(schema.versions).where(eq(schema.versions.promptId, promptBId));
      await db.delete(schema.prompts).where(eq(schema.prompts.id, promptBId));
    }
    if (apiKeyBId) {
      await db.delete(schema.apiKeys).where(eq(schema.apiKeys.id, apiKeyBId));
    }
    if (webhookBId) {
      await db.delete(schema.webhooks).where(eq(schema.webhooks.id, webhookBId));
    }
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated attempts across all actions', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(null);

    await expect(updatePrompt(promptBId, { name: 'Hacked' })).rejects.toThrow('Unauthorized');
    await expect(deletePrompt({ promptId: promptBId })).rejects.toThrow('Unauthorized');
    await expect(togglePromptVisibility(promptBId)).rejects.toThrow('Unauthorized');
    await expect(createVersion({ promptId: promptBId, content: 'hacked' })).rejects.toThrow('Unauthorized');
    await expect(restoreVersion({ promptId: promptBId, versionId: versionBId })).rejects.toThrow('Unauthorized');
    await expect(createTestCase({ promptId: promptBId, name: 't1', inputText: 'in', expectedCriteria: 'exp' })).rejects.toThrow('Unauthorized');
    await expect(deleteTestCase(testCaseBId)).rejects.toThrow('Unauthorized');
    await expect(deleteApiKey({ id: apiKeyBId })).rejects.toThrow('Unauthorized');
    await expect(deleteWebhook(webhookBId)).rejects.toThrow('Unauthorized');
    await expect(runTestsForVersion(versionBId)).rejects.toThrow('Unauthorized');
  });

  it('rejects User A attempting to update User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(updatePrompt(promptBId, { name: 'Renamed by A' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(deletePrompt({ promptId: promptBId })).rejects.toThrow();
  });

  it('rejects User A attempting to create version for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(createVersion({ promptId: promptBId, content: 'unauthorized content' })).rejects.toThrow();
  });

  it('rejects User A attempting to restore version for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(restoreVersion({ promptId: promptBId, versionId: versionBId })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B API key', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(deleteApiKey({ id: apiKeyBId })).rejects.toThrow();
  });

  it('rejects User A attempting to delete User B webhook', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(deleteWebhook(webhookBId)).rejects.toThrow();
  });

  it('rejects User A attempting to create test case for User B prompt', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(createTestCase({ promptId: promptBId, name: 'eval', inputText: 'hi', expectedCriteria: 'pass' })).rejects.toThrow();
  });

  it('rejects User A attempting to delete test case owned by User B', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(deleteTestCase(testCaseBId)).rejects.toThrow();
  });

  it('rejects User A attempting to run evaluations for User B version', async () => {
    vi.spyOn(authModule, 'getAuthUserId').mockResolvedValue(USER_A);
    await expect(runTestsForVersion(versionBId)).rejects.toThrow();
  });
});
