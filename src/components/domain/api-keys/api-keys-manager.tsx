'use client';

import { useState, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { generateApiKey, deleteApiKey } from '@/lib/actions/api-keys';
import { Check, X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  // Dates are serialized to ISO strings by Next.js when passed as server component props
  lastUsedAt: string | null;
  createdAt: string;
}

interface Props {
  initialKeys: ApiKeyRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ApiKeysManager — full client component for key generation + management
// ─────────────────────────────────────────────────────────────────────────────
export function ApiKeysManager({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [name, setName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Generate ────────────────────────────────────────────────────────────────
  function handleGenerate() {
    if (!name.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await generateApiKey({ name: name.trim() });
        setNewKey(result.plainKey);
        setName('');
        setKeys((prev) => [
          ...prev,
          {
            id: result.id,
            name: result.name,
            keyPrefix: 'gfp_live_',
            lastUsedAt: null,
            createdAt: result.createdAt,
          },
        ]);
      } catch {
        setError('Failed to generate key. Please try again.');
      }
    });
  }

  // ── Copy ────────────────────────────────────────────────────────────────────
  function handleCopy() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Dismiss newly generated key banner ──────────────────────────────────────
  function dismissNewKey() {
    setNewKey(null);
    setCopied(false);
  }

  // ── Delete (two-step confirmation) ──────────────────────────────────────────
  function handleRevoke(id: string) {
    // First click: show confirmation; second click: execute
    if (confirmRevokeId !== id) {
      setConfirmRevokeId(id);
      return;
    }
    setConfirmRevokeId(null);
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteApiKey({ id });
        setKeys((prev) => prev.filter((k) => k.id !== id));
      } catch {
        setError('Failed to delete key. Please try again.');
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div className="space-y-8 font-sans">

      {/* ── New Key Banner (shown once after generation) ── */}
      {newKey && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 ease-out-emil shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Key generated — copy it now
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This is the only time your full key will be shown. We don&apos;t store it.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={dismissNewKey}
              className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Key display */}
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs text-foreground break-all select-all">
              {newKey}
            </code>
            <Button
              id="copy-api-key-btn"
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer font-sans"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-foreground" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* curl usage hint */}
          <div className="rounded-md border border-border bg-background px-3 py-2.5 font-mono">
            <p className="text-xs text-muted-foreground mb-1.5 font-mono font-semibold uppercase tracking-wider">Example usage</p>
            <code className="font-mono text-xs text-foreground break-all">
              {`curl -H "Authorization: Bearer ${newKey}" \\\n  ${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/prompts/YOUR_PROMPT_ID/latest`}
            </code>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive font-mono">
          {error}
        </div>
      )}

      {/* ── Generate Form ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xl space-y-4 font-sans">
        <div>
          <h2 className="text-sm font-semibold text-foreground font-sans">Generate new key</h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Give the key a name so you know where it&apos;s used (e.g. &quot;Production app&quot;, &quot;CI pipeline&quot;).
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            id="api-key-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Key name…"
            maxLength={255}
            className="flex-1 font-mono text-xs"
          />
          <Button
            id="generate-api-key-btn"
            onClick={handleGenerate}
            disabled={isPending || !name.trim()}
            variant="default"
            size="sm"
            className="font-sans cursor-pointer shadow-sm"
          >
            {isPending ? 'Generating…' : 'Generate Key'}
          </Button>
        </div>
      </div>

      {/* ── Key List ── */}
      <div className="space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground font-sans">
            Active Keys
          </h2>
          {keys.length > 0 && (
            <span className="rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold">
              {keys.length} Active
            </span>
          )}
        </div>

        {keys.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-12 text-center">
            <p className="text-sm text-muted-foreground font-sans font-medium">No API keys yet.</p>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Generate your first key above to authenticate programmatic REST API requests.</p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-xl">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5 font-sans"
              >
                {/* Key info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate font-sans">
                      {key.name}
                    </span>
                    <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground font-medium">
                      {key.keyPrefix}••••••••
                    </code>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-sans">
                    <span>
                      Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>
                      {key.lastUsedAt
                        ? `Last used ${formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}`
                        : 'Never used'}
                    </span>
                  </div>
                </div>

                {/* Delete — two-step confirmation */}
                <div className="shrink-0 flex items-center gap-2">
                  {confirmRevokeId === key.id ? (
                    <>
                      <span className="text-xs text-muted-foreground font-sans font-medium">Revoke key?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevoke(key.id)}
                        disabled={isPending}
                        className="h-7 text-xs font-semibold cursor-pointer"
                      >
                        {deletingId === key.id ? 'Revoking…' : 'Confirm'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmRevokeId(null)}
                        disabled={isPending}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevoke(key.id)}
                      disabled={deletingId === key.id || isPending}
                      aria-label={`Revoke key "${key.name}"`}
                      className="h-7 text-xs text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive cursor-pointer font-sans"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
