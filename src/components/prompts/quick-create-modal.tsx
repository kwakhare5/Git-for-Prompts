'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Bot, Search, Tag, MessageSquare, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateOption {
  id: string;
  name: string;
  category: string;
  icon: typeof Bot;
  description: string;
  content: string;
  model: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'system-prompt',
    name: 'System Instructions',
    category: 'Core Assistant',
    icon: Bot,
    description: 'Core instructions defining assistant role, boundaries, and formatting.',
    content: `You are a helpful, precise AI assistant.
Always adhere to the following rules:
1. Provide accurate, concise answers.
2. If uncertain, clearly state your limitations.
3. Format output in structured Markdown when appropriate.`,
    model: 'gpt-4o',
  },
  {
    id: 'rag-agent',
    name: 'RAG Context Synthesizer',
    category: 'Knowledge Base',
    icon: Search,
    description: 'Synthesizes retrieved context documents into accurate answers with citations.',
    content: `Given the following context documents, answer the user's question accurately.

Context:
{{context}}

Question:
{{question}}

Rules:
- Base your answer strictly on the provided context.
- Cite relevant sections using [Source N] notation.`,
    model: 'llama-3.3-70b-versatile',
  },
  {
    id: 'classifier',
    name: 'Intent Classifier',
    category: 'Data Routing',
    icon: Tag,
    description: 'Classifies user queries into predefined categories with JSON output.',
    content: `Analyze the user query and classify it into exactly one category:
["billing", "technical_support", "account", "general_inquiry"]

Respond strictly in JSON format:
{
  "category": "<category_name>",
  "confidence": 0.0 - 1.0,
  "reasoning": "<brief explanation>"
}`,
    model: 'gpt-4o-mini',
  },
  {
    id: 'customer-support',
    name: 'Support Auto-Responder',
    category: 'Customer Service',
    icon: MessageSquare,
    description: 'Friendly customer support bot with refund policy guardrails.',
    content: `You are a customer support agent for Git for Prompts.
Maintain an empathetic, professional tone at all times.

Policy Guidelines:
- Refund window: 30 days from purchase.
- Account escalations: Transfer to tier-2 support.`,
    model: 'claude-3-5-sonnet',
  },
];

export function QuickCreateModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('system-prompt');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for Cmd+N / Ctrl+N keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Bundle name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || activeTemplate.description,
          isPublic,
          content: activeTemplate.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to create prompt bundle');
      }

      const prompt = await res.json();
      setOpen(false);
      setName('');
      setDescription('');
      router.push(`/dashboard/prompts/${prompt.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f5f0eb] text-zinc-950 font-bold text-xs hover:bg-white active:scale-[0.97] transition-all cursor-pointer shadow-sm font-sans"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-950" />
        <span>New Prompt Bundle</span>
        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-950/10 text-zinc-950 rounded font-semibold border border-zinc-950/10">
          ⌘N
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#161616] border border-white/[0.08] text-[#f5f0eb] p-6 rounded-2xl shadow-2xl font-sans space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-lg font-bold text-[#f5f0eb] font-sans">
                    Create Mindful Prompt Bundle
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded">
                    v1.0 Snapshot
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Start from a pre-configured architecture template or build a custom prompt repository.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 pt-1">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Template Selection Chips */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                  1. Select Architecture Template
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {TEMPLATES.map((tmpl) => {
                    const Icon = tmpl.icon;
                    const selected = selectedTemplate === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(tmpl.id);
                          if (!name) setName(tmpl.name);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          selected
                            ? 'bg-white/[0.08] border-white/30 shadow-inner'
                            : 'bg-[#111111] border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${selected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                            <span className="text-xs font-bold text-[#f5f0eb] font-sans">{tmpl.name}</span>
                          </div>
                          {selected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <span className="text-[11px] text-zinc-400 line-clamp-1 font-sans leading-tight">
                          {tmpl.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Bundle Details */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
                  2. Bundle Configuration
                </label>

                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-300 font-sans">Prompt Name</span>
                  <input
                    type="text"
                    placeholder="e.g. customer_refund_assistant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-white/10 text-sm text-[#f5f0eb] placeholder:text-zinc-600 focus:outline-none focus:border-white/30 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-300 font-sans">Description (Optional)</span>
                  <input
                    type="text"
                    placeholder="Brief summary of intent and target use case..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-white/10 text-sm text-[#f5f0eb] placeholder:text-zinc-600 focus:outline-none focus:border-white/30 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded border-white/20 bg-zinc-900 text-emerald-400 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300 font-sans">Make bundle public in Explore directory</span>
                  </label>

                  <span className="text-[11px] font-mono text-zinc-400">
                    Default Provider: <span className="text-zinc-200">{activeTemplate.model}</span>
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer font-sans"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="bg-[#f5f0eb] text-zinc-950 hover:bg-white font-bold text-xs cursor-pointer shadow-sm font-sans"
                >
                  {loading ? 'Creating Bundle...' : 'Create & Open Editor →'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
