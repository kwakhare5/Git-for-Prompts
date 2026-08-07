'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, Code2, Server } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SCRIPT_STEPS = [
  {
    cmd: 'gfp init',
    desc: 'Initialize zero-dependency Wasm SQLite repository',
    output: '✓ Initialized .gfp/ local prompt database\n✓ Created schema tables: prompts, versions, test_cases',
  },
  {
    cmd: 'gfp add customer-support --content "..."',
    desc: 'Save local prompt version snapshot',
    output: '✓ Extracted variables: {{customer_issue}}, {{order_id}}\n✓ Saved v1 snapshot · 142 chars',
  },
  {
    cmd: 'gfp push customer-support',
    desc: 'Sync local version to cloud Postgres SaaS',
    output: '✓ Authenticated via gfp_live_...\n✓ pg_advisory_xact_lock acquired\n✓ Pushed v1 → cloud v1',
  },
  {
    cmd: 'gfp pull customer-support',
    desc: 'Pull latest team version to local SQLite',
    output: '✓ Fetched cloud v3\n✓ Updated local .gfp/ database to v3',
  },
];

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
  const [activeStep, setActiveStep] = useState(0);
  const [activeSdk, setActiveSdk] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [copied, setCopied] = useState(false);

  return (
    <section id="cli" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <Terminal className="w-3.5 h-3.5" /> Developer Platform & CLI
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Local CLI + Runtime REST APIs
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Manage prompts locally via terminal commands or integrate runtime prompt fetching into TypeScript, Python, and REST services.
        </p>
      </div>

      {/* Interactive Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Side: Interactive CLI Terminal Widget */}
        <Card className="bg-[#111111] border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-bold text-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                gfp CLI Terminal
              </span>
            </div>

            <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
              v0.2.0 Wasm
            </Badge>
          </div>

          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-zinc-950">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {SCRIPT_STEPS.map((s, idx) => (
                  <Button
                    key={s.cmd}
                    variant={activeStep === idx ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveStep(idx)}
                    className={`h-7 px-2.5 text-[11px] font-mono cursor-pointer transition-all ${
                      activeStep === idx ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-muted-foreground'
                    }`}
                  >
                    Step {idx + 1}
                  </Button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-2 font-mono text-xs">
                <div className="text-foreground flex items-center gap-2 font-bold">
                  <span className="text-emerald-400 select-none">$</span>
                  <span>{SCRIPT_STEPS[activeStep].cmd}</span>
                </div>
                <div className="text-muted-foreground text-[11px] pl-3 border-l border-emerald-500/30 whitespace-pre-line leading-relaxed">
                  {SCRIPT_STEPS[activeStep].output}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-sans pt-2 border-t border-border">
              {SCRIPT_STEPS[activeStep].desc}
            </p>
          </div>
        </Card>

        {/* Right Side: Tabbed SDK Code Blocks */}
        <Card className="bg-[#111111] border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-foreground font-sans">SDK & REST API Integration</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-sans"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>

          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-zinc-950">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                {(['typescript', 'python', 'curl'] as const).map((sdk) => (
                  <Button
                    key={sdk}
                    variant={activeSdk === sdk ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSdk(sdk)}
                    className={`h-7 px-3 text-[11px] font-mono cursor-pointer transition-all ${
                      activeSdk === sdk ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-muted-foreground'
                    }`}
                  >
                    {sdk === 'typescript' ? 'Node.js' : sdk === 'python' ? 'Python' : 'cURL'}
                  </Button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-card border border-border font-mono text-[11px] text-muted-foreground overflow-x-auto">
                <pre className="text-sky-300 leading-relaxed font-mono">{SDK_EXAMPLES[activeSdk]}</pre>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground font-sans pt-2 border-t border-border">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" /> O(1) SHA-256 API Key Authorization
              </span>
              <span className="font-mono text-[10px] text-emerald-400">GET /api/v1/prompts</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

