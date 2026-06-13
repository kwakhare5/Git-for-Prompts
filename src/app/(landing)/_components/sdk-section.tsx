'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function SdkSection() {
  const [activeTab, setActiveTab] = useState<'node' | 'curl' | 'python'>('node');
  const [copied, setCopied] = useState<boolean>(false);

  const snippets = {
    node: `import { GFPClient } from '@gitforprompts/sdk';

const gfp = new GFPClient({ apiKey: process.env.GFP_API_KEY });

// Fetch active version of prompt template at runtime
const systemPrompt = await gfp.prompts.getLatest('customer-support');

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput }
  ]
});`,
    curl: `curl -X GET "https://api.gitforprompts.com/v1/prompts/customer-support/latest" \\
  -H "Authorization: Bearer gfp_live_your_api_key_here"`,
    python: `from gfp_sdk import GFPClient
import os

gfp = GFPClient(api_key=os.environ.get("GFP_API_KEY"))

# Retrieve active prompt dynamically
system_prompt = gfp.prompts.get_latest("customer-support")

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="max-w-6xl mx-auto px-6 border-t border-zinc-900 pt-20 space-y-8 select-none">
      <div className="max-w-2xl space-y-3">
        <h3 className="text-2xl font-bold text-zinc-100 font-sans">Developer SDK & Integration</h3>
        <p className="text-sm text-zinc-400 leading-relaxed font-light font-sans">
          Decouple prompts from application code. Fetch the active versions dynamically at runtime using our SDKs or HTTP endpoints.
        </p>
      </div>

      <div className="relative rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden font-mono text-sm max-w-3xl shadow-xl">
        {/* Code Header tabs */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/30">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'node', label: 'Node.js SDK' },
              { id: 'python', label: 'Python SDK' },
              { id: 'curl', label: 'cURL HTTP' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'node' | 'curl' | 'python');
                  setCopied(false);
                }}
                className={`px-3 py-1 text-[11px] font-semibold font-mono rounded-md transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-500 hover:text-zinc-300 bg-transparent border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer font-mono font-semibold"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code snippet block */}
        <pre className="p-5 overflow-x-auto text-zinc-300 font-mono text-xs leading-relaxed max-h-[320px]">
          <code className="font-mono">{snippets[activeTab]}</code>
        </pre>
      </div>
    </section>
  );
}
