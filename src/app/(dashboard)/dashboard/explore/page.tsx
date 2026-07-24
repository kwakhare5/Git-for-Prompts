import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/app/(landing)/explore/fork-button';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Prompts — Git for Prompts',
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
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Explore Public Prompts</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Browse public prompt templates built by the community. Fork any prompt into your account to customize and version it.
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md">
          {publicPrompts.length} prompt{publicPrompts.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {/* Empty State */}
      {publicPrompts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
          <Sparkles className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm font-medium">No public prompts published yet</p>
          <p className="text-zinc-600 text-xs mt-1">Make a prompt public from your prompt detail page to share it with the community.</p>
        </div>
      ) : (
        /* Grid of Prompts */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicPrompts.map((prompt) => {
            const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : null;
            return (
              <div
                key={prompt.id}
                className="group flex flex-col justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/dashboard/explore/${prompt.id}`}
                      className="text-sm font-semibold text-zinc-50 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug"
                    >
                      {prompt.name}
                    </Link>
                    {versionNum != null && (
                      <span className="shrink-0 font-mono text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-1.5 py-0.5 rounded">
                        v{versionNum}
                      </span>
                    )}
                  </div>

                  {prompt.description ? (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {prompt.description}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">No description provided.</p>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {new Date(prompt.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/explore/${prompt.id}`}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1"
                    >
                      View
                    </Link>
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
