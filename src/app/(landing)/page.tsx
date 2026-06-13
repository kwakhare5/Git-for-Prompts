'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Show } from '@clerk/nextjs';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Play, 
  Menu, 
  X
} from 'lucide-react';

// Subcomponents
import { Hero } from './_components/hero';
import { Features } from './_components/features';
import { FixesSection } from './_components/fixes-section';
import { SdkSection } from './_components/sdk-section';
import { TestSuiteInfo } from './_components/test-suite-info';
import { SecurityInfo } from './_components/security-info';
import { Footer } from './_components/footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    if (sectionId === 'features' || sectionId === 'docs' || sectionId === 'home') {
      e.preventDefault();
      if (activeTab !== 'tour') {
        setActiveTab('tour');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Sandbox states
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
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'diff' | 'tests'>('edit');
  
  const testCase = {
    name: 'Returns Refund Request',
    input_text: 'I bought shoes yesterday and they arrived with a cracked sole. Can I get my money back?',
    expectedCriteria: 'Must offer a full refund and sign off with "Customer Support Team".'
  };

  const [testResult, setTestResult] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [testOutput, setTestOutput] = useState('');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  return (
    <div id="home" className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 relative overflow-x-hidden">
      


      {/* Header - Floating Centered Glass Rectangle Navbar (Stays visible as you scroll) */}
      <header 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border border-zinc-900/40 bg-zinc-950/90 backdrop-blur-xs rounded-xl shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-5xl px-6 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <GitBranch className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-none">Git for Prompts</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-widest font-semibold">Prompt vcs</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link 
            href="#docs" 
            onClick={(e) => handleNavClick(e, 'docs')}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            API Docs
          </Link>
          <button
            onClick={() => setActiveTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-450 hover:text-zinc-200 transition-colors cursor-pointer bg-transparent border-none"
          >
            {activeTab === 'tour' ? 'Sandbox Playground' : 'Product Tour'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 hover:bg-zinc-900 transition-colors shadow-sm"
            >
              Dashboard
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 px-4 py-1.5 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)] px-4.5 py-1.5 text-xs"
            >
              Get Started
            </Link>
          </Show>

          {/* Mobile Sheet Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-lg hover:bg-zinc-900 h-8 w-8">
                  <Menu className="size-4 text-zinc-300" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="bg-zinc-950/95 border-l border-zinc-900 w-full max-w-xs gap-0 backdrop-blur-lg text-zinc-100 rounded-l-xl"
                showClose={false}
              >
                <div className="flex h-14 items-center justify-between border-b border-zinc-900 px-4">
                  <span className="font-bold text-sm">Menu</span>
                  <SheetClose asChild>
                    <Button size="icon" variant="ghost" className="rounded-lg hover:bg-zinc-900 h-8 w-8">
                      <X className="size-4 text-zinc-300" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetClose>
                </div>
                <div className="container grid gap-y-4 px-4 pt-5 pb-12">
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Link 
                        href="#home" 
                        onClick={(e) => handleNavClick(e, 'home')}
                        className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors block py-2 px-3 hover:bg-zinc-900 rounded-md"
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        href="#docs" 
                        onClick={(e) => handleNavClick(e, 'docs')}
                        className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors block py-2 px-3 hover:bg-zinc-900 rounded-md"
                      >
                        API Docs
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          setActiveTab(activeTab === 'tour' ? 'sandbox' : 'tour');
                        }}
                        className="w-full text-left py-2 px-3 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors bg-transparent border-none cursor-pointer"
                      >
                        {activeTab === 'tour' ? 'Try Sandbox Playground' : 'View Product Tour'}
                      </button>
                    </SheetClose>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-900 mt-4 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        href="/sign-in"
                        className="w-full text-left py-2 px-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors block"
                      >
                        Sign In
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col pt-24">
        {activeTab === 'tour' ? (
          <div className="w-full space-y-24 py-12">
            
            {/* Hero Section */}
            <Hero onTrySandbox={() => setActiveTab('sandbox')} />

            {/* Features (Tour SVG Canvas selector) */}
            <Features />

            {/* What we help teams fix quadrant grid */}
            <FixesSection onOpenSandbox={() => setActiveTab('sandbox')} />

            {/* Code Integration snippets */}
            <SdkSection />

            {/* Quality Assertions detail */}
            <TestSuiteInfo />

            {/* Postgres / RLS / Clerk architecture info */}
            <SecurityInfo />

            {/* Footer */}
            <Footer />

          </div>
        ) : (
          /* Interactive Sandbox Layout */
          <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/20 backdrop-blur-sm min-h-[500px]">
              
              {/* Sandbox Sidebar */}
              <div className="border-r border-zinc-900 bg-zinc-900/10 p-5 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-200">customer-support-returns</h3>
                  <p className="text-xs text-zinc-500 mt-1">Simulated sandbox workspace</p>
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
                              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900 whitespace-pre-wrap font-mono">
                                {testCase.input_text}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Assertions</span>
                              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900 whitespace-pre-wrap font-mono">
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
                                <div key={index} className="leading-relaxed font-mono">{log}</div>
                              ))}
                            </div>
                          )}

                          {/* Actual output */}
                          {testOutput && (
                            <div className="flex-1 border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden flex flex-col animate-in fade-in duration-300">
                              <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
                                actual_response.txt
                              </div>
                              <pre className="p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap flex-1 leading-relaxed font-mono">
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

      {/* Footer (Rendered outside tour grid to support both sandbox and tour layout) */}
      {activeTab === 'tour' ? null : <Footer />}

    </div>
  );
}
