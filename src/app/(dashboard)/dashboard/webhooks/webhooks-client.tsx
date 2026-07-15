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
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800 flex flex-col gap-2">
          <p className="text-xs font-semibold text-emerald-400">Webhook created — copy your secret now</p>
          <p className="text-[11px] text-emerald-600">This will not be shown again.</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs font-mono text-emerald-300 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 break-all">
              {newSecret}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(newSecret)}
              className="shrink-0 text-xs text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setNewSecret(null)}
            className="self-end text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <p className="text-xs font-medium text-zinc-400">Register new webhook</p>
        <input
          type="url"
          placeholder="https://your-server.com/webhook"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={255}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={isPending || !url.trim()}
          className="self-start bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded transition-all disabled:opacity-30"
        >
          {isPending ? 'Creating…' : 'Add Webhook'}
        </button>
      </div>

      {/* Existing webhooks list */}
      {hooks.length === 0 ? (
        <p className="text-sm text-zinc-600 font-mono text-center py-6">No webhooks yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                {hook.label && (
                  <span className="text-xs font-medium text-zinc-300 truncate">{hook.label}</span>
                )}
                <span className="text-xs font-mono text-zinc-500 truncate">{hook.url}</span>
                <span className="text-[10px] text-zinc-700">
                  {hook.promptId ? `Prompt-specific` : 'Global'} ·{' '}
                  {new Date(hook.createdAt).toLocaleDateString()}
                </span>
              </div>

              {confirmDeleteId === hook.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-400">Delete?</span>
                  <button
                    onClick={() => handleDelete(hook.id)}
                    disabled={isPending}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded border border-red-900 hover:border-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(hook.id)}
                  className="shrink-0 text-xs text-zinc-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-950/20"
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
