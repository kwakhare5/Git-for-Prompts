'use client';

import { useState, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { generateApiKey, deleteApiKey } from '@/lib/actions/api-keys';
import { Check, X, Copy } from 'lucide-react';

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
    <div className="space-y-8">

      {/* ── New Key Banner (shown once after generation) ── */}
      {newKey && (
        <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/40 p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Key generated — copy it now
              </p>
              <p className="mt-0.5 text-xs text-emerald-600">
                This is the only time your full key will be shown. We don&apos;t store it.
              </p>
            </div>
            <button
              onClick={dismissNewKey}
              className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Key display */}
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 font-mono text-xs text-zinc-200 break-all select-all">
              {newKey}
            </code>
            <button
              id="copy-api-key-btn"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* curl usage hint */}
          <div className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2.5">
            <p className="text-[10px] text-zinc-500 mb-1.5 font-mono">Example usage</p>
            <code className="font-mono text-[11px] text-zinc-400 break-all">
              {`curl -H "Authorization: Bearer ${newKey}" \\\n  ${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/prompts/YOUR_PROMPT_ID/latest`}
            </code>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-700/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Generate Form ── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-300 mb-1">Generate new key</h2>
        <p className="text-xs text-zinc-500 mb-4">
          Give the key a name so you know where it&apos;s used (e.g. &quot;Production app&quot;, &quot;CI pipeline&quot;).
        </p>

        <div className="flex gap-2">
          <input
            id="api-key-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Key name…"
            maxLength={255}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
          />
          <button
            id="generate-api-key-btn"
            onClick={handleGenerate}
            disabled={isPending || !name.trim()}
            className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {/* ── Key List ── */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">
          Active keys
          {keys.length > 0 && (
            <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
              {keys.length}
            </span>
          )}
        </h2>

        {keys.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center">
            <p className="text-sm text-zinc-500">No API keys yet.</p>
            <p className="text-xs text-zinc-600 mt-1">Generate your first key above.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                {/* Key info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {key.name}
                    </span>
                    <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                      {key.keyPrefix}••••••••
                    </code>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                    <span>
                      Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                    </span>
                    <span className="text-zinc-700">·</span>
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
                      <span className="text-xs text-zinc-400">Revoke key?</span>
                      <button
                        onClick={() => handleRevoke(key.id)}
                        disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 font-medium"
                      >
                        {deletingId === key.id ? 'Revoking…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmRevokeId(null)}
                        disabled={isPending}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      disabled={deletingId === key.id || isPending}
                      aria-label={`Revoke key "${key.name}"`}
                      className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-red-700/50 hover:bg-red-950/30 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Revoke
                    </button>
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
