'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'success' | 'info';
}

const script: { cmd: string; outputs: TerminalLine[] }[] = [
  { cmd: 'gfp login', outputs: [
    { text: 'Logging into Git for Prompts...', type: 'info' },
    { text: '✓ Authenticated as karan (user_3F2JhB...)', type: 'success' }
  ]},
  { cmd: 'gfp pull customer-support --version 3', outputs: [
    { text: 'Downloading customer-support version 3...', type: 'info' },
    { text: '✓ Created prompt_template.txt (208 tokens)', type: 'success' }
  ]},
  { cmd: 'gfp test customer-support', outputs: [
    { text: 'Running local prompt evaluations...', type: 'info' },
    { text: '● returns_refund_request ... PASS (100/100)', type: 'success' },
    { text: '● returns_late_shipment  ... PASS (100/100)', type: 'success' },
    { text: '✓ All 2 assertions passed.', type: 'success' }
  ]}
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
          await new Promise((r) => setTimeout(r, 55));
          setCurrentTyped(item.cmd.slice(0, i));
        }

        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 200));

        // Commit command line to history
        setLines((prev) => [...prev, { text: item.cmd, type: 'cmd' }]);
        setCurrentTyped('');

        // Show outputs with delays
        for (const out of item.outputs) {
          if (!isMounted) return;
          await new Promise((r) => setTimeout(r, 350));
          setLines((prev) => [...prev, out as TerminalLine]);
        }

        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 1200));
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
    <div className="flex-1 flex flex-col justify-end p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed text-zinc-300 bg-zinc-950/70 overflow-y-auto min-h-0 select-none">
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
  const [activeTab, setActiveTab] = useState<'node' | 'curl' | 'python' | 'go'>('node');
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
)`,
    go: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/gitforprompts/gfp-go"
)

func main() {
	// Initialize our Git for Prompts client
	gfp := gfp.NewClient(os.Getenv("GFP_API_KEY"))
	
	// Fetch the active version of "customer-support" at runtime
	systemPrompt, _ := gfp.GetLatest(context.Background(), "customer-support")
	
	fmt.Println(systemPrompt)
}`
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
          Decouple prompts from application code. Fetch the active versions dynamically at runtime using our SDKs, CLI, or HTTP endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch select-none">
        {/* Left Column - Code Header tabs */}
        <div className="lg:col-span-7 relative rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden font-mono text-sm shadow-xl flex flex-col h-[380px]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'node', label: 'Node.js' },
                { id: 'python', label: 'Python' },
                { id: 'go', label: 'Go SDK' },
                { id: 'curl', label: 'cURL' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'node' | 'curl' | 'python' | 'go');
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
                  <span className="text-emerald-400 font-mono">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="font-mono">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code snippet block */}
          <pre className="p-5 overflow-y-auto text-zinc-300 font-mono text-xs leading-relaxed flex-1 min-h-0 bg-zinc-950/30">
            <code className="font-mono">{snippets[activeTab]}</code>
          </pre>
        </div>

        {/* Right Column - Mock Terminal */}
        <div className="lg:col-span-5 border border-zinc-900 bg-zinc-950/40 rounded-xl shadow-xl flex flex-col font-mono text-xs overflow-hidden h-[380px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 bg-zinc-900/30 shrink-0 select-none">
            <div className="flex gap-1.5 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/75" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/75" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/75" />
            </div>
            <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
              <Terminal className="h-3 w-3" /> gfp-cli
            </span>
          </div>
          
          <MockTerminal />
        </div>
      </div>
    </section>
  );
}
