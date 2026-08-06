'use client';

import { useState, useTransition } from 'react';
import { createWebhook, deleteWebhook } from '@/lib/actions/webhooks';

interface Webhook {
  id: string;
  url: string;
  promptId: string | null;
  label: string | null;
  createdAt: Date;
}

interface WebhooksClientProps {
  webhooks: Webhook[];
}

export function WebhooksClient({ webhooks: initialWebhooks }: WebhooksClientProps) {
  const [hooks, setHooks] = useState(initialWebhooks);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!url.trim()) return;
    setError(null);
    setNewSecret(null);

    startTransition(async () => {
      try {
        const result = await createWebhook({ url: url.trim(), label: label.trim() || undefined });
        setNewSecret(result.secret);
        setUrl('');
        setLabel('');
        // Refresh list via server revalidation — page will update on next navigation,
        // optimistically add a placeholder row for now
        setHooks((prev) => [
          ...prev,
          {
            id: result.id,
            url: url.trim(),
            promptId: null,
            label: label.trim() || null,
            createdAt: new Date(),
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create webhook');
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteWebhook({ webhookId: id });
        setHooks((prev) => prev.filter((h) => h.id !== id));
        setConfirmDeleteId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete webhook');
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* New secret — shown once after creation */}
      {newSecret && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col gap-2 shadow-sm">
          <p className="text-sm font-semibold text-emerald-400 font-sans">Webhook created — copy your secret now</p>
          <p className="text-xs text-emerald-500 font-sans">This will not be shown again.</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs font-mono text-emerald-300 bg-[#111111] border border-white/[0.08] rounded-xl px-3.5 py-2.5 break-all">
              {newSecret}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(newSecret)}
              className="shrink-0 text-xs text-zinc-300 hover:text-white px-3.5 py-2.5 rounded-xl border border-white/[0.1] hover:border-white/20 transition-all font-mono font-semibold"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setNewSecret(null)}
            className="self-end text-xs text-zinc-400 hover:text-zinc-200 transition-colors mt-1 font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#161616] border border-white/[0.08] shadow-sm font-sans">
        <p className="text-base font-bold text-[#f5f0eb]">Register new webhook</p>
        <input
          type="url"
          placeholder="https://your-server.com/webhook"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-[#111111] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f5f0eb] placeholder:text-zinc-500 focus:outline-none focus:border-white/20 font-mono transition-colors"
        />
        <input
          type="text"
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={255}
          className="bg-[#111111] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f5f0eb] placeholder:text-zinc-500 focus:outline-none focus:border-white/20 font-mono transition-colors"
        />
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={isPending || !url.trim()}
          className="self-start bg-[#f5f0eb] hover:bg-white text-zinc-950 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {isPending ? 'Creating…' : 'Add Webhook'}
        </button>
      </div>

      {/* Existing webhooks list */}
      {hooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] py-12 text-center bg-[#161616]">
          <p className="text-base font-semibold text-[#f5f0eb]">No webhooks registered yet.</p>
          <p className="text-xs text-zinc-400 mt-1.5 font-sans">Add your first webhook URL above.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-[#161616] divide-y divide-white/[0.08] shadow-sm">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className="flex items-center justify-between gap-4 px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0 font-sans">
                {hook.label && (
                  <span className="text-sm font-semibold text-[#f5f0eb] truncate">{hook.label}</span>
                )}
                <span className="text-xs font-mono text-zinc-400 truncate">{hook.url}</span>
                <span className="text-xs font-mono text-zinc-500">
                  {hook.promptId ? `Prompt-specific` : 'Global'} ·{' '}
                  {new Date(hook.createdAt).toLocaleDateString()}
                </span>
              </div>

              {confirmDeleteId === hook.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-400 font-sans">Delete?</span>
                  <button
                    onClick={() => handleDelete(hook.id)}
                    disabled={isPending}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2.5 py-1 rounded-lg border border-red-900/60 bg-red-950/40 font-mono font-semibold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(hook.id)}
                  className="shrink-0 text-xs text-zinc-500 hover:text-red-400 transition-colors px-2.5 py-1 rounded-lg hover:bg-red-950/20 font-mono"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
