import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TestRunner } from '@/components/domain/testing';
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
  return { title: prompt ? `Tests — ${prompt.name}` : 'Tests' };
}

export default async function TestsPage({
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

  // Recent versions for the "run against" selector. Capped — the default
  // selection is always the latest version, which is guaranteed to be
  // inside this window, so no correctness is lost by capping here.
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

  // Fetch existing test cases
  const existingCases = await db
    .select()
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const hasVersions = allVersions.length > 0;

  return (
    <div className="p-4 sm:p-8 font-sans bg-background">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-border shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold text-foreground">Test Cases</h1>
          {existingCases.length > 0 && (
            <span className="shrink-0 font-mono text-xs bg-muted text-foreground border border-border px-2 py-0.5 rounded-full font-semibold">
              {existingCases.length} test{existingCases.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Gate: can't run tests without versions */}
      {!hasVersions ? (
        <EmptyState
          icon="v0"
          heading="No versions to test"
          description="Write at least one version of your prompt before adding test cases."
          cta={{ href: `/dashboard/prompts/${id}/edit`, label: 'Write first version' }}
        />
      ) : (
        <TestRunner
          promptId={id}
          versions={allVersions}
          initialTestCases={existingCases}
        />
      )}
    </div>
  );
}
