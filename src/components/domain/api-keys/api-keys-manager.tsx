'use client';

import { useState, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { generateApiKey, deleteApiKey } from '@/lib/actions/api-keys';
import { Check, X, Copy } from 'lucide-react';

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

interface Props {
  initialKeys: ApiKeyRow[];
}

export function ApiKeysManager({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [name, setName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function handleCopy() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function dismissNewKey() {
    setNewKey(null);
    setCopied(false);
  }

  function handleRevoke(id: string) {
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
    <div className="space-y-6 font-sans">
      {newKey && (
        <div className="rounded-2xl border border-emerald-500/30 bg-[#161619] p-5 space-y-3 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-300 font-mono flex items-center gap-2">
                <span>API Key Generated — Copy Now</span>
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                This key is shown only once. We store only its SHA-256 lookup hash.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissNewKey}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-zinc-800 bg-[#121214] px-3 py-2 font-mono text-xs text-zinc-200 break-all select-all">
              {newKey}
            </code>
            <button
              id="copy-api-key-btn"
              onClick={handleCopy}
              className="px-3.5 py-2 border border-zinc-700/80 rounded-xl text-xs font-mono font-bold bg-[#202024] hover:bg-[#28282D] text-zinc-200 flex items-center gap-1.5 active:scale-97 transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
              {copied ? 'Copied' : 'Copy Key'}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#121214] p-3 font-mono">
            <p className="text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-wider">Example Bearer Header Usage</p>
            <code className="font-mono text-xs text-zinc-300 break-all leading-relaxed">
              {`curl -H "Authorization: Bearer ${newKey}" \\\n  ${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/prompts/YOUR_PROMPT_ID/latest`}
            </code>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 font-mono">
          {error}
        </div>
      )}

      {/* Generate Key Card */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#161619] p-5 space-y-4 shadow-xl">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 font-mono">Generate New API Key</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Assign a label to track where this Bearer token is deployed (CLI, staging, or production service).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="api-key-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. CLI Production Worker..."
            maxLength={255}
            className="flex-1 rounded-xl border border-zinc-800 bg-[#121214] px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
          />
          <button
            id="generate-api-key-btn"
            onClick={handleGenerate}
            disabled={isPending || !name.trim()}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Generating…' : '+ Generate Key'}
          </button>
        </div>
      </div>

      {/* Active Keys List */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Active API Credentials</h2>
          {keys.length > 0 && (
            <span className="rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-mono font-bold">
              {keys.length} Active
            </span>
          )}
        </div>

        {keys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800/90 py-10 text-center text-zinc-500 bg-[#161619]/40">
            <p className="text-xs font-mono">No API keys created yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60 rounded-2xl border border-zinc-800/90 bg-[#161619] overflow-hidden shadow-xl">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-zinc-100 font-mono">{key.name}</span>
                    <code className="rounded bg-[#121214] border border-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      {key.keyPrefix}••••••••
                    </code>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-400">
                    <span>Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}</span>
                    <span>·</span>
                    <span>{key.lastUsedAt ? `Last used ${formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}` : 'Never used'}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 font-mono">
                  {confirmRevokeId === key.id ? (
                    <>
                      <span className="text-xs text-rose-300 font-semibold">Revoke?</span>
                      <button
                        onClick={() => handleRevoke(key.id)}
                        disabled={isPending}
                        className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        {deletingId === key.id ? 'Revoking…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmRevokeId(null)}
                        disabled={isPending}
                        className="px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      disabled={deletingId === key.id || isPending}
                      aria-label={`Revoke key "${key.name}"`}
                      className="px-3 py-1 border border-rose-500/30 hover:border-rose-500/60 rounded-lg text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 transition-colors cursor-pointer"
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
