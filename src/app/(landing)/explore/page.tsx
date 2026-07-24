import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Prompts — Git for Prompts',
  description: 'Discover and fork community prompts. Browse public prompts shared by the Git for Prompts community.',
};

export const revalidate = 60; // ISR — refresh every 60s

export default async function ExplorePage() {
  // Fetch all public prompts with their latest version info
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

  // Batch-fetch the latest version number for each prompt
  const versionMap = new Map<string, number>();
  if (publicPrompts.length > 0) {
    const ids = publicPrompts.map((p) => p.currentVersionId).filter(Boolean) as string[];
    if (ids.length > 0) {
      const vRows = await db
        .select({ id: versions.id, versionNumber: versions.versionNumber })
        .from(versions)
        .where(eq(versions.promptId, publicPrompts[0]?.id ?? ''));
      // Use currentVersionId to look up the version number — already O(1) via the pointer
      for (const row of vRows) {
        versionMap.set(row.id, row.versionNumber);
      }
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
              ← Git for Prompts
            </Link>
            <h1 className="text-2xl font-bold text-zinc-50 mt-0.5">Explore</h1>
          </div>
          <p className="text-sm text-zinc-500">{publicPrompts.length} public prompts</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {publicPrompts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-600 text-sm font-mono">No public prompts yet.</p>
            <p className="text-zinc-700 text-xs mt-2">Be the first — make a prompt public from your dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/explore/${prompt.id}`}
                className="group flex flex-col gap-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                    {prompt.name}
                  </h2>
                  <span className="shrink-0 text-[10px] font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                    public
                  </span>
                </div>

                {prompt.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{prompt.description}</p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {new Date(prompt.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[10px] text-violet-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
