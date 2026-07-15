import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { prompts, versions, testResults } from "@/db/schema";
import { eq, desc, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { PromptCard } from "@/components/prompt-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Dashboard" };

async function getPromptsWithStats(userId: string) {
  // Single query for all prompts owned by user, newest first
  const userPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.ownerId, userId))
    .orderBy(desc(prompts.updatedAt));

  if (userPrompts.length === 0) return [];

  const promptIds = userPrompts.map((p) => p.id);

  // Batched: one query for all version counts
  const versionCounts = await db
    .select({ promptId: versions.promptId, count: count() })
    .from(versions)
    .where(inArray(versions.promptId, promptIds))
    .groupBy(versions.promptId);

  const versionCountMap = new Map(versionCounts.map((r) => [r.promptId, r.count]));

  // Use currentVersionId directly from the prompts table — already maintained
  // by insertNextVersion on every save. Eliminates the old query that fetched
  // ALL versions for ALL prompts just to find the latest one per prompt.
  const latestVersionIds = userPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  // Reverse map: currentVersionId → promptId (for correlating test results back)
  const versionToPromptMap = new Map(
    userPrompts
      .filter((p): p is typeof p & { currentVersionId: string } => p.currentVersionId != null)
      .map((p) => [p.currentVersionId, p.id])
  );

  // Get test results ONLY for the latest version of each prompt
  const latestTestResults =
    latestVersionIds.length > 0
      ? await db
          .select({
            versionId: testResults.versionId,
            testCaseId: testResults.testCaseId,
            passed: testResults.passed,
            runAt: testResults.runAt,
          })
          .from(testResults)
          .where(inArray(testResults.versionId, latestVersionIds))
      : [];

  // Dedup: per (versionId, testCaseId) keep only the most recent run.
  // This prevents multiple test runs from inflating the total count.
  const latestByKey = new Map<string, { passed: boolean; runAt: Date }>();
  for (const r of latestTestResults) {
    const key = `${r.versionId}:${r.testCaseId}`;
    const existing = latestByKey.get(key);
    if (!existing || r.runAt > existing.runAt) {
      latestByKey.set(key, { passed: r.passed, runAt: r.runAt });
    }
  }

  // Aggregate passed/total from the deduplicated results
  const testStatMap = new Map<string, { passed: number; total: number }>();
  for (const [key, result] of latestByKey) {
    const versionId = key.split(':')[0];
    const promptId = versionToPromptMap.get(versionId);
    if (!promptId) continue;
    const entry = testStatMap.get(promptId) ?? { passed: 0, total: 0 };
    entry.total += 1;
    if (result.passed) entry.passed += 1;
    testStatMap.set(promptId, entry);
  }

  return userPrompts.map((prompt) => {
    const tests = testStatMap.get(prompt.id) ?? { passed: 0, total: 0 };
    return {
      ...prompt,
      versionCount: versionCountMap.get(prompt.id) ?? 0,
      // testsPassed/testsTotal now reflects the LATEST version's most recent run only.
      // testsTotal === 0 means the current version has never been tested → card shows "No tests".
      testsPassed: tests.passed,
      testsTotal: tests.total,
    };
  });
}


export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const userPrompts = await getPromptsWithStats(userId);

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Prompts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {userPrompts.length} prompt{userPrompts.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
        >
          <span aria-hidden="true" className="text-base leading-none">+</span> New Prompt
        </Link>
      </div>

      {/* Empty state */}
      {userPrompts.length === 0 && (
        <EmptyState
          icon="git init"
          heading="No prompts yet"
          description="Create your first prompt to start versioning, testing, and iterating."
          cta={{ href: '/dashboard/new', label: 'Create your first prompt' }}
        />
      )}

      {/* Prompt grid */}
      {userPrompts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {userPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}
