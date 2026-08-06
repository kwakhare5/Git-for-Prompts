import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DiffViewer, DiffVersionSelector } from '@/components/domain/diff';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';
import type { InferSelectModel } from 'drizzle-orm';

type Version = InferSelectModel<typeof versions>;

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

  // Recent versions for the selector dropdowns. Capped — a prompt can
  // accumulate thousands of versions, and rendering that many <option>
  // elements crashes the tab. This window covers the default comparison
  // (latest vs. oldest) and every case where the linked-to version is
  // recent; resolveVersion() below handles the rest without ever silently
  // substituting the wrong version.
  const recentVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Need at least 2 versions to show a meaningful diff
  if (recentVersions.length < 2) notFound();

  // Resolves the version for one side of the diff.
  //  - If a specific id was requested (?from=/&to=) and it's inside the
  //    recent window, use it directly — no extra query.
  //  - If it was requested but falls outside the window (an older version
  //    than our cap), fetch it explicitly by id, scoped to this prompt so
  //    a foreign/invalid id can never leak another prompt's content.
  //  - If nothing was requested, fall back to the true newest/oldest
  //    version — fetched directly for "oldest" since the true v1 may not
  //    be inside the capped window once a prompt has more than
  //    RECENT_VERSIONS_LIMIT versions.
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
      // Invalid/foreign id — fall through to the default below.
    }

    if (fallback === 'newest') {
      // recentVersions is ordered desc, so index 0 is always the true latest.
      return recentVersions[0];
    }

    // "oldest" — may not be in the capped window, so fetch it directly.
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

  // Guarantee both compared versions appear as options in the dropdowns,
  // even if one of them fell outside the recent window — otherwise the
  // <select value=...> would point at an id with no matching <option> and
  // silently show a blank/mismatched selection.
  const selectorVersions = [fromVersion, toVersion].reduce<Version[]>(
    (acc, v) => (acc.some((x) => x.id === v.id) ? acc : [...acc, v]),
    recentVersions
  );

  // Human-readable labels for each diff panel
  const fromLabel = `v${fromVersion.versionNumber}${
    fromVersion.commitMessage ? ` · ${fromVersion.commitMessage}` : ''
  }`;
  const toLabel = `v${toVersion.versionNumber}${
    toVersion.commitMessage ? ` · ${toVersion.commitMessage}` : ''
  }`;

  return (
    <div className="p-4 sm:p-8 font-sans bg-background">
      {/* Page header */}
      {/* #21: items-center instead of items-start — aligns version selector with the header text */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Back to prompt"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-border shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{prompt.name}</h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Comparing v{fromVersion.versionNumber} → v{toVersion.versionNumber}
            </p>
          </div>
        </div>

        {/* Version dropdowns — client component, updates URL params on change */}
        <DiffVersionSelector
          promptId={id}
          versions={selectorVersions}
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
