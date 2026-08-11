import { getAuthUserId } from '@/lib/auth';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DiffViewer, DiffVersionSelector } from '@/components/domain/diff';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';
import type { InferSelectModel } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

type Version = InferSelectModel<typeof versions>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const userId = await getAuthUserId();
  if (!userId) return { title: 'Diff · Git for Prompts' };

  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));
  return { title: prompt ? `Diff — ${prompt.name}` : 'Diff' };
}

export default async function DiffPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { from, to } = await searchParams;
  const userId = await getAuthUserId();
  if (!userId) return null;

  // Ownership check — never serve another user's data
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  const recentVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  const hasEnoughVersions = recentVersions.length >= 2;

  if (!hasEnoughVersions) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center gap-3 border-b border-zinc-800/90 pb-5">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 flex items-center gap-1"
            aria-label="Back to Studio"
          >
            <span>←</span>
            <span>Back to Studio ({prompt.name})</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold font-mono text-zinc-100">{prompt.name} Diff</h1>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 py-16 text-center text-zinc-400 font-mono bg-bg-card">
          <h2 className="text-sm font-bold text-zinc-200 mb-1">Need at least 2 commit snapshots</h2>
          <p className="text-xs text-zinc-500 mb-5 font-sans">Create another version of this prompt bundle to view Monaco side-by-side diffs.</p>
          <Link href={`/dashboard/prompts/${id}/edit`} className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl btn-interactive">
            + Create New Version
          </Link>
        </div>
      </div>
    );
  }

  async function resolveVersion(
    requestedId: string | undefined,
    fallback: 'oldest' | 'newest'
  ): Promise<Version> {
    if (requestedId) {
      const inWindow = recentVersions.find((v) => v.id === requestedId);
      if (inWindow) return inWindow;

      const [direct] = await db
        .select()
        .from(versions)
        .where(and(eq(versions.id, requestedId), eq(versions.promptId, id)));
      if (direct) return direct;
    }

    if (fallback === 'newest') {
      return recentVersions[0];
    }

    const [oldest] = await db
      .select()
      .from(versions)
      .where(eq(versions.promptId, id))
      .orderBy(versions.versionNumber)
      .limit(1);
    return oldest ?? recentVersions[recentVersions.length - 1];
  }

  const fromVersion = await resolveVersion(from, 'oldest');
  const toVersion = await resolveVersion(to, 'newest');

  const selectorVersions = [fromVersion, toVersion].reduce<Version[]>(
    (acc, v) => (acc.some((x) => x.id === v.id) ? acc : [...acc, v]),
    recentVersions
  );

  const fromLabel = `v${fromVersion.versionNumber}${
    fromVersion.commitMessage ? ` · ${fromVersion.commitMessage}` : ''
  }`;
  const toLabel = `v${toVersion.versionNumber}${
    toVersion.commitMessage ? ` · ${toVersion.commitMessage}` : ''
  }`;

  return (
    <div className="space-y-6 font-sans">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800/90 pb-5 gap-4">
        <div className="space-y-2 font-mono">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1 w-fit"
            aria-label="Back to Studio"
          >
            <span>←</span>
            <span>Back to Studio ({prompt.name})</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 truncate font-mono">{prompt.name} Diff</h1>
            <p className="text-xs text-blue-300 font-semibold mt-0.5">
              Comparing snapshot v{fromVersion.versionNumber} → v{toVersion.versionNumber}
            </p>
          </div>
        </div>

        {/* Version dropdowns */}
        <DiffVersionSelector
          promptId={id}
          versions={selectorVersions}
          fromId={fromVersion.id}
          toId={toVersion.id}
        />
      </div>

      {/* Diff editor */}
      <div className="rounded-2xl border border-zinc-800/90 bg-bg-card shadow-xl overflow-hidden p-2">
        <DiffViewer
          originalContent={fromVersion.content}
          modifiedContent={toVersion.content}
          originalLabel={fromLabel}
          modifiedLabel={toLabel}
          height="calc(100vh - 280px)"
        />
      </div>
    </div>
  );
}
