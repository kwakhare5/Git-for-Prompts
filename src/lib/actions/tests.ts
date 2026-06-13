'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { versions, testCases, testResults, prompts } from '@/db/schema';
import { createTestCaseSchema, runTestsSchema, runComparisonSchema, deleteTestCaseSchema } from '@/lib/validations/test';
import { runSingleTestCase, runWithConcurrency, MAX_CONCURRENT_TESTS } from '@/lib/ai';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { ZodError } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

export async function createTestCase(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const validated = createTestCaseSchema.parse(input);

    // Verify prompt ownership
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, validated.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Prompt not found or access denied');

    const [testCase] = await db
      .insert(testCases)
      .values(validated)
      .returning();

    revalidatePath(`/dashboard/prompts/${validated.promptId}/tests`);
    return testCase;
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Prompt not found or access denied') throw err;
    if (err instanceof ZodError) throw new Error(err.issues[0].message);
    throw new Error('Failed to create test case');
  }
}

export async function deleteTestCase(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { testCaseId } = deleteTestCaseSchema.parse(input);

    // Get test case and verify ownership via prompt
    const [testCase] = await db
      .select()
      .from(testCases)
      .where(eq(testCases.id, testCaseId));

    if (!testCase) throw new Error('Test case not found');

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, testCase.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Access denied');

    await db.delete(testCases).where(eq(testCases.id, testCaseId));

    revalidatePath(`/dashboard/prompts/${testCase.promptId}/tests`);
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Test case not found') throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    if (err instanceof ZodError) throw new Error(err.issues[0].message);
    throw new Error('Failed to delete test case');
  }
}

export async function runTestsForVersion(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const limit = await checkRateLimit(userId);
  if (!limit.success) throw new Error('Rate limit exceeded. Please wait before running more tests.');

  try {
    const validated = runTestsSchema.parse(input);

    // Get the version + verify ownership via prompt
    const [version] = await db
      .select()
      .from(versions)
      .where(eq(versions.id, validated.versionId));

    if (!version) throw new Error('Version not found');

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, version.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Access denied');

    // Get all test cases for this prompt
    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.promptId, version.promptId));

    if (cases.length === 0) return [];

    // Run test cases with concurrency limiting to avoid AI rate limits
    const results = await runWithConcurrency(
      cases.map((testCase) => async () => {
        try {
          const result = await runSingleTestCase(version.content, testCase);

          const [saved] = await db
            .insert(testResults)
            .values({
              versionId: validated.versionId,
              testCaseId: testCase.id,
              passed: result.passed,
              actualOutput: result.actualOutput,
            })
            .returning();

          return { ...saved, reason: result.reason, testCase };
        } catch (err: unknown) {
          // If AI or DB insert fails, return a synthetic failure result
          // so the UI still gets a response for every test case
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[runTests] Failed for test case ${testCase.id}:`, msg);
          return {
            id: testCase.id,
            versionId: validated.versionId,
            testCaseId: testCase.id,
            passed: false,
            actualOutput: '',
            createdAt: new Date(),
            reason: 'Internal error — failed to run or save test result',
            testCase,
          };
        }
      }),
      MAX_CONCURRENT_TESTS
    );

    revalidatePath(`/dashboard/prompts/${version.promptId}/tests`);
    return results;
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Version not found') throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    throw new Error('Failed to run tests');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// runComparisonForVersions — Phase 7
// Runs every test case for a prompt against two versions in parallel.
// Returns { testCases, resultsA, resultsB } — each result is keyed by
// testCaseId so the client table can render them side-by-side.
// ─────────────────────────────────────────────────────────────────────────────

type ComparisonResult = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  reason?: string;
};

export async function runComparisonForVersions(input: unknown): Promise<{
  testCases: Array<{
    id: string;
    name: string;
    inputText: string;
    expectedCriteria: string;
  }>;
  resultsA: ComparisonResult[];
  resultsB: ComparisonResult[];
}> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const limit = await checkRateLimit(userId);
  if (!limit.success) throw new Error('Rate limit exceeded. Please wait before running comparisons.');

  try {
    const { versionIdA, versionIdB } = runComparisonSchema.parse(input);

    // Fetch both versions in parallel
    const [[versionA], [versionB]] = await Promise.all([
      db.select().from(versions).where(eq(versions.id, versionIdA)),
      db.select().from(versions).where(eq(versions.id, versionIdB)),
    ]);

    if (!versionA) throw new Error('Version A not found');
    if (!versionB) throw new Error('Version B not found');

    // Both versions must belong to the same prompt (and the user must own it)
    if (versionA.promptId !== versionB.promptId) {
      throw new Error('Versions must belong to the same prompt');
    }

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, versionA.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Access denied');

    // Fetch all test cases for this prompt
    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.promptId, versionA.promptId));

    if (cases.length === 0) {
      return { testCases: [], resultsA: [], resultsB: [] };
    }

    // Run both versions against every test case with concurrency limiting.
    // Each test case fires two AI calls (one per version) in parallel internally.
    const pairResults = await runWithConcurrency(
      cases.map((tc) => async () => {
        const [resA, resB] = await Promise.all([
          runSingleTestCase(versionA.content, tc).catch((err) => {
            console.error(`[comparison] vA failed for tc ${tc.id}:`, err);
            return { passed: false, actualOutput: '', reason: 'Internal error' };
          }),
          runSingleTestCase(versionB.content, tc).catch((err) => {
            console.error(`[comparison] vB failed for tc ${tc.id}:`, err);
            return { passed: false, actualOutput: '', reason: 'Internal error' };
          }),
        ]);

        // Persist both results (non-blocking — any DB failure is caught and logged)
        await Promise.allSettled([
          db.insert(testResults).values({
            versionId: versionIdA,
            testCaseId: tc.id,
            passed: resA.passed,
            actualOutput: resA.actualOutput,
          }),
          db.insert(testResults).values({
            versionId: versionIdB,
            testCaseId: tc.id,
            passed: resB.passed,
            actualOutput: resB.actualOutput,
          }),
        ]);

        return {
          testCaseId: tc.id,
          a: { passed: resA.passed, actualOutput: resA.actualOutput, reason: resA.reason },
          b: { passed: resB.passed, actualOutput: resB.actualOutput, reason: resB.reason },
        };
      }),
      MAX_CONCURRENT_TESTS
    );

    // Revalidate comparison and tests pages
    revalidatePath(`/dashboard/prompts/${versionA.promptId}/compare`);
    revalidatePath(`/dashboard/prompts/${versionA.promptId}/tests`);

    return {
      testCases: cases.map((tc) => ({
        id: tc.id,
        name: tc.name,
        inputText: tc.inputText,
        expectedCriteria: tc.expectedCriteria,
      })),
      resultsA: pairResults.map((r) => ({ testCaseId: r.testCaseId, ...r.a })),
      resultsB: pairResults.map((r) => ({ testCaseId: r.testCaseId, ...r.b })),
    };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message.includes('not found')) throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    if (err instanceof Error && err.message.includes('same prompt')) throw err;
    throw new Error('Failed to run comparison');
  }
}
