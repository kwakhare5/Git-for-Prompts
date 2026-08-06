'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Bot, Search, Tag, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="default"
        size="sm"
        className="gap-2 font-bold text-xs shadow-sm font-sans"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New Prompt Bundle</span>
        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/10 text-primary-foreground rounded font-semibold border border-primary-foreground/20">
          ⌘N
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <DialogTitle>Create Mindful Prompt Bundle</DialogTitle>
              <span className="text-xs font-mono text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                v1.0 Snapshot
              </span>
            </div>
            <DialogDescription>
              Start from a pre-configured architecture template or build a custom prompt repository.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-5 pt-2">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                {error}
              </div>
            )}

            {/* Template Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold block">
                1. Select Architecture Template
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const selected = selectedTemplate === tmpl.id;
                  return (
                    <Button
                      key={tmpl.id}
                      type="button"
                      variant={selected ? 'secondary' : 'outline'}
                      onClick={() => {
                        setSelectedTemplate(tmpl.id);
                        if (!name) setName(tmpl.name);
                      }}
                      className="p-3 h-auto rounded-xl border text-left flex flex-col justify-between items-stretch gap-1.5 cursor-pointer font-sans"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${selected ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                          <span className="text-xs font-bold text-foreground font-sans">{tmpl.name}</span>
                        </div>
                        {selected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground line-clamp-1 font-sans leading-tight font-normal">
                        {tmpl.description}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Bundle Details */}
            <div className="space-y-3 pt-1">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold block">
                2. Bundle Configuration
              </label>

              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-sans">Prompt Name</span>
                <Input
                  type="text"
                  placeholder="e.g. customer_refund_assistant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-sans">Description (Optional)</span>
                <Input
                  type="text"
                  placeholder="Brief summary of intent and target use case..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-border bg-background text-emerald-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground font-sans">Make bundle public in Explore directory</span>
                </label>

                <span className="text-[11px] font-mono text-muted-foreground">
                  Default Provider: <span className="text-foreground">{activeTemplate.model}</span>
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer font-sans"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="default"
                disabled={loading}
                className="font-bold text-xs cursor-pointer shadow-sm font-sans"
              >
                {loading ? 'Creating Bundle...' : 'Create & Open Editor →'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
