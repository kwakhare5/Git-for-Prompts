import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { eq, and } from 'drizzle-orm';
import type { db as dbInstance } from '@/db';
import type * as schemaTypes from '@/db/schema';
import type { createPrompt as createPromptFn, updatePrompt as updatePromptFn, deletePrompt as deletePromptFn } from '../prompts';
import type { createVersion as createVersionFn, restoreVersion as restoreVersionFn } from '../versions';

// 1. Mock Clerk authentication module
vi.mock('@clerk/nextjs/server', () => {
  return {
    auth: vi.fn(),
  };
});

// 2. Mock next/cache to prevent revalidatePath from throwing context errors in Vitest
vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

import { auth } from '@clerk/nextjs/server';

// 3. Load environment variables
dotenv.config({ path: '.env.local' });

// We define references for modules loaded dynamically
let db: typeof dbInstance;
let schema: typeof schemaTypes;
let createPrompt: typeof createPromptFn;
let updatePrompt: typeof updatePromptFn;
let deletePrompt: typeof deletePromptFn;
let createVersion: typeof createVersionFn;
let restoreVersion: typeof restoreVersionFn;

describe('Server Actions Integration Tests', () => {
  const TEST_USER_ID = `user_clerk_actions_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const OTHER_USER_ID = `user_clerk_other_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const createdPromptIds: string[] = [];
  const createdVersionIds: string[] = [];

  const trackPrompt = (id: string) => createdPromptIds.push(id);
  const trackVersion = (id: string) => createdVersionIds.push(id);

  beforeAll(async () => {
    // 4. Dynamically import modules to guarantee env variables are set
    const dbModule = await import('@/db');
    const schemaModule = await import('@/db/schema');
    const promptsModule = await import('../prompts');
    const versionsModule = await import('../versions');

    db = dbModule.db;
    schema = schemaModule;
    createPrompt = promptsModule.createPrompt;
    updatePrompt = promptsModule.updatePrompt;
    deletePrompt = promptsModule.deletePrompt;
    createVersion = versionsModule.createVersion;
    restoreVersion = versionsModule.restoreVersion;

    // Default auth mock behaviour: logged in as TEST_USER_ID
    vi.mocked(auth).mockImplementation(async () => ({
      userId: TEST_USER_ID,
    } as unknown as Awaited<ReturnType<typeof auth>>));
  });

  afterAll(async () => {
    // Clean up all dynamically created prompts and versions
    if (db && schema) {
      for (const id of createdVersionIds) {
        await db.delete(schema.versions).where(eq(schema.versions.id, id));
      }
      for (const id of createdPromptIds) {
        await db.delete(schema.prompts).where(eq(schema.prompts.id, id));
      }
    }
  });

  describe('Authentication Gate', () => {
    it('rejects unauthenticated users with Unauthorized exception', async () => {
      // Temporarily mock user session as null
      vi.mocked(auth).mockImplementationOnce(async () => ({
        userId: null,
      } as unknown as Awaited<ReturnType<typeof auth>>));

      await expect(createPrompt({ name: 'Blocked prompt' })).rejects.toThrow('Unauthorized');
    });
  });


  describe('Prompt Actions', () => {
    it('successfully creates a prompt and saves to database', async () => {
      const validPrompt = {
        name: `Developer Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        description: 'Used for coding code review prompts',
      };

      const result = await createPrompt(validPrompt);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(validPrompt.name);
      expect(result.ownerId).toBe(TEST_USER_ID);

      trackPrompt(result.id);
    });

    it('rejects malformed inputs based on Zod validations', async () => {
      const invalidPrompt = { name: '' }; // name must be min length 1
      await expect(createPrompt(invalidPrompt)).rejects.toThrow('Name is required');
    });

    it('updates prompt attributes and tracks update times', async () => {
      // 1. Create a prompt to update
      const [prompt] = await db
        .insert(schema.prompts)
        .values({
          name: `Original Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          description: 'To be updated',
          ownerId: TEST_USER_ID,
        })
        .returning();
      trackPrompt(prompt.id);

      // 2. Call update action
      const updated = await updatePrompt(prompt.id, {
        name: 'Replaced Title',
        description: 'New Description content',
      });

      expect(updated.name).toBe('Replaced Title');
      expect(updated.description).toBe('New Description content');

      // Verify db state
      const [fromDb] = await db
        .select()
        .from(schema.prompts)
        .where(eq(schema.prompts.id, prompt.id));
      expect(fromDb.name).toBe('Replaced Title');
    });

    it('prevents users from updating other organizations prompts', async () => {
      // 1. Create a prompt owned by OTHER_USER_ID
      const [otherPrompt] = await db
        .insert(schema.prompts)
        .values({
          name: `Foreign Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          description: 'Top Secret prompt data',
          ownerId: OTHER_USER_ID,
        })
        .returning();
      trackPrompt(otherPrompt.id);

      // 2. Attempt to update it (logged in as TEST_USER_ID)
      await expect(
        updatePrompt(otherPrompt.id, { name: 'Malicious Hack' })
      ).rejects.toThrow('Prompt not found or access denied');
    });

    it('deletes prompts owned by the active user', async () => {
      const [promptToDelete] = await db
        .insert(schema.prompts)
        .values({
          name: `Garbage Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          description: 'Will be deleted',
          ownerId: TEST_USER_ID,
        })
        .returning();
      trackPrompt(promptToDelete.id);

      const response = await deletePrompt({ promptId: promptToDelete.id });
      expect(response.success).toBe(true);

      // Verify it is gone
      const [deletedCheck] = await db
        .select()
        .from(schema.prompts)
        .where(eq(schema.prompts.id, promptToDelete.id));
      expect(deletedCheck).toBeUndefined();
    });
  });

  describe('Version Actions', () => {
    let activePromptId: string;

    beforeAll(async () => {
      // Create a prompt we can attach versions to with guaranteed unique name
      const [prompt] = await db
        .insert(schema.prompts)
        .values({
          name: `Version Sandbox Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          description: 'Testing incrementing and restoring versions',
          ownerId: TEST_USER_ID,
        })
        .returning();
      activePromptId = prompt.id;
      trackPrompt(activePromptId);
    });

    it('creates version 1, auto-increments version number, and updates prompt parent link', async () => {
      const v1Result = await createVersion({
        promptId: activePromptId,
        content: 'System: You are v1.',
        commitMessage: 'First save',
      });

      expect(v1Result.id).toBeDefined();
      expect(v1Result.versionNumber).toBe(1);
      expect(v1Result.content).toBe('System: You are v1.');
      trackVersion(v1Result.id);

      // Verify that parent prompt currentVersionId was updated to version 1
      const [parentPrompt] = await db
        .select()
        .from(schema.prompts)
        .where(eq(schema.prompts.id, activePromptId));
      expect(parentPrompt.currentVersionId).toBe(v1Result.id);
    });

    it('creates version 2 and increments version number correctly', async () => {
      const v2Result = await createVersion({
        promptId: activePromptId,
        content: 'System: You are v2.',
        commitMessage: 'Second save',
      });

      expect(v2Result.versionNumber).toBe(2);
      expect(v2Result.content).toBe('System: You are v2.');
      trackVersion(v2Result.id);

      // Verify parent prompt currentVersionId is updated to version 2
      const [parentPrompt] = await db
        .select()
        .from(schema.prompts)
        .where(eq(schema.prompts.id, activePromptId));
      expect(parentPrompt.currentVersionId).toBe(v2Result.id);
    });

    it('restores v1 by inserting it as v3 with historical content', async () => {
      // Get the v1 version record we created earlier
      const [v1Record] = await db
        .select()
        .from(schema.versions)
        .where(and(eq(schema.versions.promptId, activePromptId), eq(schema.versions.versionNumber, 1)));

      // Call restore action
      const restored = await restoreVersion({
        promptId: activePromptId,
        versionId: v1Record.id,
      });

      expect(restored.versionNumber).toBe(3);
      expect(restored.content).toBe('System: You are v1.');
      expect(restored.commitMessage).toBe('Restored from v1');
      trackVersion(restored.id);

      // Verify parent currentVersionId is now version 3
      const [parentPrompt] = await db
        .select()
        .from(schema.prompts)
        .where(eq(schema.prompts.id, activePromptId));
      expect(parentPrompt.currentVersionId).toBe(restored.id);
    });



    it('rejects version restoration if the version ID belongs to a different prompt', async () => {
      // 1. Create a foreign prompt with its own version
      const [otherPrompt] = await db
        .insert(schema.prompts)
        .values({
          name: `Foreign Version Prompt ${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          ownerId: TEST_USER_ID,
        })
        .returning();
      trackPrompt(otherPrompt.id);

      const [otherVersion] = await db
        .insert(schema.versions)
        .values({
          promptId: otherPrompt.id,
          versionNumber: 1,
          content: 'Secret text',
          createdBy: TEST_USER_ID,
        })
        .returning();
      trackVersion(otherVersion.id);

      // 2. Try to restore otherVersion.id into activePromptId
      await expect(
        restoreVersion({
          promptId: activePromptId,
          versionId: otherVersion.id,
        })
      ).rejects.toThrow('Version does not belong to this prompt');
    });
  });
});
