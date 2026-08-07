import { PageHeader, Topbar, RelativeTime } from "@/components/layout";
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ForkButton } from '@/components/domain/prompts';
import { EmptyState } from '@/components/ui/empty-state';
import { Compass, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Prompts · Git for Prompts',
  description: 'Discover and fork community prompts inside your workspace.',
};

export default async function DashboardExplorePage() {
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
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      <Topbar />

      <div className="p-6 lg:p-8 space-y-8 font-sans max-w-7xl w-full mx-auto">
        <PageHeader
          title="Explore Public Prompts"
          subtitle="Discover, inspect, and fork open-source prompts directly into your workspace."
          badge={{ label: "Community Library", variant: "violet", icon: Compass }}
        />

        {publicPrompts.length === 0 && (
          <EmptyState
            icon="git init"
            heading="No public prompts yet"
            description="Make a prompt public from your prompt detail page to share it with the community."
          />
        )}

        {publicPrompts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 font-sans">
            {publicPrompts.map((prompt) => {
              const versionNum = prompt.currentVersionId ? versionMap.get(prompt.currentVersionId) : 1;
              return (
                <div
                  key={prompt.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl flex flex-col justify-between font-sans"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40 font-mono">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-destructive/75 shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/75 shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/75 shrink-0" />
                      <span className="ml-1 text-xs font-mono text-muted-foreground font-semibold truncate">
                        v{versionNum}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0 font-semibold">
                      public
                    </span>
                  </div>

                  <div className="p-5 bg-card flex-1 flex flex-col justify-between gap-3 font-sans">
                    <div>
                      <Link
                        href={`/dashboard/explore/${prompt.id}`}
                        className="font-semibold text-foreground hover:text-amber-400 transition-colors line-clamp-1 text-sm font-sans block mb-1"
                      >
                        {prompt.name}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2 font-sans leading-relaxed">
                        {prompt.description ?? 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border gap-3 font-mono">
                      <Link
                        href={`/dashboard/explore/${prompt.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono shrink-0 flex items-center gap-1"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-muted-foreground text-xs font-mono">
                          <RelativeTime date={prompt.updatedAt} />
                        </span>
                        <ForkButton promptId={prompt.id} promptName={prompt.name} variant="secondary" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
