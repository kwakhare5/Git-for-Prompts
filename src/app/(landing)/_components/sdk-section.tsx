'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'success' | 'info';
}

// Real CLI commands that actually work
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

      for (const item of script) {
        if (!isMounted) return;

        // Type the command
        for (let i = 0; i <= item.cmd.length; i++) {
          if (!isMounted) return;
          await new Promise((r) => setTimeout(r, 40));
          setCurrentTyped(item.cmd.slice(0, i));
        }

        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 150));

        // Commit command line to history
        setLines((prev) => [...prev, { text: item.cmd, type: 'cmd' }]);
        setCurrentTyped('');

        // Show outputs with delays
        for (const out of item.outputs) {
          if (!isMounted) return;
          await new Promise((r) => setTimeout(r, 280));
          setLines((prev) => [...prev, out as TerminalLine]);
        }

        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 900));
      }

      if (isMounted) {
        await new Promise((r) => setTimeout(r, 2500));
        runScript();
      }
    };

    runScript();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-end p-4 font-mono text-xs leading-relaxed text-zinc-300 bg-[#0a0a0a] rounded-b-xl overflow-y-auto min-h-0 select-none no-scrollbar">
      <div className="space-y-1.5 font-mono">
        {lines.map((line, idx) => (
          <div key={idx} className="font-mono">
            {line.type === 'cmd' ? (
              <span className="font-mono">
                <span className="text-zinc-600 font-mono select-none">$ </span>
                <span className="text-zinc-100 font-semibold font-mono">{line.text}</span>
              </span>
            ) : line.type === 'success' ? (
              <span className="text-emerald-400 font-mono font-medium">{line.text}</span>
            ) : line.type === 'info' ? (
              <span className="text-zinc-500 font-mono">{line.text}</span>
            ) : (
              <span className="font-mono">{line.text}</span>
            )}
          </div>
        ))}
        <div className="flex items-center font-mono">
          <span className="text-zinc-600 font-mono select-none">$ </span>
          <span className="text-zinc-100 font-semibold font-mono">{currentTyped}</span>
          <span className="inline-block w-[6px] h-[11px] bg-zinc-400 ml-0.5 align-middle animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SdkSection() {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copied, setCopied] = useState<boolean>(false);

  // Only real, working integration patterns — no fake SDKs
  const snippets = {
    curl: `# Fetch latest prompt version via REST API
curl -X GET \\
  "https://gitforprompts.vercel.app/api/v1/prompts/<your-prompt-id>/latest" \\
  -H "Authorization: Bearer gfp_live_your_api_key_here"

# Response
{
  "promptId": "uuid",
  "versionNumber": 3,
  "content": "You are a helpful support agent...",
  "variables": ["user_name", "product"]
}`,
    node: `// Fetch prompt at runtime — no SDK needed, just fetch()
const res = await fetch(
  \`https://gitforprompts.vercel.app/api/v1/prompts/\${promptId}/latest\`,
  { headers: { Authorization: \`Bearer \${process.env.GFP_API_KEY}\` } }
);
const { content } = await res.json();

// Use in your AI call
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content },
    { role: 'user', content: userInput },
  ],
});`,
    python: `import os, httpx

# Fetch prompt at runtime
resp = httpx.get(
    f"https://gitforprompts.vercel.app/api/v1/prompts/{prompt_id}/latest",
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

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="max-w-6xl mx-auto px-6 py-6 md:py-8 space-y-8 select-none font-sans">
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
        {/* Left Column - Code tabs */}
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

        {/* Right Column - Real CLI terminal */}
        <div className="border border-white/[0.08] bg-[#161616] rounded-2xl shadow-xl flex flex-col font-mono text-xs overflow-hidden h-[350px]">
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
