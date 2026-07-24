import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/fork-button';
import { EmptyState } from '@/components/ui/empty-state';
import { RelativeTime } from '@/components/relative-time';

export const metadata: Metadata = {
  title: 'Explore — Git for Prompts',
  description: 'Discover and fork community prompts inside your workspace.',
};

export default async function DashboardExplorePage() {
  // Fetch all public prompts
  const publicPrompts = await db
    .select({
      id: prompts.id,
      name: prompts.name,
      description: prompts.description,
      updatedAt: prompts.updatedAt,
      currentVersionId: prompts.currentVersionId,
    })
    .from(prompts)
    .where(eq(prompts.isPublic, true))
    .orderBy(desc(prompts.updatedAt));

  // Batch fetch version numbers
  const versionMap = new Map<string, number>();
  const currentVersionIds = publicPrompts
    .map((p) => p.currentVersionId)
    .filter((id): id is string => id != null);

  if (currentVersionIds.length > 0) {
    const vRows = await db
      .select({ id: versions.id, versionNumber: versions.versionNumber })
      .from(versions)
      .where(inArray(versions.id, currentVersionIds));

    for (const row of vRows) {
      versionMap.set(row.id, row.versionNumber);
    }
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header — identical layout to DashboardPage */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Explore Prompts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {publicPrompts.length} public prompt{publicPrompts.length !== 1 ? 's' : ''} in the community
          </p>
        </div>
      </div>

      {/* Empty State */}
      {publicPrompts.length === 0 && (
        <EmptyState
          icon="git init"
          heading="No public prompts yet"
          description="Make a prompt public from your prompt detail page to share it with the community."
        />
      )}

      {/* Prompt Grid — identical 3-column grid structure to DashboardPage */}
      {publicPrompts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publicPrompts.map((prompt) => {
            const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : 1;
            return (
              <div
                key={prompt.id}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div>
                  {/* Name + version badge */}
                  <div className="flex items-center gap-2 mb-2 min-w-0">
                    <Link
                      href={`/dashboard/explore/${prompt.id}`}
                      className="min-w-0 font-medium text-zinc-50 hover:text-zinc-300 transition-colors line-clamp-1"
                    >
                      {prompt.name}
                    </Link>
                    <span className="shrink-0 font-mono text-[10px] text-zinc-500 bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded">
                      v{versionNum}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    {prompt.description ?? 'No description'}
                  </p>
                </div>

                {/* Bottom row: view link + time + fork */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800/60 gap-3">
                  <Link
                    href={`/dashboard/explore/${prompt.id}`}
                    className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono shrink-0"
                  >
                    View details →
                  </Link>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-zinc-500">
                      <RelativeTime date={prompt.updatedAt} />
                    </span>
                    <ForkButton promptId={prompt.id} promptName={prompt.name} variant="secondary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
