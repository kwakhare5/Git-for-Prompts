/**
 * TestRunner — deep module for AI evaluation + result persistence.
 *
 * Interface: two functions, each with a single responsibility.
 *
 *   runEvaluations(promptContent, testCases) → EvalAttempt[]
 *   persistResults(versionId, attempts, label?) → { saved, persistError }
 *
 * Both `runTestsForVersion` and `runComparisonForVersions` delegate to these.
 * The server-action layer keeps: auth, rate-limit, ownership, revalidatePath.
 * This module keeps: AI orchestration, concurrency, bulk-upsert, correlation.
 *
 * Seam justification: two callers already (single-run + comparison). A third
 * (scheduled regression cron) will call this directly without going through
 * a server action.
 *
 * Test surface: mock this module's two exports to test the server-action layer
 * without touching AI or DB. The module itself is testable with a real DB and
 * a mock AI client.
 */

import { db } from '@/db';
import { testResults } from '@/db/schema';
import { runSingleTestCase, runWithConcurrency, MAX_CONCURRENT_TESTS } from '@/lib/ai';
import { eq, sql } from 'drizzle-orm';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TestCaseInput = {
  id: string;
  name: string;
  inputText: string;
  expectedCriteria: string;
};

export type EvalAttempt =
  | { ok: true; testCaseId: string; result: { passed: boolean; actualOutput: string; reason: string } }
  | { ok: false; testCaseId: string; message: string };

export type PersistResult = {
  saved: Map<string, { passed: boolean; actualOutput: string }>;
  persistError: string | null;
};

// ─── runEvaluations ──────────────────────────────────────────────────────────

/**
 * Run AI evaluation for every test case against a prompt version.
 * Concurrency-limited. No DB writes here — pure AI orchestration.
 */
export async function runEvaluations(
  promptContent: string,
  cases: TestCaseInput[],
  logPrefix = '[TestRunner]'
): Promise<EvalAttempt[]> {
  return runWithConcurrency(
    cases.map((tc) => async (): Promise<EvalAttempt> => {
      try {
        const result = await runSingleTestCase(promptContent, tc);
        return { ok: true, testCaseId: tc.id, result };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`${logPrefix} AI evaluation failed for test case ${tc.id}:`, message);
        return { ok: false, testCaseId: tc.id, message };
      }
    }),
    MAX_CONCURRENT_TESTS
  );
}

// ─── persistResults ──────────────────────────────────────────────────────────

type InsertRow = {
  versionId: string;
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
};

/**
 * Bulk-upsert evaluation results into testResults.
 * Upserts on (versionId, testCaseId) — re-running a test updates the row.
 * Returns a Map keyed by testCaseId for O(1) correlation, plus any persist error.
 *
 * Never throws — persistence failures are captured and returned so the caller
 * can honestly report which results were saved vs. which ran but weren't stored.
 */
export async function persistResults(
  rows: InsertRow[],
  logPrefix = '[TestRunner]'
): Promise<PersistResult> {
  if (rows.length === 0) return { saved: new Map(), persistError: null };

  try {
    const savedRows = await db
      .insert(testResults)
      .values(rows)
      .onConflictDoUpdate({
        target: [testResults.versionId, testResults.testCaseId],
        set: {
          passed: sql`excluded.passed`,
          actualOutput: sql`excluded.actual_output`,
          runAt: sql`now()`,
        },
      })
      .returning();

    // Keyed by "versionId:testCaseId" for comparison (mixed-version) lookups,
    // or just testCaseId for single-version lookups. Callers choose the key scheme.
    const saved = new Map(
      savedRows.map((s) => [`${s.versionId}:${s.testCaseId}`, { passed: s.passed, actualOutput: s.actualOutput }])
    );
    return { saved, persistError: null };
  } catch (err) {
    const persistError = err instanceof Error ? err.message : String(err);
    console.error(`${logPrefix} Bulk insert of test results failed:`, persistError);
    return { saved: new Map(), persistError };
  }
}
