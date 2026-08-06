'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeTabViewerProps {
  snippets: Record<'curl' | 'node' | 'python', string>;
}

export function CodeTabViewer({ snippets }: CodeTabViewerProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden font-mono text-sm shadow-xl flex flex-col min-h-[380px] h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-2xl shrink-0 select-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'curl', label: 'cURL' },
            { id: 'node', label: 'Node.js' },
            { id: 'python', label: 'Python' },
          ].map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab(tab.id as 'curl' | 'node' | 'python');
                setCopied(false);
              }}
              className="h-7 px-3 text-xs font-mono cursor-pointer"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="font-mono">Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code snippet block */}
      <pre className="p-4 overflow-x-auto overflow-y-auto text-foreground font-mono text-xs md:text-sm leading-relaxed flex-1 min-h-0 bg-background rounded-b-2xl no-scrollbar select-text">
        <code className="font-mono whitespace-pre-wrap break-words">{snippets[activeTab]}</code>
      </pre>
    </div>
  );
}
