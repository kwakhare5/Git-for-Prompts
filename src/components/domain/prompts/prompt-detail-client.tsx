'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PromptEditor } from './prompt-editor';
import { VersionHistory } from './version-history';
import { togglePromptVisibility, deletePrompt } from '@/lib/actions/prompts';
import { Globe, Lock, Copy, Check, Trash2, Code } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import type { versions } from '@/db/schema';

type Version = InferSelectModel<typeof versions>;

interface PromptDetailClientProps {
  promptId: string;
  versions: Version[];
  totalVersionCount: number;
  initialActiveVersionId?: string;
  isPublic: boolean;
}

export function PromptDetailClient({
  promptId,
  versions,
  totalVersionCount,
  initialActiveVersionId,
  isPublic: initialIsPublic,
}: PromptDetailClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(initialActiveVersionId);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [toggling, startToggle] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const activeVersion = versions.find((v) => v.id === selectedId) ?? versions[0];
  const modelConfig = (activeVersion?.bundle as { modelConfig?: { provider?: string; model?: string; temperature?: number; maxTokens?: number } })?.modelConfig;

  const curlSnippet = `curl -X GET "${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/prompts/${promptId}/latest" \\
  -H "Authorization: Bearer gfp_live_YOUR_KEY"`;

  function handleDelete() {
    if (!confirm('Are you sure you want to delete this prompt repository? This action cannot be undone.')) return;
    startDelete(async () => {
      await deletePrompt({ promptId });
      router.push('/dashboard');
    });
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start font-sans">
      <div className="space-y-4">
        {activeVersion && (
          <PromptEditor
            key={activeVersion.id}
            promptId={promptId}
            initialContent={activeVersion.content}
            readOnly
            height="calc(100vh - 300px)"
          />
        )}
      </div>

      <div className="flex flex-col gap-4 font-sans bg-bg-card p-5 border border-zinc-800/90 rounded-2xl shadow-xl">
        {/* Version Timeline Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-sans">
            <h2 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-wider">
              Version Timeline
            </h2>
            <span className="text-[11px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-lg">
              {totalVersionCount} {totalVersionCount === 1 ? 'snapshot' : 'snapshots'}
            </span>
          </div>
          {totalVersionCount > versions.length && (
            <p className="text-[11px] text-zinc-400 font-mono">
              Showing latest {versions.length} of {totalVersionCount}
            </p>
          )}
          <VersionHistory
            promptId={promptId}
            versions={versions}
            activeVersionId={activeVersion?.id}
            onVersionSelect={setSelectedId}
          />
        </div>

        {/* Model Config Details */}
        {modelConfig && (
          <div className="pt-3 border-t border-zinc-800/80 font-mono text-xs space-y-2">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Active Snapshot Specs
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-bg-page p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Provider</span>
                <span className="text-zinc-200 font-bold">{modelConfig.provider ?? 'groq'}</span>
              </div>
              <div className="bg-bg-page p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Model</span>
                <span className="text-blue-300 font-bold truncate block">{modelConfig.model ?? 'llama-3.3-70b'}</span>
              </div>
              <div className="bg-bg-page p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Temperature</span>
                <span className="text-emerald-300 font-bold">{modelConfig.temperature ?? 0.7}</span>
              </div>
              <div className="bg-bg-page p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Max Tokens</span>
                <span className="text-zinc-200 font-bold">{modelConfig.maxTokens ?? 1024}</span>
              </div>
            </div>
          </div>
        )}

        {/* cURL API Code Snippet Box */}
        <div className="pt-3 border-t border-zinc-800/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-blue-300" /> API cURL Fetch
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(curlSnippet);
                setCopiedCurl(true);
                setTimeout(() => setCopiedCurl(false), 2000);
              }}
              className="text-xs text-blue-300 hover:text-blue-200 font-bold cursor-pointer flex items-center gap-1"
            >
              {copiedCurl ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-bg-page p-3 border border-zinc-800 rounded-xl text-zinc-300 text-[10px] leading-relaxed overflow-x-auto">
            {curlSnippet}
          </pre>
        </div>

        {/* Repository Actions */}
        <div className="pt-3 border-t border-zinc-800/80 font-mono text-xs space-y-2">
          <button
            onClick={() =>
              startToggle(async () => {
                const updated = await togglePromptVisibility(promptId);
                setIsPublic(updated.isPublic);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
              })
            }
            disabled={toggling}
            className="w-full flex items-center justify-between border border-zinc-800 bg-bg-panel hover:bg-zinc-700 px-3.5 py-2.5 rounded-xl text-xs text-zinc-200 transition-all active:scale-97 cursor-pointer"
            aria-label={isPublic ? 'Make this prompt private' : 'Make this prompt public'}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              {isPublic ? (
                <Globe className="h-3.5 w-3.5 text-emerald-300" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-zinc-400" />
              )}
              {isPublic ? 'Public Repository' : 'Private Repository'}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {toggling ? '…' : showSuccess ? '✓ Saved' : isPublic ? 'Make Private' : 'Make Public'}
            </span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 rounded-xl text-xs text-rose-300 font-bold transition-all active:scale-97 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? 'Deleting…' : 'Delete Repository'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
