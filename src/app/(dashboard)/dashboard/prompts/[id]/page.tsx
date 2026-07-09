import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PromptDetailClient } from '@/components/prompt-detail-client';
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
  return { title: prompt?.name ?? 'Prompt' };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check — never serve another user's data
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Recent versions for the editor/history sidebar. Capped — a prompt's
  // version history is unbounded, and rendering thousands of version
  // cards (each with buttons, previews, restore actions) would hang the
  // tab. v[0] (latest) is always correct regardless of window size,
  // which is all this page needs by default.
  const allVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Test case count for the badge
  const [testCaseCount] = await db
    .select({ count: count() })
    .from(testCases)
    .where(eq(testCases.promptId, id));

  // Initial active version — always the latest; client-side switching is handled by PromptDetailClient
  const activeVersion = allVersions[0];

  const hasVersions = allVersions.length > 0;

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          >
            ← Prompts
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-50 truncate">{prompt.name}</h1>
              {hasVersions && (
                <span className="shrink-0 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                  v{allVersions[0].versionNumber}
                </span>
              )}
            </div>
            {prompt.description && (
              <p className="text-sm text-zinc-500 mt-0.5 truncate">{prompt.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasVersions && allVersions.length >= 2 && (
            <Link
              href={`/dashboard/prompts/${id}/diff`}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
            >
              Diff
            </Link>
          )}
          {hasVersions && allVersions.length >= 2 && (
            <Link
              href={`/dashboard/prompts/${id}/compare`}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
            >
              {/* D2: was "A/B Test" — renamed to match the /compare route */}
              Compare
            </Link>
          )}
          <Link
            href={`/dashboard/prompts/${id}/tests`}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
          >
            Tests
            {testCaseCount.count > 0 && (
              <span className="font-mono text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                {testCaseCount.count}
              </span>
            )}
          </Link>
          <Link
            href={`/dashboard/prompts/${id}/edit`}
            id="new-version-btn"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            <span aria-hidden="true">+</span>
            New Version
          </Link>
        </div>
      </div>

      {/* Main layout: editor left, history right */}
      {hasVersions ? (
        <PromptDetailClient
          promptId={id}
          versions={allVersions}
          initialActiveVersionId={activeVersion?.id}
        />
      ) : (
        <EmptyState
          icon="git init"
          heading="No versions yet"
          description="Write your first version of this prompt and save it to begin version control."
          cta={{ href: `/dashboard/prompts/${id}/edit`, label: 'Write first version' }}
        />
      )}
    </div>
  );
}
