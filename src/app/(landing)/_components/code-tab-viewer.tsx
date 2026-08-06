'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

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
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#161616] overflow-hidden font-mono text-sm shadow-xl flex flex-col h-[350px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#121212] rounded-t-2xl shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'curl', label: 'cURL' },
            { id: 'node', label: 'Node.js' },
            { id: 'python', label: 'Python' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as 'curl' | 'node' | 'python');
                setCopied(false);
              }}
              className={`px-3 py-1 text-xs font-semibold font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#f5f0eb] transition-colors p-1 cursor-pointer font-mono font-semibold"
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
        </button>
      </div>

      {/* Code snippet block */}
      <pre className="p-4 overflow-y-auto text-zinc-200 font-mono text-xs md:text-sm leading-relaxed flex-1 min-h-0 bg-[#0a0a0a] rounded-b-2xl no-scrollbar">
        <code className="font-mono">{snippets[activeTab]}</code>
      </pre>
    </div>
  );
}
