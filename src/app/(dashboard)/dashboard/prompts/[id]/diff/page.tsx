import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DiffViewer } from '@/components/diff-viewer';
import { DiffVersionSelector } from '@/components/diff-version-selector';
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
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check — never serve another user's data
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // All versions newest-first (for the selector dropdowns)
  const allVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber));

  // Need at least 2 versions to show a meaningful diff
  if (allVersions.length < 2) notFound();

  // Resolve which versions to compare.
  // Default: oldest version on the left, newest on the right.
  const fromVersion =
    allVersions.find((v) => v.id === from) ?? allVersions[allVersions.length - 1];
  const toVersion =
    allVersions.find((v) => v.id === to) ?? allVersions[0];

  // Human-readable labels for each diff panel
  const fromLabel = `v${fromVersion.versionNumber}${
    fromVersion.commitMessage ? ` · ${fromVersion.commitMessage}` : ''
  }`;
  const toLabel = `v${toVersion.versionNumber}${
    toVersion.commitMessage ? ` · ${toVersion.commitMessage}` : ''
  }`;

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      {/* #21: items-center instead of items-start — aligns version selector with the header text */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
            aria-label="Back to prompt"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-zinc-50 truncate">{prompt.name}</h1>
            <p className="text-xs text-zinc-600 font-mono mt-0.5">
              Comparing {allVersions.length} version{allVersions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Version dropdowns — client component, updates URL params on change */}
        <DiffVersionSelector
          promptId={id}
          versions={allVersions}
          fromId={fromVersion.id}
          toId={toVersion.id}
        />
      </div>

      {/* Diff editor with stats bar + column labels */}
      <DiffViewer
        originalContent={fromVersion.content}
        modifiedContent={toVersion.content}
        originalLabel={fromLabel}
        modifiedLabel={toLabel}
        height="calc(100vh - 240px)"
      />
    </div>
  );
}
