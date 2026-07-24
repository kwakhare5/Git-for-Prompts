/**
 * Integration tests for test runner server actions.
 *
 * Requires a running Postgres database (DATABASE_URL in .env.local).
 * AI calls are mocked so no Groq/OpenRouter credentials needed.
 *
 * Covers: createTestCase, deleteTestCase, runTestsForVersion,
 *         runComparisonForVersions (auth guards + happy paths).
 */

import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { eq, and } from 'drizzle-orm';
import type { db as dbInstance } from '@/db';
import type * as schemaTypes from '@/db/schema';
import type {
  createTestCase as createTestCaseFn,
  deleteTestCase as deleteTestCaseFn,
  runTestsForVersion as runTestsForVersionFn,
  runComparisonForVersions as runComparisonForVersionsFn,
} from '../tests';

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

// Mock AI so tests don't require network access or API keys
vi.mock('@/lib/ai', () => ({
  runSingleTestCase: vi.fn().mockResolvedValue({
    passed: true,
    actualOutput: 'Mock AI output',
    reason: 'Mock reason — AI is mocked',
  }),
  runWithConcurrency: vi.fn().mockImplementation(
    async (tasks: (() => Promise<unknown>)[]) =>
      Promise.all(tasks.map((t) => t()))
  ),
  MAX_CONCURRENT_TESTS: 3,
}));

// Mock rate limit to always succeed
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 59 }),
}));

import { auth } from '@clerk/nextjs/server';

dotenv.config({ path: '.env.local' });

// ─── Test state ───────────────────────────────────────────────────────────────

let db: typeof dbInstance;
let schema: typeof schemaTypes;
let createTestCase: typeof createTestCaseFn;
let deleteTestCase: typeof deleteTestCaseFn;
let runTestsForVersion: typeof runTestsForVersionFn;
let runComparisonForVersions: typeof runComparisonForVersionsFn;

describe('Test Runner Server Actions', () => {
  const TEST_USER_ID = 'user_clerk_test_runner_123';
  const OTHER_USER_ID = 'user_clerk_test_runner_other';

  // IDs tracked for cleanup
  const promptIds: string[] = [];
  const versionIds: string[] = [];
  const testCaseIds: string[] = [];

  // ─── Setup ───────────────────────────────────────────────────────────
  beforeAll(async () => {
    const dbModule = await import('@/db');
    const schemaModule = await import('@/db/schema');
    const testsModule = await import('../tests');

    db = dbModule.db;
    schema = schemaModule;
    createTestCase = testsModule.createTestCase;
    deleteTestCase = testsModule.deleteTestCase;
    runTestsForVersion = testsModule.runTestsForVersion;
    runComparisonForVersions = testsModule.runComparisonForVersions;

    vi.mocked(auth).mockResolvedValue({ userId: TEST_USER_ID } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);

    // Seed: prompt owned by TEST_USER_ID
    const [prompt] = await db
      .insert(schema.prompts)
      .values({ name: 'Test Prompt', ownerId: TEST_USER_ID })
      .returning();
    promptIds.push(prompt.id);

    // Seed: two versions of that prompt
    const [v1] = await db
      .insert(schema.versions)
      .values({ promptId: prompt.id, versionNumber: 1, content: 'v1 content', createdBy: TEST_USER_ID })
      .returning();
    const [v2] = await db
      .insert(schema.versions)
      .values({ promptId: prompt.id, versionNumber: 2, content: 'v2 content', createdBy: TEST_USER_ID })
      .returning();
    versionIds.push(v1.id, v2.id);

    // Seed: prompt owned by OTHER_USER_ID
    const [otherPrompt] = await db
      .insert(schema.prompts)
      .values({ name: 'Other Prompt', ownerId: OTHER_USER_ID })
      .returning();
    promptIds.push(otherPrompt.id);
  });

  afterAll(async () => {
    // Clean up in FK order: results → cases → versions → prompts
    // Delete test_results for ALL our versions (catches any leakage from failed runs)
    for (const id of versionIds) {
      await db.delete(schema.testResults).where(eq(schema.testResults.versionId, id)).catch(() => {});
    }
    if (testCaseIds.length) {
      for (const id of testCaseIds) {
        await db.delete(schema.testCases).where(eq(schema.testCases.id, id)).catch(() => {});
      }
    }
    // Also delete ALL test cases for our prompt IDs (catches any not tracked in testCaseIds)
    for (const id of promptIds) {
      await db.delete(schema.testCases).where(eq(schema.testCases.promptId, id)).catch(() => {});
    }
    for (const id of versionIds) {
      await db.delete(schema.versions).where(eq(schema.versions.id, id)).catch(() => {});
    }
    for (const id of promptIds) {
      await db.delete(schema.prompts).where(eq(schema.prompts.id, id)).catch(() => {});
    }
  });

  // ─── createTestCase ───────────────────────────────────────────────────

  describe('createTestCase', () => {
    it('creates a test case for an owned prompt', async () => {
      const result = await createTestCase({
        promptId: promptIds[0],
        name: 'Check output length',
        inputText: 'Hello, world',
        expectedCriteria: 'Response must be under 50 words',
      });

      expect(result).toMatchObject({
        promptId: promptIds[0],
        name: 'Check output length',
        inputText: 'Hello, world',
      });

      testCaseIds.push(result.id);
    });

    it('rejects when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
      await expect(
        createTestCase({ promptId: promptIds[0], name: 'x', inputText: 'y', expectedCriteria: 'z' })
      ).rejects.toThrow('Unauthorized');
    });

    it('rejects when prompt is owned by another user', async () => {
      await expect(
        createTestCase({
          promptId: promptIds[1], // OTHER_USER prompt
          name: 'Sneaky case',
          inputText: 'x',
          expectedCriteria: 'y',
        })
      ).rejects.toThrow('Prompt not found or access denied');
    });

    it('rejects invalid input (missing fields)', async () => {
      await expect(createTestCase({})).rejects.toThrow();
    });
  });

  // ─── deleteTestCase ───────────────────────────────────────────────────

  describe('deleteTestCase', () => {
    it('deletes a test case owned by the user', async () => {
      // Create a temp test case to delete
      const [tc] = await db
        .insert(schema.testCases)
        .values({
          promptId: promptIds[0],
          name: 'To be deleted',
          inputText: 'x',
          expectedCriteria: 'y',
        })
        .returning();

      const result = await deleteTestCase({ testCaseId: tc.id });
      expect(result).toEqual({ success: true });

      const [found] = await db
        .select()
        .from(schema.testCases)
        .where(eq(schema.testCases.id, tc.id));
      expect(found).toBeUndefined();
    });

    it('rejects when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
      await expect(deleteTestCase({ testCaseId: 'any-id' })).rejects.toThrow('Unauthorized');
    });

    it('rejects deletion of another user\'s test case', async () => {
      // Temporarily switch to other user, try to delete test case owned by TEST_USER_ID
      vi.mocked(auth).mockResolvedValueOnce({ userId: OTHER_USER_ID } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
      await expect(
        deleteTestCase({ testCaseId: testCaseIds[0] })
      ).rejects.toThrow('Access denied');
    });
  });

  // ─── runTestsForVersion ───────────────────────────────────────────────

  describe('runTestsForVersion', () => {
    it('returns empty array when no test cases exist', async () => {
      // Use a fresh prompt+version that has NO test cases — isolated from the shared prompt
      const [freshPrompt] = await db
        .insert(schema.prompts)
        .values({ name: 'Empty Prompt', ownerId: TEST_USER_ID })
        .returning();
      promptIds.push(freshPrompt.id);

      const [freshVersion] = await db
        .insert(schema.versions)
        .values({ promptId: freshPrompt.id, versionNumber: 1, content: 'no tests', createdBy: TEST_USER_ID })
        .returning();
      versionIds.push(freshVersion.id);

      const result = await runTestsForVersion({ versionId: freshVersion.id });
      expect(result).toEqual([]);
    });

    it('runs tests and persists results', async () => {
      // Fresh isolated prompt + version — completely clean, no prior test cases
      const [runPrompt] = await db
        .insert(schema.prompts)
        .values({ name: 'Run Test Prompt', ownerId: TEST_USER_ID })
        .returning();
      promptIds.push(runPrompt.id);

      const [runVersion] = await db
        .insert(schema.versions)
        .values({ promptId: runPrompt.id, versionNumber: 1, content: 'v1 run content', createdBy: TEST_USER_ID })
        .returning();
      versionIds.push(runVersion.id);

      // Create exactly one test case for this prompt
      const [tc] = await db
        .insert(schema.testCases)
        .values({
          promptId: runPrompt.id,
          name: 'Mock test case',
          inputText: 'Test input',
          expectedCriteria: 'Test must pass',
        })
        .returning();
      testCaseIds.push(tc.id);

      const results = await runTestsForVersion({ versionId: runVersion.id });

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        testCaseId: tc.id,
        passed: true,
        actualOutput: 'Mock AI output',
        persisted: true,
      });

      // Verify it was written to DB
      const [saved] = await db
        .select()
        .from(schema.testResults)
        .where(
          and(
            eq(schema.testResults.versionId, runVersion.id),
            eq(schema.testResults.testCaseId, tc.id)
          )
        );
      expect(saved).toBeDefined();
      expect(saved.passed).toBe(true);
    });

    it('upserts on re-run (no duplicate rows)', async () => {
      // Run again — should update existing row, not insert new one
      await runTestsForVersion({ versionId: versionIds[0] });

      const rows = await db
        .select()
        .from(schema.testResults)
        .where(eq(schema.testResults.versionId, versionIds[0]));

      // Should still be exactly one row per test case (upsert, not append)
      const uniqueTestCaseIds = new Set(rows.map((r) => r.testCaseId));
      expect(rows.length).toBe(uniqueTestCaseIds.size);
    });

    it('rejects when version is not owned by user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: OTHER_USER_ID } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
      await expect(
        runTestsForVersion({ versionId: versionIds[0] })
      ).rejects.toThrow('Access denied');
    });

    it('rejects when rate limited', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      vi.mocked(checkRateLimit).mockResolvedValueOnce({ success: false, remaining: 0 });
      await expect(
        runTestsForVersion({ versionId: versionIds[0] })
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  // ─── runComparisonForVersions ─────────────────────────────────────────

  describe('runComparisonForVersions', () => {
    it('returns empty arrays when no test cases exist for new versions', async () => {
      // Seed a new prompt with two versions and no test cases
      const [p] = await db
        .insert(schema.prompts)
        .values({ name: 'Empty Compare Prompt', ownerId: TEST_USER_ID })
        .returning();
      promptIds.push(p.id);

      const [va] = await db
        .insert(schema.versions)
        .values({ promptId: p.id, versionNumber: 1, content: 'va', createdBy: TEST_USER_ID })
        .returning();
      const [vb] = await db
        .insert(schema.versions)
        .values({ promptId: p.id, versionNumber: 2, content: 'vb', createdBy: TEST_USER_ID })
        .returning();
      versionIds.push(va.id, vb.id);

      const result = await runComparisonForVersions({ versionIdA: va.id, versionIdB: vb.id });
      expect(result.testCases).toEqual([]);
      expect(result.resultsA).toEqual([]);
      expect(result.resultsB).toEqual([]);
    });

    it('runs comparison and returns both sides', async () => {
      const result = await runComparisonForVersions({
        versionIdA: versionIds[0],
        versionIdB: versionIds[1],
      });

      // Both sides should have one result (for the test case created in runTestsForVersion tests)
      expect(result.resultsA).toHaveLength(result.testCases.length);
      expect(result.resultsB).toHaveLength(result.testCases.length);
      expect(result.resultsA[0].passed).toBe(true);
      expect(result.resultsB[0].passed).toBe(true);
    });

    it('rejects when versions belong to different prompts', async () => {
      const [otherV] = await db
        .insert(schema.versions)
        .values({ promptId: promptIds[1], versionNumber: 1, content: 'other', createdBy: OTHER_USER_ID })
        .returning();
      versionIds.push(otherV.id);

      await expect(
        runComparisonForVersions({ versionIdA: versionIds[0], versionIdB: otherV.id })
      ).rejects.toThrow('same prompt');
    });

    it('rejects access to another user\'s versions', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: OTHER_USER_ID } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
      await expect(
        runComparisonForVersions({ versionIdA: versionIds[0], versionIdB: versionIds[1] })
      ).rejects.toThrow('Access denied');
    });
  });
});
