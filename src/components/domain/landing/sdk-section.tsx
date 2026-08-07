'use client';

import { useState } from 'react';
import { Terminal as TerminalIcon, Copy, Check, Code2, Server } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal } from '@/components/ui/terminal';

const SDK_EXAMPLES = {
  typescript: `import { GitForPrompts } from '@gfp/sdk';

const gfp = new GitForPrompts({ apiKey: process.env.GFP_API_KEY });

// Fetch latest version at runtime
const prompt = await gfp.prompts.getLatest('customer-support');
const content = prompt.interpolate({ order_id: '12345' });`,

  python: `from gfp import GitForPrompts

gfp = GitForPrompts(api_key="gfp_live_...")

# Fetch latest prompt version
prompt = gfp.prompts.get_latest("customer-support")
content = prompt.interpolate(order_id="12345")`,

  curl: `curl -X GET https://gitforprompts.app/api/v1/prompts/p1/latest \\
  -H "Authorization: Bearer gfp_live_secret123" \\
  -H "Content-Type: application/json"`,
};

export function SdkSection() {
  const [activeSdk, setActiveSdk] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SDK_EXAMPLES[activeSdk]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cli" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <TerminalIcon className="w-3.5 h-3.5" /> Developer Platform & CLI
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Local CLI + Runtime REST APIs
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Manage prompts locally via terminal commands or integrate runtime prompt fetching into TypeScript, Python, and REST services.
        </p>
      </div>

      {/* Stacked Dual-Bento Layout */}
      <div className="space-y-8 font-sans">
        {/* Top Block (Full Width): Dedicated shadcn Terminal UI Component */}
        <Terminal title="gfp CLI Terminal" versionBadge="v0.2.0 Wasm" />

        {/* Bottom Block (2-Column Grid): SDK & REST API Code Snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-sans">
          {/* Column 1: Node.js & Python SDK */}
          <Card className="bg-[#0c0c0e] border-white/10 p-6 space-y-4 rounded-2xl shadow-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <CardTitle className="text-sm font-bold text-foreground font-sans">
                    SDK Client Integration
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {(['typescript', 'python'] as const).map((sdk) => (
                    <Button
                      key={sdk}
                      variant={activeSdk === sdk ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveSdk(sdk)}
                      className={`h-6 px-2 text-[10px] font-mono cursor-pointer transition-all ${
                        activeSdk === sdk ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-muted-foreground'
                      }`}
                    >
                      {sdk === 'typescript' ? 'Node.js' : 'Python'}
                    </Button>
                  ))}
                </div>
              </div>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Fetch and interpolate prompts at runtime in production server environments.
              </CardDescription>

              <div className="p-4 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] text-sky-300 overflow-x-auto relative">
                <pre className="leading-relaxed font-mono">{SDK_EXAMPLES[activeSdk === 'curl' ? 'typescript' : activeSdk]}</pre>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="w-full text-xs font-mono gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy SDK Code
            </Button>
          </Card>

          {/* Column 2: Runtime REST API */}
          <Card className="bg-[#0c0c0e] border-white/10 p-6 space-y-4 rounded-2xl shadow-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <CardTitle className="text-sm font-bold text-foreground font-sans">
                    Runtime REST Endpoint
                  </CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                  GET /api/v1/prompts
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground font-sans">
                Fast HTTP API for zero-dependency microservices and edge workers.
              </CardDescription>

              <div className="p-4 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] text-emerald-300 overflow-x-auto">
                <pre className="leading-relaxed font-mono">{SDK_EXAMPLES.curl}</pre>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Auth Header</span>
              <span className="text-emerald-400 font-bold">Bearer gfp_live_...</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}


