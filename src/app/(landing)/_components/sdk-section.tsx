'use client';

import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { CodeTabViewer } from './code-tab-viewer';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'success' | 'info';
}

const script: { cmd: string; outputs: TerminalLine[] }[] = [
  { cmd: 'gfp init', outputs: [
    { text: '✓ Initialized gfp project', type: 'success' },
    { text: '  Database: .gfp/bundles.db', type: 'info' },
  ]},
  { cmd: 'gfp add customer-support --content "You are a helpful support agent."', outputs: [
    { text: '✓ Saved as v1', type: 'success' },
    { text: '  text-only · 37 chars', type: 'info' },
  ]},
  { cmd: 'gfp auth gfp_live_...', outputs: [
    { text: '✓ API key saved to .gfp/config.json', type: 'success' },
  ]},
  { cmd: 'gfp push customer-support', outputs: [
    { text: '✓ Created cloud prompt: customer-support', type: 'success' },
    { text: '✓ Pushed v1 → cloud v1', type: 'success' },
  ]},
];

function MockTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTyped, setCurrentTyped] = useState('');

  useEffect(() => {
    let isMounted = true;

    const runScript = async () => {
      if (!isMounted) return;
      setLines([]);
      setCurrentTyped('');

      for (const step of script) {
        for (let i = 0; i <= step.cmd.length; i++) {
          if (!isMounted) return;
          setCurrentTyped(step.cmd.slice(0, i));
          await new Promise((r) => setTimeout(r, 45));
        }

        await new Promise((r) => setTimeout(r, 200));

        if (!isMounted) return;
        setLines((prev) => [...prev, { text: `$ ${step.cmd}`, type: 'cmd' }]);
        setCurrentTyped('');

        for (const out of step.outputs) {
          if (!isMounted) return;
          setLines((prev) => [...prev, out]);
          await new Promise((r) => setTimeout(r, 120));
        }

        await new Promise((r) => setTimeout(r, 1200));
      }
    };

    runScript();
    const loopInterval = setInterval(runScript, 12000);

    return () => {
      isMounted = false;
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div className="p-4 bg-[#0a0a0a] flex-1 overflow-y-auto font-mono text-xs md:text-sm space-y-1.5 leading-relaxed no-scrollbar select-text">
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`font-mono break-words whitespace-pre-wrap ${
            line.type === 'cmd'
              ? 'text-[#f5f0eb] font-semibold'
              : line.type === 'success'
              ? 'text-emerald-400 font-semibold'
              : line.type === 'info'
              ? 'text-zinc-400'
              : 'text-zinc-300'
          }`}
        >
          {line.text}
        </div>
      ))}
      {currentTyped && (
        <div className="text-[#f5f0eb] font-mono font-semibold flex items-center gap-1 break-words whitespace-pre-wrap">
          <span>$</span>
          <span>{currentTyped}</span>
          <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block shrink-0" />
        </div>
      )}
    </div>
  );
}

export function SdkSection() {
  const snippets: Record<'curl' | 'node' | 'python', string> = {
    curl: `# Fetch latest prompt version via REST API
curl -X GET "https://gitforprompts.com/api/v1/prompts/pr_customer_refund/latest" \
  -H "Authorization: Bearer gfp_live_YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Response 200 OK:
# { "promptId": "pr_customer_refund", "versionNumber": 3, "content": "..." }`,

    node: `import { GFPClient } from '@gitforprompts/sdk';

const gfp = new GFPClient({ apiKey: process.env.GFP_API_KEY });

// Fetch active system prompt at runtime
const prompt = await gfp.prompts.getLatest('pr_customer_refund');

// Pass into OpenAI / Anthropic / Vercel AI SDK
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'system', content: prompt.content }],
});`,

    python: `import requests
import os

resp = requests.get(
    "https://gitforprompts.com/api/v1/prompts/pr_customer_refund/latest",
    headers={"Authorization": f"Bearer {os.environ['GFP_API_KEY']}"},
)
system_prompt = resp.json()["content"]

# Use with OpenAI
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input},
    ],
)`,
  };

  return (
    <section id="docs" className="max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-10 md:space-y-12 select-none font-sans">
      {/* Centered Master Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 font-mono text-xs uppercase tracking-wider font-semibold">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" /> Developer SDK &amp; CLI
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#f5f0eb] tracking-tight font-sans">
          REST API &amp; CLI Integration
        </h2>
        <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal font-sans">
          Decouple prompts from application code. Fetch the active version at runtime via HTTP — works with any language, any framework.
        </p>
      </div>

      {/* Symmetrical 2-Column Equal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch select-none">
        {/* Left Column - Code tabs component */}
        <CodeTabViewer snippets={snippets} />

        {/* Right Column - Real CLI terminal */}
        <div className="border border-white/[0.08] bg-[#161616] rounded-2xl shadow-xl flex flex-col font-mono text-xs overflow-hidden min-h-[380px] h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#121212] rounded-t-2xl shrink-0 select-none">
            <div className="flex gap-1.5 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/75" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/75" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/75" />
            </div>
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Terminal className="h-3.5 w-3.5" /> gfp-cli
            </span>
          </div>

          <MockTerminal />
        </div>
      </div>
    </section>
  );
}
