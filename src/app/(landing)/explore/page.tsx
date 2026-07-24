import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/fork-button';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { RelativeTime } from '@/components/relative-time';

export const metadata: Metadata = {
  title: 'Explore Prompts — Git for Prompts',
  description: 'Discover and fork community prompts. Browse public prompts shared by the Git for Prompts community.',
};

export const revalidate = 60; // ISR — refresh every 60s

export default async function ExplorePage() {
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

  // Batch fetch version numbers for current version pointers
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header Bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-mono font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
              git-for-prompts
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
              <Globe className="h-3 w-3" /> Explore Community
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1"
          >
            Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Page Header — identical layout hierarchy */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Explore Prompts</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {publicPrompts.length} public prompt{publicPrompts.length !== 1 ? 's' : ''} in the community
            </p>
          </div>
        </div>

        {/* Empty State */}
        {publicPrompts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <Sparkles className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">No public prompts published yet</p>
            <p className="text-zinc-600 text-xs mt-1">Make a prompt public from your prompt detail page to share it with the community.</p>
          </div>
        ) : (
          /* Prompt Grid — identical 3-column grid structure */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {publicPrompts.map((prompt) => {
              const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : 1;
              return (
                <div
                  key={prompt.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  <div>
                    {/* Name + version badge */}
                    <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link
                          href={`/explore/${prompt.id}`}
                          className="min-w-0 font-medium text-zinc-50 hover:text-zinc-300 transition-colors line-clamp-1"
                        >
                          {prompt.name}
                        </Link>
                        <span className="shrink-0 font-mono text-[10px] text-zinc-500 bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded">
                          v{versionNum}
                        </span>
                      </div>
                      <ForkButton promptId={prompt.id} promptName={prompt.name} variant="secondary" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                      {prompt.description ?? 'No description'}
                    </p>
                  </div>

                  {/* Bottom row: view link + relative time */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800/60">
                    <Link
                      href={`/explore/${prompt.id}`}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
                    >
                      View details →
                    </Link>
                    <div className="text-zinc-500">
                      <RelativeTime date={prompt.updatedAt} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
