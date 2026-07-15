/**
 * POST /api/cron/regression-tests
 *
 * Runs scheduled test suites for all prompts that have testSchedule set and
 * are due for a run. Fires webhook alerts if any tests fail.
 *
 * Authorization: Bearer ${CRON_SECRET}  (same pattern as keep-alive)
 * Triggered by: vercel.json cron ("0 2 * * *" = 2am UTC daily)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts, versions, testCases, testResults } from '@/db/schema';
import { eq, and, isNotNull, lt, or, isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { runSingleTestCase, runWithConcurrency, MAX_CONCURRENT_TESTS } from '@/lib/ai';
import { fireWebhooks } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5-minute Vercel function timeout

export async function POST(req: NextRequest) {
  // Auth — same guard as keep-alive
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('Authorization');
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find prompts due for a scheduled run
  const duePrompts = await db
    .select()
    .from(prompts)
    .where(
      and(
        isNotNull(prompts.testSchedule),
        isNotNull(prompts.currentVersionId),
        or(
          // Daily prompts not run in last 24h
          and(
            eq(prompts.testSchedule, 'daily'),
            or(isNull(prompts.lastScheduledTestAt), lt(prompts.lastScheduledTestAt, oneDayAgo))
          ),
          // Weekly prompts not run in last 7 days
          and(
            eq(prompts.testSchedule, 'weekly'),
            or(isNull(prompts.lastScheduledTestAt), lt(prompts.lastScheduledTestAt, oneWeekAgo))
          )
        )
      )
    );

  if (duePrompts.length === 0) {
    return NextResponse.json({ success: true, ran: 0, message: 'No prompts due for testing' });
  }

  const results: { promptId: string; passed: number; failed: number }[] = [];

  for (const prompt of duePrompts) {
    if (!prompt.currentVersionId) continue;

    try {
      // Get the current version
      const [currentVersion] = await db
        .select()
        .from(versions)
        .where(eq(versions.id, prompt.currentVersionId));

      if (!currentVersion) continue;

      // Get all test cases for this prompt
      const cases = await db
        .select()
        .from(testCases)
        .where(eq(testCases.promptId, prompt.id));

      if (cases.length === 0) {
        // Mark as run even if no test cases (avoids re-querying indefinitely)
        await db
          .update(prompts)
          .set({ lastScheduledTestAt: now })
          .where(eq(prompts.id, prompt.id));
        continue;
      }

      // Run AI evaluations concurrently
      const attempts = await runWithConcurrency(
        cases.map((tc) => async () => {
          try {
            const result = await runSingleTestCase(currentVersion.content, tc);
            return { ok: true as const, testCase: tc, result };
          } catch (err) {
            return { ok: false as const, testCase: tc, message: String(err) };
          }
        }),
        MAX_CONCURRENT_TESTS
      );

      // Persist results via upsert
      const rowsToInsert = attempts
        .filter((a): a is Extract<typeof a, { ok: true }> => a.ok)
        .map((a) => ({
          versionId: currentVersion.id,
          testCaseId: a.testCase.id,
          passed: a.result.passed,
          actualOutput: a.result.actualOutput,
        }));

      if (rowsToInsert.length > 0) {
        await db
          .insert(testResults)
          .values(rowsToInsert)
          .onConflictDoUpdate({
            target: [testResults.versionId, testResults.testCaseId],
            set: {
              passed: sql`excluded.passed`,
              actualOutput: sql`excluded.actual_output`,
              runAt: sql`now()`,
            },
          });
      }

      // Count failures
      const failedCount = attempts.filter((a) => !a.ok || !a.result.passed).length;
      const passedCount = attempts.length - failedCount;

      results.push({ promptId: prompt.id, passed: passedCount, failed: failedCount });

      // Update last run timestamp
      await db
        .update(prompts)
        .set({ lastScheduledTestAt: now })
        .where(eq(prompts.id, prompt.id));

      // Fire webhook alert if any tests failed
      if (failedCount > 0) {
        void fireWebhooks(prompt.ownerId, {
          event: 'version.created', // reuse event shape — callers can filter by event name
          promptId: prompt.id,
          promptName: prompt.name,
          versionId: currentVersion.id,
          versionNumber: currentVersion.versionNumber,
          commitMessage: `Scheduled test alert: ${failedCount}/${attempts.length} failed`,
          variables: currentVersion.variables,
          createdAt: now,
        });
      }
    } catch (err) {
      console.error(`[regression-cron] Failed for prompt ${prompt.id}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    ran: duePrompts.length,
    results,
    timestamp: now.toISOString(),
  });
}
