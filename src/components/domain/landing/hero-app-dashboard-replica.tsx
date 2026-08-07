'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Layers,
  Key,
  TrendingUp,
  Search,
  Plus,
  Webhook,
  FileCode,
  Sparkles,
  ShieldCheck,
  GitBranch,
  ChevronRight,
  Play,
  Check,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GFP_THEME_NAME, registerGfpTheme, GFP_LINE_NUMBER_OPTIONS } from '@/lib/monaco-theme';
import { extractVariables } from '@gfp/core';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-zinc-950 text-xs text-muted-foreground font-mono h-64">
      Loading Monaco Editor…
    </div>
  ),
});

const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-zinc-950 text-xs text-muted-foreground font-mono h-64">
        Loading Monaco Diff Viewer…
      </div>
    ),
  }
);

type DashboardView = 'dashboard' | 'editor' | 'diff' | 'tests' | 'apikeys' | 'webhooks';

const MOCK_PROMPTS = [
  {
    id: 'p1',
    name: 'customer-support-returns',
    description: 'Enforces 30-day money-back refund policies with empathetic tone',
    version: 3,
    isPublic: true,
    updatedAt: '2m ago',
    passRate: 100,
  },
  {
    id: 'p2',
    name: 'code-refactoring-agent',
    description: 'Staff engineer persona for architectural pattern & clean code audits',
    version: 7,
    isPublic: false,
    updatedAt: '1h ago',
    passRate: 94,
  },
  {
    id: 'p3',
    name: 'json-extractor-v2',
    description: 'Extracts structured JSON schemas from raw unstructured email logs',
    version: 2,
    isPublic: true,
    updatedAt: '1d ago',
    passRate: 100,
  },
];

const INITIAL_SYSTEM_PROMPT = `You are an elite Customer Support AI Assistant for Acme Retail.
Your tone must be empathetic, professional, and concise.
Always reference our 30-day money-back guarantee policy.`;

const INITIAL_USER_TEMPLATE = `Customer Issue: {{customer_issue}}
Order ID: {{order_id}}
Customer Tier: {{customer_tier}}

Provide a step-by-step resolution.`;

const LEGACY_V1_PROMPT = `You are a customer support agent.
Help the customer with order {{order_id}}.
Tell them about our 30-day policy.`;

export function HeroAppDashboardReplica() {
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(INITIAL_SYSTEM_PROMPT);
  const [userTemplate, setUserTemplate] = useState(INITIAL_USER_TEMPLATE);
  const [provider, setProvider] = useState('groq');
  const [model] = useState('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(0.7);
  const [commitMessage, setCommitMessage] = useState('');
  const [versionCount, setVersionCount] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testScore, setTestScore] = useState(100);

  const detectedVariables = useMemo(
    () => extractVariables(`${systemPrompt}\n${userTemplate}`),
    [systemPrompt, userTemplate]
  );

  const filteredPrompts = useMemo(() => {
    if (!searchQuery) return MOCK_PROMPTS;
    return MOCK_PROMPTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  function handleSaveVersion() {
    const nextVer = versionCount + 1;
    setVersionCount(nextVer);
    setCommitMessage('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  function handleRunTests() {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestScore(100);
    }, 1000);
  }

  return (
    <div className="w-full max-w-6xl mx-auto font-sans shadow-2xl rounded-2xl border border-white/10 bg-card overflow-hidden text-left isolation-auto transition-all">
      {/* Outer Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 pl-2 border-l border-border">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            gitforprompts.app/dashboard
          </span>
        </div>

        <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5">
          Live Interactive Showcase
        </Badge>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex flex-col lg:flex-row min-h-[500px] bg-background">
        {/* Sidebar */}
        <aside className="w-full lg:w-60 border-r border-border bg-card/50 p-4 flex flex-col justify-between shrink-0 font-sans space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">Workspace</span>
              <h3 className="text-xs font-bold text-foreground font-mono truncate">karan-wakhare/personal</h3>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Prompts', icon: Layers, count: filteredPrompts.length },
                { id: 'editor', label: 'Bundle Editor', icon: FileCode, badge: 'v' + versionCount },
                { id: 'diff', label: 'Version Diff', icon: Sparkles },
                { id: 'tests', label: 'Test Suite', icon: ShieldCheck, badge: '100%' },
                { id: 'apikeys', label: 'API Keys', icon: Key, count: 2 },
                { id: 'webhooks', label: 'Webhooks', icon: Webhook },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveView(item.id as DashboardView)}
                    className={cn(
                      'w-full justify-start h-9 px-3 text-xs font-medium font-sans cursor-pointer rounded-lg transition-colors',
                      isActive ? 'bg-muted text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2.5 shrink-0" />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 ml-auto text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                        {item.badge}
                      </Badge>
                    )}
                    {item.count !== undefined && (
                      <span className="font-mono text-[10px] text-muted-foreground ml-auto">{item.count}</span>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-1 text-xs font-mono text-muted-foreground">
            <div className="flex items-center justify-between text-foreground font-semibold">
              <span>gfp Engine</span>
              <span className="text-emerald-400">v0.2.0</span>
            </div>
            <p className="text-[10px]">sqlite3 · offline-first</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-background flex flex-col font-sans space-y-6">
          {/* Prompts Table View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts..."
                    className="pl-9 h-9 text-xs bg-card border-border font-sans"
                  />
                </div>

                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setActiveView('editor')}
                  className="h-9 text-xs font-bold font-sans cursor-pointer shadow-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> New Prompt
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card/80 overflow-hidden shadow-xs">
                <div className="grid grid-cols-[1fr_auto_auto_auto] p-3 bg-muted/40 border-b border-border text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  <div>Prompt Bundle</div>
                  <div className="px-4">Version</div>
                  <div className="px-4">Visibility</div>
                  <div className="px-4 text-right">Action</div>
                </div>

                <div className="divide-y divide-border font-sans">
                  {filteredPrompts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setActiveView('editor')}
                      className="grid grid-cols-[1fr_auto_auto_auto] items-center p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">· {p.updatedAt}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate font-sans">{p.description}</p>
                      </div>

                      <div className="px-4">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          v{p.version}
                        </Badge>
                      </div>

                      <div className="px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-mono text-[10px]',
                            p.isPublic
                              ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                              : 'text-muted-foreground'
                          )}
                        >
                          {p.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>

                      <div className="px-4 text-right">
                        <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:underline justify-end">
                          Edit <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bundle Editor View */}
          {activeView === 'editor' && (
            <div className="space-y-4 font-sans flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-mono text-foreground">customer-support-returns</h3>
                    <Badge variant="outline" className="font-mono text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                      v{versionCount}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">JSON Prompt Bundle Schema</p>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder='What changed?'
                    className="h-8 w-44 text-xs bg-card border-border font-sans"
                  />
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSaveVersion}
                    className="h-8 text-xs font-bold font-sans cursor-pointer shadow-xs"
                  >
                    {saveSuccess ? `Saved v${versionCount} ✓` : 'Save Version'}
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border flex flex-wrap items-center gap-4 text-xs font-sans text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Provider:</span>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="bg-muted px-2.5 py-1 rounded-md font-mono text-xs text-foreground border border-border cursor-pointer"
                  >
                    <option value="groq">Groq</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Model:</span>
                  <span className="font-mono text-foreground font-bold">{model}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Temp:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-24 accent-primary cursor-pointer"
                  />
                  <span className="font-mono text-foreground font-bold">{temperature}</span>
                </div>

                {detectedVariables.length > 0 && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground font-mono">Vars:</span>
                    {detectedVariables.map((v) => (
                      <Badge key={v} variant="outline" className="font-mono text-[10px] text-sky-400 border-sky-500/20 bg-sky-500/10">
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <Card className="bg-card border-border overflow-hidden flex flex-col">
                  <div className="px-3 py-2 bg-muted/40 text-[11px] font-mono font-semibold uppercase text-muted-foreground border-b border-border">
                    System Prompt
                  </div>
                  <MonacoEditor
                    height="240px"
                    language="plaintext"
                    theme={GFP_THEME_NAME}
                    beforeMount={registerGfpTheme}
                    value={systemPrompt}
                    onChange={(v) => setSystemPrompt(v ?? '')}
                    options={{
                      minimap: { enabled: false },
                      ...GFP_LINE_NUMBER_OPTIONS,
                      wordWrap: 'on',
                      fontSize: 12,
                    }}
                  />
                </Card>

                <Card className="bg-card border-border overflow-hidden flex flex-col">
                  <div className="px-3 py-2 bg-muted/40 text-[11px] font-mono font-semibold uppercase text-muted-foreground border-b border-border">
                    User Template ({'{{variables}}'})
                  </div>
                  <MonacoEditor
                    height="240px"
                    language="plaintext"
                    theme={GFP_THEME_NAME}
                    beforeMount={registerGfpTheme}
                    value={userTemplate}
                    onChange={(v) => setUserTemplate(v ?? '')}
                    options={{
                      minimap: { enabled: false },
                      ...GFP_LINE_NUMBER_OPTIONS,
                      wordWrap: 'on',
                      fontSize: 12,
                    }}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* Version Diff View */}
          {activeView === 'diff' && (
            <div className="space-y-4 font-sans flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Comparing:</span>
                  <span className="font-bold text-foreground">v1 (Legacy)</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="font-bold text-emerald-400">v{versionCount} (Current)</span>
                </div>
                <Badge variant="outline" className="font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                  + 4 additions, - 2 deletions
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden flex-1">
                <MonacoDiffEditor
                  height="320px"
                  theme={GFP_THEME_NAME}
                  beforeMount={registerGfpTheme}
                  original={LEGACY_V1_PROMPT}
                  modified={systemPrompt}
                  options={{
                    minimap: { enabled: false },
                    readOnly: true,
                    fontSize: 12,
                  }}
                />
              </Card>
            </div>
          )}

          {/* Test Suite View */}
          {activeView === 'tests' && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-sans">Automated Test Suite</h3>
                  <p className="text-xs text-muted-foreground">Natural language assertion evaluations</p>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleRunTests}
                  disabled={isTesting}
                  className="h-8 text-xs font-bold cursor-pointer font-sans shadow-xs gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isTesting ? 'Running Evals…' : 'Run All Tests'}
                </Button>
              </div>

              <Card className="bg-card border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">✓ 2/2 Test Cases Passing ({testScore}% Pass Rate)</span>
                  <span className="text-muted-foreground">v{versionCount} evaluated</span>
                </div>
                <Progress value={testScore} className="h-2 bg-muted" />
              </Card>

              <div className="space-y-3 font-sans">
                <Card className="bg-card border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-foreground">Mentions 30-Day Guarantee Window</span>
                    <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                      PASS
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/40 p-2.5 rounded-md">
                    Input: &quot;Can I return an item bought 20 days ago?&quot; &rarr; Criteria: &quot;Must confirm 30-day window&quot;
                  </p>
                </Card>

                <Card className="bg-card border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-foreground">Maintains Empathetic Brand Tone</span>
                    <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                      PASS
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/40 p-2.5 rounded-md">
                    Input: &quot;My package arrived damaged!&quot; &rarr; Criteria: &quot;Must apologize politely before details&quot;
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* API Keys View */}
          {activeView === 'apikeys' && (
            <div className="space-y-4 font-sans">
              <div className="border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground font-sans">Developer API Keys</h3>
                <p className="text-xs text-muted-foreground">SHA-256 lookup hashed credentials for runtime prompt fetching</p>
              </div>

              <Card className="bg-card border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-foreground">Production API Key</span>
                  <span className="font-mono text-[11px] text-muted-foreground">Created 2d ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value="gfp_live_8f93ab12c9e7401d904b"
                    readOnly
                    className="font-mono text-xs bg-background border-border text-foreground"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="cursor-pointer font-sans h-9"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Webhooks View */}
          {activeView === 'webhooks' && (
            <div className="space-y-4 font-sans">
              <div className="border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground font-sans">Webhook Subscriptions</h3>
                <p className="text-xs text-muted-foreground">HMAC-SHA256 signed event delivery on prompt version save</p>
              </div>

              <Card className="bg-card border-border p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-foreground font-semibold">
                  <span>https://api.myapp.com/webhooks/gfp</span>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                    version.created
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">HMAC Secret: secret_hash_sha256_active</p>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
