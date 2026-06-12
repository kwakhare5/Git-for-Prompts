import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CompareRunner } from '@/components/compare-runner';
import { EmptyState } from '@/components/ui/empty-state';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(eq(prompts.id, id));
  return { title: prompt ? `Compare — ${prompt.name}` : 'Compare' };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Fetch versions for the selectors (newest first)
  const allVersions = await db
    .select({
      id: versions.id,
      versionNumber: versions.versionNumber,
      commitMessage: versions.commitMessage,
    })
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber));

  // Test case count
  const [tcCount] = await db
    .select({ count: count() })
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const testCaseCount = tcCount?.count ?? 0;
  const hasEnoughVersions = allVersions.length >= 2;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-3 min-w-0 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold text-zinc-50">Compare</h1>
          {hasEnoughVersions && (
            <span className="shrink-0 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              {allVersions.length} versions
            </span>
          )}
        </div>
      </div>

      {/* Gate: need ≥ 2 versions */}
      {!hasEnoughVersions ? (
        <EmptyState
          icon="v1 vs v?"
          heading="Need at least 2 versions"
          description="Save another version of this prompt to compare how it performs against your test cases."
          cta={{ href: `/dashboard/prompts/${id}/edit`, label: '+ New Version' }}
        />
      ) : testCaseCount === 0 ? (
        <EmptyState
          icon="assert()"
          heading="No test cases yet"
          description="Add at least one test case to run a comparison. Test cases define what your prompt must do to pass."
          cta={{ href: `/dashboard/prompts/${id}/tests`, label: 'Add test cases' }}
        />
      ) : (
        <CompareRunner
          promptId={id}
          versions={allVersions}
          testCaseCount={testCaseCount}
        />
      )}
    </div>
  );
}
