'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { PromptTableRow, type PromptRow } from './prompt-table-row';

import { PromptInspectorSheet } from './prompt-inspector-sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function PromptTable({ prompts }: { prompts: PromptRow[] }) {
  const [search, setSearch] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [inspectedPrompt, setInspectedPrompt] = useState<PromptRow | null>(null);

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    if (filterVisibility === 'public') return matchesSearch && p.isPublic;
    if (filterVisibility === 'private') return matchesSearch && !p.isPublic;
    return matchesSearch;
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter prompts by name, description, or ID..."
            className="pl-10 text-sm font-sans"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-sans shrink-0 border border-border">
          <Button
            onClick={() => setFilterVisibility('all')}
            variant={filterVisibility === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs font-medium cursor-pointer"
          >
            All ({prompts.length})
          </Button>
          <Button
            onClick={() => setFilterVisibility('public')}
            variant={filterVisibility === 'public' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs font-medium cursor-pointer"
          >
            Public ({prompts.filter((p) => p.isPublic).length})
          </Button>
          <Button
            onClick={() => setFilterVisibility('private')}
            variant={filterVisibility === 'private' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs font-medium cursor-pointer"
          >
            Private ({prompts.filter((p) => !p.isPublic).length})
          </Button>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden p-0 border-border">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-sans">
              <th className="py-3 pl-4 pr-3 sm:pl-6 text-xs font-medium text-muted-foreground font-sans">
                Prompt Bundle
              </th>
              <th className="py-3 px-3 text-xs font-medium text-muted-foreground font-sans hidden sm:table-cell">
                Evaluation Pass
              </th>
              <th className="py-3 px-3 text-xs font-medium text-muted-foreground font-sans hidden md:table-cell">
                Last Commit
              </th>
              <th className="py-3 pr-4 pl-3 sm:pr-6 text-right text-xs font-medium text-muted-foreground font-sans">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent font-sans">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <PromptTableRow key={prompt.id} prompt={prompt} onInspect={(p) => setInspectedPrompt(p)} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm font-sans text-muted-foreground">
                  No matching prompt bundles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <PromptInspectorSheet
        open={inspectedPrompt !== null}
        onOpenChange={(open) => {
          if (!open) setInspectedPrompt(null);
        }}
        prompt={inspectedPrompt}
      />
    </div>
  );
}
