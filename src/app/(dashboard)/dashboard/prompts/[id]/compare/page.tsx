import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CompareRunner } from '@/components/domain/diff';
import { EmptyState } from '@/components/ui/empty-state';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
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

  // Recent versions for the selectors (newest first). Capped — CompareRunner
  // always defaults to the two most recent versions (versions[0] /
  // versions[1]), so this window never breaks the default comparison; it
  // only limits how far back a user can manually pick from.
  const allVersions = await db
    .select({
      id: versions.id,
      versionNumber: versions.versionNumber,
      commitMessage: versions.commitMessage,
    })
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Real total, so the badge doesn't lie about how many versions exist
  // once a prompt's history exceeds the dropdown window. Cheap indexed
  // COUNT — negligible cost added to this page load.
  const [versionCountRow] = await db
    .select({ count: count() })
    .from(versions)
    .where(eq(versions.promptId, id));
  const totalVersionCount = versionCountRow?.count ?? allVersions.length;

  // Test case count
  const [tcCount] = await db
    .select({ count: count() })
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const testCaseCount = tcCount?.count ?? 0;
  const hasEnoughVersions = allVersions.length >= 2;

  return (
    <div className="p-4 sm:p-8 font-sans bg-background">
      <div className="flex items-center gap-3 min-w-0 mb-8">
        <Link
          href={`/dashboard/prompts/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          ← {prompt.name}
        </Link>
        <div className="h-4 w-px bg-border shrink-0" aria-hidden="true" />
        <h1 className="text-xl font-bold text-foreground">Compare</h1>
        {hasEnoughVersions && (
          <span className="shrink-0 font-mono text-xs bg-muted text-foreground border border-border px-2 py-0.5 rounded-full font-semibold">
            {totalVersionCount > allVersions.length
              ? `latest ${allVersions.length} of ${totalVersionCount} versions`
              : `${totalVersionCount} versions`}
          </span>
        )}
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
