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

type TestCaseRow = typeof testCases.$inferSelect;

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

    // Ownership check + test case fetch combined into a single joined query
    // (previously two sequential round trips: select testCase, then select prompt).
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
// runTestsForVersion
//
// Return shape is unchanged from the caller's perspective (test-runner.tsx
// keys off testCaseId / passed / actualOutput / reason and keeps working
// with zero changes) — one field is ADDED, not changed: `persisted`.
//
// WHY: the old code caught AI failures AND DB insert failures in the same
// catch block and returned a synthetic `{ passed: false, actualOutput: '' }`
// row that was indistinguishable from a real evaluation, then wrote that
// same fabricated data into testResults — permanently corrupting a prompt's
// pass-rate history with rows that never represented a real AI run.
//
// Now: AI evaluation and DB persistence are two separate phases. A result is
// only ever written to testResults if it's a real evaluation. `persisted`
// tells the caller (today, silently ignored; tomorrow, could render a
// distinct "ran but didn't save" state) whether this row actually exists in
// history or is a same-request-only failure report.
// ─────────────────────────────────────────────────────────────────────────────

type EvalAttempt =
  | { ok: true; testCase: TestCaseRow; result: { passed: boolean; actualOutput: string; reason: string } }
  | { ok: false; testCase: TestCaseRow; message: string };

export type TestCaseOutcome = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  reason: string;
  persisted: boolean;
};

export async function runTestsForVersion(input: unknown): Promise<TestCaseOutcome[]> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const limit = await checkRateLimit(userId);
  if (!limit.success) throw new Error('Rate limit exceeded. Please wait before running more tests.');

  try {
    const validated = runTestsSchema.parse(input);

    // Version + ownership check combined into one joined query
    // (previously two sequential round trips: select version, then select prompt).
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

    // Phase 1 — run AI evaluation only, concurrency-limited. No DB writes here.
    const attempts: EvalAttempt[] = await runWithConcurrency(
      cases.map((testCase) => async (): Promise<EvalAttempt> => {
        try {
          const result = await runSingleTestCase(version.content, testCase);
          return { ok: true, testCase, result };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`[runTests] AI evaluation failed for test case ${testCase.id}:`, message);
          return { ok: false, testCase, message };
        }
      }),
      MAX_CONCURRENT_TESTS
    );

    // Phase 2 — one bulk insert for every real evaluation (was: up to N
    // separate inserts, one per test case, each a full DB round trip).
    const successfulAttempts = attempts.filter(
      (a): a is Extract<EvalAttempt, { ok: true }> => a.ok
    );

    const rowsToInsert = successfulAttempts.map((a) => ({
      versionId: validated.versionId,
      testCaseId: a.testCase.id,
      passed: a.result.passed,
      actualOutput: a.result.actualOutput,
    }));

    let saved: (typeof testResults.$inferSelect)[] = [];
    let persistError: string | null = null;

    if (rowsToInsert.length > 0) {
      try {
        saved = await db.insert(testResults).values(rowsToInsert).returning();
      } catch (err) {
        // A DB failure here used to be swallowed per-test-case with a fake
        // row. Now it's caught once, logged once, and every evaluation from
        // this run is honestly reported as unsaved rather than invented.
        persistError = err instanceof Error ? err.message : String(err);
        console.error('[runTests] Bulk insert of test results failed:', persistError);
      }
    }

    // Correlate by testCaseId rather than assuming RETURNING preserves
    // VALUES-list order — Postgres doesn't guarantee that, so trusting
    // positional order here would silently pair results with the wrong
    // test case under the exact conditions we're trying to make safe.
    const savedByTestCaseId = new Map(saved.map((s) => [s.testCaseId, s]));

    const outcomes: TestCaseOutcome[] = attempts.map((a) => {
      if (!a.ok) {
        return {
          testCaseId: a.testCase.id,
          passed: false,
          actualOutput: '',
          reason: `AI Error: ${a.message}`,
          persisted: false,
        };
      }
      if (persistError || !savedByTestCaseId.has(a.testCase.id)) {
        return {
          testCaseId: a.testCase.id,
          passed: a.result.passed,
          actualOutput: a.result.actualOutput,
          reason: `${a.result.reason} (not saved: ${persistError ?? 'unknown persistence error'})`,
          persisted: false,
        };
      }
      return {
        testCaseId: a.testCase.id,
        passed: a.result.passed,
        actualOutput: a.result.actualOutput,
        reason: a.result.reason,
        persisted: true,
      };
    });

    revalidatePath(`/dashboard/prompts/${version.promptId}/tests`);
    return outcomes;
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message === 'Version not found') throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    throw new Error('Failed to run tests');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// runComparisonForVersions — same fix pattern as runTestsForVersion:
// AI calls and DB writes are separate phases, nothing fake gets persisted,
// and one bulk insert replaces what was up to 2×N individual inserts guarded
// by a Promise.allSettled that discarded failures with no signal to the caller.
// ─────────────────────────────────────────────────────────────────────────────

type ComparisonResult = {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  reason: string;
  persisted: boolean;
};

type SideAttempt =
  | { ok: true; result: { passed: boolean; actualOutput: string; reason: string } }
  | { ok: false; message: string };

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

    const [[versionA], [versionB]] = await Promise.all([
      db.select().from(versions).where(eq(versions.id, versionIdA)),
      db.select().from(versions).where(eq(versions.id, versionIdB)),
    ]);

    if (!versionA) throw new Error('Version A not found');
    if (!versionB) throw new Error('Version B not found');

    if (versionA.promptId !== versionB.promptId) {
      throw new Error('Versions must belong to the same prompt');
    }

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, versionA.promptId), eq(prompts.ownerId, userId)));

    if (!prompt) throw new Error('Access denied');

    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.promptId, versionA.promptId));

    if (cases.length === 0) {
      return { testCases: [], resultsA: [], resultsB: [] };
    }

    // Phase 1 — AI evaluation only, both sides in parallel per test case,
    // whole set concurrency-limited. No DB writes here.
    const pairAttempts = await runWithConcurrency(
      cases.map((tc) => async (): Promise<{ testCaseId: string; a: SideAttempt; b: SideAttempt }> => {
        const [a, b] = await Promise.all([
          runSingleTestCase(versionA.content, tc)
            .then((result): SideAttempt => ({ ok: true, result }))
            .catch((err): SideAttempt => ({ ok: false, message: err instanceof Error ? err.message : String(err) })),
          runSingleTestCase(versionB.content, tc)
            .then((result): SideAttempt => ({ ok: true, result }))
            .catch((err): SideAttempt => ({ ok: false, message: err instanceof Error ? err.message : String(err) })),
        ]);
        return { testCaseId: tc.id, a, b };
      }),
      MAX_CONCURRENT_TESTS
    );

    // Phase 2 — one bulk insert for every real evaluation on both sides.
    const rowsToInsert: Array<{ versionId: string; testCaseId: string; passed: boolean; actualOutput: string }> = [];
    for (const pair of pairAttempts) {
      if (pair.a.ok) {
        rowsToInsert.push({ versionId: versionIdA, testCaseId: pair.testCaseId, passed: pair.a.result.passed, actualOutput: pair.a.result.actualOutput });
      }
      if (pair.b.ok) {
        rowsToInsert.push({ versionId: versionIdB, testCaseId: pair.testCaseId, passed: pair.b.result.passed, actualOutput: pair.b.result.actualOutput });
      }
    }

    let saved: (typeof testResults.$inferSelect)[] = [];
    let persistError: string | null = null;

    if (rowsToInsert.length > 0) {
      try {
        saved = await db.insert(testResults).values(rowsToInsert).returning();
      } catch (err) {
        persistError = err instanceof Error ? err.message : String(err);
        console.error('[comparison] Bulk insert of test results failed:', persistError);
      }
    }

    // Keyed by (versionId, testCaseId) since the bulk insert mixes both sides.
    const savedByKey = new Map(saved.map((s) => [`${s.versionId}:${s.testCaseId}`, s]));

    function toComparisonResult(testCaseId: string, versionId: string, attempt: SideAttempt): ComparisonResult {
      if (!attempt.ok) {
        return { testCaseId, passed: false, actualOutput: '', reason: `AI Error: ${attempt.message}`, persisted: false };
      }
      const wasSaved = !persistError && savedByKey.has(`${versionId}:${testCaseId}`);
      return {
        testCaseId,
        passed: attempt.result.passed,
        actualOutput: attempt.result.actualOutput,
        reason: wasSaved ? attempt.result.reason : `${attempt.result.reason} (not saved: ${persistError ?? 'unknown persistence error'})`,
        persisted: wasSaved,
      };
    }

    const resultsA = pairAttempts.map((p) => toComparisonResult(p.testCaseId, versionIdA, p.a));
    const resultsB = pairAttempts.map((p) => toComparisonResult(p.testCaseId, versionIdB, p.b));

    revalidatePath(`/dashboard/prompts/${versionA.promptId}/compare`);
    revalidatePath(`/dashboard/prompts/${versionA.promptId}/tests`);

    return {
      testCases: cases.map((tc) => ({
        id: tc.id,
        name: tc.name,
        inputText: tc.inputText,
        expectedCriteria: tc.expectedCriteria,
      })),
      resultsA,
      resultsB,
    };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') throw err;
    if (err instanceof Error && err.message.includes('not found')) throw err;
    if (err instanceof Error && err.message === 'Access denied') throw err;
    if (err instanceof Error && err.message.includes('same prompt')) throw err;
    throw new Error('Failed to run comparison');
  }
}
