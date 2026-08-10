'use client';

import { useState, useTransition } from 'react';
import { createWebhook, deleteWebhook } from '@/lib/actions/webhooks';
import { DeleteConfirmButton } from '@/components/domain/shared/delete-confirm-button';

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete webhook');
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {newSecret && (
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-bg-card flex flex-col gap-3 font-sans shadow-xl">
          <p className="text-sm font-bold text-emerald-300 font-mono">Webhook Created — Copy Secret Now</p>
          <p className="text-xs text-zinc-400 font-sans">Used to verify HMAC-SHA256 headers. This secret is shown only once.</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs font-mono text-zinc-200 bg-bg-page border border-zinc-800 rounded-xl px-3 py-2 break-all">
              {newSecret}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(newSecret)}
              className="px-3.5 py-2 border border-zinc-800 rounded-xl text-xs font-mono font-bold bg-bg-panel hover:bg-zinc-700 text-zinc-200 cursor-pointer"
            >
              Copy Secret
            </button>
          </div>
          <button
            onClick={() => setNewSecret(null)}
            className="self-end text-xs text-zinc-500 hover:text-white font-mono cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 p-6 rounded-2xl border border-zinc-800/90 bg-bg-card font-sans shadow-xl">
        <p className="text-sm font-bold text-zinc-100 font-mono">Register New Webhook Endpoint</p>
        <input
          type="url"
          placeholder="https://your-server.com/api/webhooks/gfp"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
        <input
          type="text"
          placeholder="Endpoint Label (e.g. Staging Slack Alert...)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={255}
          className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
        {error && <p className="text-xs text-rose-300 font-mono">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={isPending || !url.trim()}
          className="self-start px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Creating…' : '+ Add Webhook'}
        </button>
      </div>

      {hooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 py-10 text-center text-zinc-500 bg-bg-card/40">
          <p className="text-xs font-mono">No webhooks registered yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/90 bg-bg-card divide-y divide-zinc-800/60 font-sans shadow-xl overflow-hidden">
          {hooks.map((hook) => (
            <div key={hook.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex flex-col gap-1 min-w-0 font-sans">
                {hook.label && (
                  <span className="text-xs font-bold text-zinc-100 font-mono truncate">{hook.label}</span>
                )}
                <span className="text-xs font-mono text-blue-300 truncate">{hook.url}</span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {hook.promptId ? `Prompt-specific` : 'Global Listener'} ·{' '}
                  {new Date(hook.createdAt).toLocaleDateString()}
                </span>
              </div>

              <DeleteConfirmButton
                onDelete={() => handleDelete(hook.id)}
                isPending={isPending}
                ariaLabel={`Delete webhook ${hook.label || hook.url}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
