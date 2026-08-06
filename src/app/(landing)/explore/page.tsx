import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/domain/prompts';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { RelativeTime } from '@/components/layout';

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header Bar */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors">
              git-for-prompts
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 font-semibold">
              <Globe className="h-3.5 w-3.5" /> Explore Community
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight font-sans">Explore Prompts</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-sans leading-relaxed">
              {publicPrompts.length} public prompt{publicPrompts.length !== 1 ? 's' : ''} shared by the community
            </p>
          </div>
        </div>

        {/* Empty State */}
        {publicPrompts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground text-base font-semibold">No public prompts published yet</p>
            <p className="text-muted-foreground text-sm mt-1.5">Make a prompt public from your prompt detail page to share it with the community.</p>
          </div>
        ) : (
          /* Prompt Grid */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {publicPrompts.map((prompt) => {
              const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : 1;
              return (
                <div
                  key={prompt.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-border/80 hover:bg-accent/40 shadow-sm"
                >
                  <div>
                    {/* Name + version badge */}
                    <div className="flex items-center gap-2.5 mb-2.5 min-w-0">
                      <Link
                        href={`/explore/${prompt.id}`}
                        className="min-w-0 font-bold text-foreground hover:text-emerald-400 transition-colors line-clamp-1 text-base md:text-lg"
                      >
                        {prompt.name}
                      </Link>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md font-semibold">
                        v{versionNum}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed font-sans">
                      {prompt.description ?? 'No description'}
                    </p>
                  </div>

                  {/* Bottom row: view link + time + fork */}
                  <div className="flex items-center justify-between text-xs pt-4 border-t border-white/[0.06] gap-3">
                    <Link
                      href={`/explore/${prompt.id}`}
                      className="text-xs text-zinc-400 hover:text-[#f5f0eb] transition-colors font-mono font-semibold shrink-0"
                    >
                      View details →
                    </Link>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-zinc-500 font-mono">
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
      </main>
    </div>
  );
}
