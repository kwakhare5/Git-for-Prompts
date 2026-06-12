'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Show } from '@clerk/nextjs';
import { 
  GitBranch, 
  FileText, 
  Play, 
  History, 
  Sparkles, 
  Flame, 
  Terminal, 
  BookOpen, 
  Check, 
  ArrowRight,
  Copy,
  Cpu,
  Shield
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isAutoplayPaused || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplayPaused, activeTab]);
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'diff' | 'tests'>('edit');
  
  const [versions, setVersions] = useState<Array<{
    versionNumber: number;
    content: string;
    commitMessage: string;
    createdAt: string;
  }>>([
    {
      versionNumber: 1,
      content: `You answer questions about customer returns.`,
      commitMessage: 'Initial draft',
      createdAt: '1 hour ago'
    },
    {
      versionNumber: 2,
      content: `You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".`,
      commitMessage: 'Clarified returns policy',
      createdAt: '10 minutes ago'
    }
  ]);

  const [activeVersionNumber, setActiveVersionNumber] = useState(2);
  const [editorContent, setEditorContent] = useState(
    `You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".`
  );
  const [commitInput, setCommitInput] = useState('');
  
  const testCase = {
    name: 'Returns Refund Request',
    input_text: 'I bought shoes yesterday and they arrived with a cracked sole. Can I get my money back?',
    expectedCriteria: 'Must offer a full refund and sign off with "Customer Support Team".'
  };

  const [testResult, setTestResult] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [testOutput, setTestOutput] = useState('');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-2.5">
          <GitBranch className="h-6 w-6 text-zinc-400" />
          <span className="font-bold text-lg tracking-tight">Git for Prompts</span>
        </div>

        <div className="flex items-center bg-zinc-900/80 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tour')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'tour'
                ? 'bg-zinc-800 text-zinc-50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Tour & Guide
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-zinc-800 text-zinc-50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            Interactive Sandbox
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              Go to Dashboard
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-50/5"
            >
              Get Started
            </Link>
          </Show>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'tour' ? (
          <div className="max-w-6xl mx-auto px-6 py-12 w-full space-y-20">
            {/* Hero */}
            <section className="text-center space-y-6 py-8">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                Treat your prompts like code.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                Version, test, A/B compare, and deploy AI prompt templates using a clean, developer-first Git workflow. No more prompt chaos in Notion or Google Docs.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:shadow-zinc-50/10"
                >
                  Try Sandbox <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            </section>

            {/* Interactive Tour Panel */}
            <section 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-stretch"
              onMouseEnter={() => setIsAutoplayPaused(true)}
              onMouseLeave={() => setIsAutoplayPaused(false)}
            >
              {/* Left Column - Feature Cards */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                {[
                  {
                    num: '01',
                    title: 'Branching Commits',
                    desc: 'Save prompt updates as Git-like commits. Track authors, timelines, and messages in an immutable tree.'
                  },
                  {
                    num: '02',
                    title: 'Visual Diff Comparisons',
                    desc: 'Wipe across prompt versions with a draggable divider. Identify deletions and additions instantly.'
                  },
                  {
                    num: '03',
                    title: 'Automated Test Runner',
                    desc: 'Simulate concurrent model checks. Assert output parameters against natural language guidelines.'
                  },
                  {
                    num: '04',
                    title: 'Runtime API Delivery',
                    desc: 'Fetch active versions dynamically via API key. Decouple prompt updates from app redeployments.'
                  }
                ].map((feature, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveFeature(idx);
                      setIsAutoplayPaused(true);
                    }}
                    className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFeature === idx
                        ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100 shadow-lg shadow-zinc-950/40 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:bg-zinc-50 before:rounded-r'
                        : 'bg-zinc-900/10 border-zinc-950 hover:bg-zinc-900/20 hover:border-zinc-900 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold leading-5 ${activeFeature === idx ? 'text-zinc-50' : 'text-zinc-600'}`}>
                      {feature.num}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column - Motion Demo Canvas */}
              <div className="lg:col-span-7 h-[420px] rounded-xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-sm overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/40 via-zinc-900/20 to-zinc-950/40 pointer-events-none" />
                <div className="relative z-10 flex-1 flex flex-col h-full">
                  {/* Canvas rendering will go in Tasks 2-6 */}
                  <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs font-mono">
                    Graphic Canvas Loading
                  </div>
                </div>
              </div>
            </section>

            {/* Integration Guide Section */}
            <section className="border-t border-zinc-900 pt-16 pb-12 space-y-8">
              <div className="max-w-2xl space-y-3">
                <h3 className="text-2xl font-bold text-zinc-100">Integration: Fetching at Runtime</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Load the latest active version of your prompt dynamically in your application using our simple HTTP endpoint.
                </p>
              </div>

              <div className="relative rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden font-mono text-sm max-w-3xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/30">
                  <span className="text-xs text-zinc-500">typescript - api_client.ts</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`const response = await fetch("https://gitforprompts.com/api/v1/prompts/[prompt-id]/latest", {
  headers: {
    "Authorization": "Bearer " + process.env.GFP_API_KEY
  }
});
const { content } = await response.json();`);
                    }}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="p-5 overflow-x-auto text-zinc-300 font-mono">
                  <code>{`const response = await fetch("https://gitforprompts.com/api/v1/prompts/[prompt-id]/latest", {
  headers: {
    "Authorization": "Bearer " + process.env.GFP_API_KEY
  }
});

const { content } = await response.json();`}</code>
                </pre>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/20 backdrop-blur-sm min-h-[500px]">
              {/* Sandbox Sidebar */}
              <div className="border-r border-zinc-900 bg-zinc-900/10 p-5 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-200">customer-support-returns</h3>
                  <p className="text-xs text-zinc-500 mt-1">Simulated sandbox playground</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Version History</span>
                  <div className="space-y-1.5">
                    {versions.slice().reverse().map((v) => (
                      <button
                        key={v.versionNumber}
                        onClick={() => {
                          setActiveVersionNumber(v.versionNumber);
                          setEditorContent(v.content);
                        }}
                        className={`w-full flex flex-col items-start text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          activeVersionNumber === v.versionNumber
                            ? 'bg-zinc-900/80 border-zinc-700 text-zinc-100 shadow-sm'
                            : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-[10px] font-semibold text-zinc-400">v{v.versionNumber}</span>
                          <span className="text-[10px] text-zinc-500">{v.createdAt}</span>
                        </div>
                        <p className="text-xs truncate w-full mt-1.5 text-zinc-400">
                          {v.commitMessage}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sandbox Workspace Area */}
              <div className="lg:col-span-3 flex flex-col">
                {/* Tab bar */}
                <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/10 px-5">
                  <div className="flex">
                    {(['edit', 'diff', 'tests'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSubTab(tab)}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                          activeSubTab === tab
                            ? 'border-zinc-50 text-zinc-100'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Workspace Content Panel */}
                <div className="flex-1 p-5 flex flex-col">
                  {/* Edit Tab */}
                  {activeSubTab === 'edit' && (
                    <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                      <div className="flex-1 flex flex-col border border-zinc-900 rounded-lg bg-zinc-950 overflow-hidden min-h-[300px]">
                        <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 font-mono">
                          <span>prompt_template.txt</span>
                          <span>v{activeVersionNumber}</span>
                        </div>
                        <textarea
                          value={editorContent}
                          onChange={(e) => setEditorContent(e.target.value)}
                          className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-zinc-100"
                          placeholder="Write your prompt system instruction..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={commitInput}
                          onChange={(e) => setCommitInput(e.target.value)}
                          placeholder="Commit message (e.g. Adjust refund instructions)"
                          className="md:col-span-3 px-4 py-2 text-sm rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                        />
                        <button
                          onClick={() => {
                            if (!editorContent.trim()) return;
                            const nextVersion = versions.length + 1;
                            const msg = commitInput.trim() || `Update version ${nextVersion}`;
                            
                            const newVer = {
                              versionNumber: nextVersion,
                              content: editorContent,
                              commitMessage: msg,
                              createdAt: 'Just now'
                            };
                            
                            setVersions([...versions, newVer]);
                            setActiveVersionNumber(nextVersion);
                            setCommitInput('');
                          }}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          Commit Save
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Diff Tab */}
                  {activeSubTab === 'diff' && (() => {
                    const v1Content = versions[0].content;
                    const originalLines = v1Content.split('\n');
                    const modifiedLines = editorContent.split('\n');

                    return (
                      <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                          <span className="px-2 py-0.5 rounded bg-red-950/30 text-red-400 border border-red-900/50">v1 (Original)</span>
                          <span className="text-zinc-600">→</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-900/50">v{activeVersionNumber} (Active Sandbox)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950 min-h-[300px]">
                          {/* Original View */}
                          <div className="p-4 border-r border-zinc-900 bg-zinc-900/5 overflow-y-auto max-h-[350px]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">Original</span>
                            <pre className="font-mono text-xs leading-relaxed text-zinc-400 space-y-1">
                              {originalLines.map((line, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-1.5 py-0.5 rounded ${
                                    editorContent.includes(line) ? '' : 'bg-red-950/30 text-red-300 border border-red-900/30 font-semibold'
                                  }`}
                                >
                                  {editorContent.includes(line) ? ' ' : '- '} {line}
                                </div>
                              ))}
                            </pre>
                          </div>

                          {/* Sandbox View */}
                          <div className="p-4 overflow-y-auto max-h-[350px]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">Sandbox (Edited)</span>
                            <pre className="font-mono text-xs leading-relaxed text-zinc-400 space-y-1">
                              {modifiedLines.map((line, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-1.5 py-0.5 rounded ${
                                    v1Content.includes(line) ? '' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/30 font-semibold'
                                  }`}
                                >
                                  {v1Content.includes(line) ? ' ' : '+ '} {line}
                                </div>
                              ))}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tests Tab */}
                  {activeSubTab === 'tests' && (
                    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-200">
                      {/* Test Case Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-zinc-200">Suite Assertions</h4>
                          <p className="text-xs text-zinc-500 mt-1">Run prompts against test criteria using the simulated engine.</p>
                        </div>
                        <button
                          onClick={async () => {
                            setTestResult('running');
                            setTestLogs([]);
                            setTestOutput('');

                            const appendLog = (log: string, delay: number) => {
                              return new Promise<void>((resolve) => {
                                setTimeout(() => {
                                  setTestLogs((prev) => [...prev, log]);
                                  resolve();
                                }, delay);
                              });
                            };

                            await appendLog('⏱️ [17:55:00] Initializing test pipeline...', 0);
                            await appendLog('🤖 [17:55:00] Querying simulated Groq provider: llama-3.3-70b-versatile...', 400);
                            await appendLog('✅ [17:55:01] Response received. Starting natural language validation assertions...', 500);

                            // Dynamic Check
                            const hasRefund = editorContent.toLowerCase().includes('refund');
                            const hasTeam = editorContent.toLowerCase().includes('customer support team');

                            if (hasRefund) {
                              await appendLog('✔️ [17:55:01] Assertion "Must offer a full refund" -> PASSED', 400);
                            } else {
                              await appendLog('❌ [17:55:01] Assertion "Must offer a full refund" -> FAILED', 400);
                            }

                            if (hasTeam) {
                              await appendLog('✔️ [17:55:02] Assertion "Sign off with Customer Support Team" -> PASSED', 400);
                            } else {
                              await appendLog('❌ [17:55:02] Assertion "Sign off with Customer Support Team" -> FAILED', 400);
                            }

                            setTimeout(() => {
                              if (hasRefund && hasTeam) {
                                setTestOutput(
                                  `Hi Karan,\n\nI am so sorry to hear that your shoes arrived yesterday with a cracked sole. That is certainly not up to our department standards. Since the item is damaged, we will issue a full refund to your original payment method immediately. Let us know if you need anything else!\n\nBest regards,\nCustomer Support Team`
                                );
                                setTestResult('passed');
                                setTestLogs((prev) => [...prev, '🎉 [17:55:02] Overall evaluation score: 100/100 (PASSED)']);
                              } else {
                                setTestOutput(
                                  `I received your message regarding cracked soles on shoes. Please return the package using a returns label. Let us know if you have questions.`
                                );
                                setTestResult('failed');
                                setTestLogs((prev) => [...prev, '⚠️ [17:55:02] Overall evaluation score: 50/100 (FAILED)']);
                              }
                            }, 300);
                          }}
                          disabled={testResult === 'running'}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-all cursor-pointer ${
                            testResult === 'running'
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                              : 'bg-zinc-50 text-zinc-950 hover:bg-zinc-200'
                          }`}
                        >
                          <Play className="h-4 w-4 fill-current" />
                          {testResult === 'running' ? 'Running Tests...' : 'Run Test Suite'}
                        </button>
                      </div>

                      {/* Test Card & Output Area */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Test card */}
                        <div className="md:col-span-1 border border-zinc-900 bg-zinc-900/10 rounded-xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Test Case</span>
                            {testResult === 'passed' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-emerald-950/30 text-emerald-400 bg-emerald-950/20">PASSED</span>
                            )}
                            {testResult === 'failed' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-red-950/30 text-red-400 bg-red-950/20">FAILED</span>
                            )}
                            {testResult === 'running' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-sky-900/50 text-sky-400 bg-sky-950/20 animate-pulse">RUNNING</span>
                            )}
                            {testResult === 'idle' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-zinc-800 bg-zinc-900 text-zinc-400">UNTESTED</span>
                            )}
                          </div>

                          <div>
                            <h5 className="font-semibold text-sm text-zinc-200">{testCase.name}</h5>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Input Variables</span>
                              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900 whitespace-pre-wrap">
                                {testCase.input_text}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Assertions</span>
                              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900 whitespace-pre-wrap">
                                {testCase.expectedCriteria}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Output & logs */}
                        <div className="md:col-span-2 flex flex-col space-y-4">
                          {/* Logs */}
                          {testLogs.length > 0 && (
                            <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-1.5 max-h-[140px] overflow-y-auto">
                              {testLogs.map((log, index) => (
                                <div key={index} className="leading-relaxed">{log}</div>
                              ))}
                            </div>
                          )}

                          {/* Actual output */}
                          {testOutput && (
                            <div className="flex-1 border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden flex flex-col animate-in fade-in duration-300">
                              <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
                                actual_response.txt
                              </div>
                              <pre className="p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap flex-1 leading-relaxed">
                                {testOutput}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
