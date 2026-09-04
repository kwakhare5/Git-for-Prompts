'use server';

import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { versions, testCases, prompts } from '@/db/schema';
import { createTestCaseSchema, runTestsSchema, runComparisonSchema, deleteTestCaseSchema } from '@/lib/validations/test';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { ZodError } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { runEvaluations, persistResults } from '@/lib/test-runner';


export async function createTestCase(input: unknown) {
  const userId = await getAuthUserId();
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
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { testCaseId } = deleteTestCaseSchema.parse(input);

    // Ownership check + test case fetch combined into a single joined query
    const [row] = await db
      .select({ testCase: testCases, promptOwnerId: prompts.ownerId })
      .from(testCases)
      .innerJoin(prompts, eq(testCases.promptId, prompts.id))
      .where(eq(testCases.id, testCaseId));

    if (!row) throw new Error('Test case not found');
    if (row.promptOwnerId !== userId) throw new Error('Access denied');

    await db.delete(testCases).where(eq(testCases.id, testCaseId));

    revalidatePath(`/dashboard/prompts/${row.testCase.promptId}/tests`);
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Test case not found') throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    if (err instanceof ZodError) throw new Error(err.issues[0].message);
    throw new Error('Failed to delete test case');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TestCaseOutcome — public return type for both run functions.
// `persisted` tells callers whether the result was written to testResults.
// ─────────────────────────────────────────────────────────────────────────────

export type TestCaseOutcome = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  reason: string;
  persisted: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// runTestsForVersion
//
// Auth · rate-limit · ownership here.
// AI evaluation + persistence delegated to TestRunner module.
// ─────────────────────────────────────────────────────────────────────────────

export async function runTestsForVersion(input: unknown): Promise<TestCaseOutcome[]> {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  const limit = await checkRateLimit(`expensive:${userId}`);
  if (!limit.success) throw new Error('Rate limit exceeded. Please wait before running more tests.');

  try {
    const validated = runTestsSchema.parse(input);

    // Version + ownership in one joined query
    const [row] = await db
      .select({ version: versions, promptOwnerId: prompts.ownerId })
      .from(versions)
      .innerJoin(prompts, eq(versions.promptId, prompts.id))
      .where(eq(versions.id, validated.versionId));

    if (!row) throw new Error('Version not found');
    if (row.promptOwnerId !== userId) throw new Error('Access denied');
    const version = row.version;

    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.promptId, version.promptId));

    if (cases.length === 0) return [];

    // Delegate AI + persistence to TestRunner
    // When a bundle is present: pass the bundle's systemPrompt so it's used as the
    // system message, with content as the user template.
    const systemPrompt = version.bundle?.systemPrompt ?? null;
    const attempts = await runEvaluations(version.content, cases, '[TestRunner]', systemPrompt);

    const rowsToInsert = attempts
      .filter((a): a is Extract<typeof a, { ok: true }> => a.ok)
      .map((a) => ({
        versionId: validated.versionId,
        testCaseId: a.testCaseId,
        passed: a.result.passed,
        actualOutput: a.result.actualOutput,
      }));

    const { saved, persistError } = await persistResults(rowsToInsert);

    const outcomes: TestCaseOutcome[] = attempts.map((a) => {
      if (!a.ok) {
        return { testCaseId: a.testCaseId, passed: false, actualOutput: '', reason: `AI Error: ${a.message}`, persisted: false };
      }
      const key = `${validated.versionId}:${a.testCaseId}`;
      if (persistError || !saved.has(key)) {
        return {
          testCaseId: a.testCaseId,
          passed: a.result.passed,
          actualOutput: a.result.actualOutput,
          reason: `${a.result.reason} (not saved: ${persistError ?? 'unknown persistence error'})`,
          persisted: false,
        };
      }
      return { testCaseId: a.testCaseId, passed: a.result.passed, actualOutput: a.result.actualOutput, reason: a.result.reason, persisted: true };
    });

    revalidatePath(`/dashboard/prompts/${version.promptId}/tests`);
    return outcomes;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized' || err.message === 'Version not found' || err.message === 'Access denied') {
        throw err;
      }
      if (err.message.includes('Rate limit') || err.message.includes('quota') || err.message.includes('balance') || err.message.includes('credits')) {
        throw err;
      }
    }
    throw new Error('Failed to run tests');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// runComparisonForVersions
//
// Auth · rate-limit · ownership here.
// AI evaluation + persistence delegated to TestRunner module.
// ─────────────────────────────────────────────────────────────────────────────

type ComparisonResult = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  reason: string;
  persisted: boolean;
};

export async function runComparisonForVersions(input: unknown): Promise<{
  testCases: Array<{ id: string; name: string; inputText: string; expectedCriteria: string }>;
  resultsA: ComparisonResult[];
  resultsB: ComparisonResult[];
}> {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Unauthorized');

  const limit = await checkRateLimit(`expensive:${userId}`);
  if (!limit.success) throw new Error('Rate limit exceeded. Please wait before running comparisons.');

  try {
    const { versionIdA, versionIdB } = runComparisonSchema.parse(input);

    const [[versionA], [versionB]] = await Promise.all([
      db.select().from(versions).where(eq(versions.id, versionIdA)),
      db.select().from(versions).where(eq(versions.id, versionIdB)),
    ]);

    if (!versionA) throw new Error('Version A not found');
    if (!versionB) throw new Error('Version B not found');
    if (versionA.promptId !== versionB.promptId) throw new Error('Versions must belong to the same prompt');

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, versionA.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Access denied');

    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.promptId, versionA.promptId));

    if (cases.length === 0) return { testCases: [], resultsA: [], resultsB: [] };

    // Run both sides in parallel via TestRunner
    // Pass bundle systemPrompt for each side if available.
    const [attemptsA, attemptsB] = await Promise.all([
      runEvaluations(versionA.content, cases, '[ComparisonA]', versionA.bundle?.systemPrompt ?? null),
      runEvaluations(versionB.content, cases, '[ComparisonB]', versionB.bundle?.systemPrompt ?? null),
    ]);

    // Collect all rows for a single bulk upsert across both versions
    const rowsToInsert = [
      ...attemptsA.filter((a): a is Extract<typeof a, { ok: true }> => a.ok).map((a) => ({
        versionId: versionIdA, testCaseId: a.testCaseId, passed: a.result.passed, actualOutput: a.result.actualOutput,
      })),
      ...attemptsB.filter((a): a is Extract<typeof a, { ok: true }> => a.ok).map((a) => ({
        versionId: versionIdB, testCaseId: a.testCaseId, passed: a.result.passed, actualOutput: a.result.actualOutput,
      })),
    ];

    const { saved, persistError } = await persistResults(rowsToInsert, '[Comparison]');

    function toResult(attempt: (typeof attemptsA)[number], versionId: string): ComparisonResult {
      if (!attempt.ok) {
        return { testCaseId: attempt.testCaseId, passed: false, actualOutput: '', reason: `AI Error: ${attempt.message}`, persisted: false };
      }
      const wasSaved = !persistError && saved.has(`${versionId}:${attempt.testCaseId}`);
      return {
        testCaseId: attempt.testCaseId,
        passed: attempt.result.passed,
        actualOutput: attempt.result.actualOutput,
        reason: wasSaved ? attempt.result.reason : `${attempt.result.reason} (not saved: ${persistError ?? 'unknown persistence error'})`,
        persisted: wasSaved,
      };
    }

    revalidatePath(`/dashboard/prompts/${versionA.promptId}/compare`);
    revalidatePath(`/dashboard/prompts/${versionA.promptId}/tests`);

    return {
      testCases: cases.map((tc) => ({ id: tc.id, name: tc.name, inputText: tc.inputText, expectedCriteria: tc.expectedCriteria })),
      resultsA: attemptsA.map((a) => toResult(a, versionIdA)),
      resultsB: attemptsB.map((a) => toResult(a, versionIdB)),
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized' || err.message.includes('not found') || err.message === 'Access denied' || err.message.includes('same prompt')) {
        throw err;
      }
      if (err.message.includes('Rate limit') || err.message.includes('quota') || err.message.includes('balance') || err.message.includes('credits')) {
        throw err;
      }
    }
    throw new Error('Failed to run comparison');
  }
}
