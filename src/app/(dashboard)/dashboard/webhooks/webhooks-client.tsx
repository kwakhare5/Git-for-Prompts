'use client';

import { useState, useTransition } from 'react';
import { createWebhook, deleteWebhook } from '@/lib/actions/webhooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="flex flex-col gap-6 font-sans">
      {/* New secret — shown once after creation */}
      {newSecret && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2 shadow-sm font-sans">
          <p className="text-sm font-semibold text-emerald-400 font-sans">Webhook created — copy your secret now</p>
          <p className="text-xs text-emerald-400/80 font-sans">This will not be shown again.</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-xs font-mono text-emerald-300 bg-background border border-border rounded-xl px-3.5 py-2.5 break-all">
              {newSecret}
            </code>
            <Button
              onClick={() => navigator.clipboard.writeText(newSecret)}
              variant="outline"
              size="sm"
              className="font-mono cursor-pointer"
            >
              Copy
            </Button>
          </div>
          <Button
            onClick={() => setNewSecret(null)}
            variant="ghost"
            size="sm"
            className="self-end text-xs text-muted-foreground hover:text-foreground cursor-pointer font-mono"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Create form */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm font-sans">
        <p className="text-base font-bold text-foreground">Register new webhook</p>
        <Input
          type="url"
          placeholder="https://your-server.com/webhook"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="font-mono text-sm"
        />
        <Input
          type="text"
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={255}
          className="font-mono text-sm"
        />
        {error && <p className="text-xs text-destructive font-mono">{error}</p>}
        <Button
          onClick={handleCreate}
          disabled={isPending || !url.trim()}
          variant="default"
          size="sm"
          className="self-start font-sans cursor-pointer shadow-sm"
        >
          {isPending ? 'Creating…' : 'Add Webhook'}
        </Button>
      </div>

      {/* Existing webhooks list */}
      {hooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center bg-card">
          <p className="text-base font-semibold text-foreground">No webhooks registered yet.</p>
          <p className="text-xs text-muted-foreground mt-1.5 font-sans">Add your first webhook URL above.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border shadow-sm font-sans">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className="flex items-center justify-between gap-4 px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl hover:bg-accent/40 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0 font-sans">
                {hook.label && (
                  <span className="text-sm font-semibold text-foreground truncate">{hook.label}</span>
                )}
                <span className="text-xs font-mono text-muted-foreground truncate">{hook.url}</span>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {hook.promptId ? `Prompt-specific` : 'Global'} ·{' '}
                  {new Date(hook.createdAt).toLocaleDateString()}
                </span>
              </div>

              {confirmDeleteId === hook.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground font-sans">Delete?</span>
                  <Button
                    onClick={() => handleDelete(hook.id)}
                    disabled={isPending}
                    variant="destructive"
                    size="sm"
                    className="font-mono cursor-pointer"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setConfirmDeleteId(null)}
                    variant="ghost"
                    size="sm"
                    className="font-sans cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setConfirmDeleteId(hook.id)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive font-mono cursor-pointer"
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
