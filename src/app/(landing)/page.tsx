'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
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
import { Logo } from '@/components/logo';

// Subcomponents
import { Hero } from './_components/hero';
import { Features } from './_components/features';
import { QuickStart } from './_components/quickstart';
import { InteractiveDiffPlayground } from './_components/interactive-diff-playground';
import { ComparisonTable } from './_components/comparison-table';
import { FixesSection } from './_components/fixes-section';
import { SdkSection } from './_components/sdk-section';
import { TestSuiteInfo } from './_components/test-suite-info';
import { SecurityInfo } from './_components/security-info';
import { Footer } from './_components/footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');

  const changeTab = (tab: 'tour' | 'sandbox') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

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
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'diff' | 'tests' | 'compare'>('edit');
  const [compareVerA, setCompareVerA] = useState(1);
  const [compareVerB, setCompareVerB] = useState(2);
  const [compareStatus, setCompareStatus] = useState<'idle' | 'running' | 'done'>('idle');
  
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
      


      {/* Header - Floating Centered Glass Rectangle Navbar */}
      <header 
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md rounded-xl shadow-2xl transition-all duration-300 w-[calc(100%-2rem)] max-w-5xl px-5 py-2.5"
      >
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white leading-none">Git for Prompts</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-widest font-medium">Prompt VCS</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 font-mono">
          <Link 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Home
          </Link>
          <Link 
            href="#docs" 
            onClick={(e) => handleNavClick(e, 'docs')}
            className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            API Docs
          </Link>
          <button
            onClick={() => changeTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
            className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            {activeTab === 'tour' ? 'Sandbox Playground' : 'Product Tour'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white transition-colors shadow-sm cursor-pointer"
            >
              Dashboard
            </Link>
            <div className="pl-1">
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs font-medium text-zinc-400 hover:text-white px-3 py-1.5 transition-colors hidden sm:block cursor-pointer font-mono"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center font-semibold rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white transition-colors px-4 py-1.5 text-xs shadow-sm cursor-pointer"
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
                          changeTab(activeTab === 'tour' ? 'sandbox' : 'tour');
                        }}
                        className="w-full text-left py-2 px-3 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors bg-transparent border-none cursor-pointer"
                      >
                        {activeTab === 'tour' ? 'Try Sandbox Playground' : 'View Product Tour'}
                      </button>
                    </SheetClose>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-900 mt-4 flex flex-col gap-2">
                    <Show when="signed-out">
                      <SheetClose asChild>
                        <Link
                          href="/sign-in"
                          className="w-full text-left py-2 px-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors block"
                        >
                          Sign In
                        </Link>
                      </SheetClose>
                    </Show>
                    <Show when="signed-in">
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="w-full text-left py-2 px-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors block"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
                    </Show>
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
          <div className="w-full space-y-0 py-12" style={{ background: '#111111' }}>
            
            {/* Hero Section */}
            <Hero onTrySandbox={() => changeTab('sandbox')} />

            {/* Feature cards */}
            <Features />

            {/* CLI Quick Start */}
            <QuickStart />

            {/* Interactive Diff Playground */}
            <InteractiveDiffPlayground />

            {/* Competitor comparison */}
            <ComparisonTable />

            {/* What we help teams fix quadrant grid */}
            <FixesSection onOpenSandbox={() => changeTab('sandbox')} />

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
                    {(['edit', 'diff', 'tests', 'compare'] as const).map((tab) => (
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
                          {testOutput ? (
                            <div className="flex-1 border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden flex flex-col animate-in fade-in duration-300">
                              <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
                                actual_response.txt
                              </div>
                              <pre className="p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap flex-1 leading-relaxed font-mono">
                                {testOutput}
                              </pre>
                            </div>
                          ) : testResult === 'running' ? (
                            <div className="flex-1 border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden flex flex-col animate-pulse min-h-[160px]">
                              <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
                                actual_response.txt (generating...)
                              </div>
                              <div className="p-4 space-y-3 flex-1 flex flex-col justify-center">
                                <div className="h-3 bg-zinc-800 rounded-md w-3/4 animate-pulse" />
                                <div className="h-3 bg-zinc-800 rounded-md w-5/6 animate-pulse" />
                                <div className="h-3 bg-zinc-800 rounded-md w-2/3 animate-pulse" />
                              </div>
                            </div>
                          ) : null}

                        </div>

                      </div>
                    </div>
                  )}

                  {/* Compare Tab */}
                  {activeSubTab === 'compare' && (() => {
                    const verAObj = versions.find(v => v.versionNumber === compareVerA);
                    const verBObj = versions.find(v => v.versionNumber === compareVerB);

                    const evaluateContent = (content: string) => {
                      const hasRefund = content.toLowerCase().includes('refund');
                      const hasTeam = content.toLowerCase().includes('customer support team');
                      return {
                        hasRefund,
                        hasTeam,
                        score: (hasRefund ? 1 : 0) + (hasTeam ? 1 : 0)
                      };
                    };

                    const evalA = verAObj ? evaluateContent(verAObj.content) : { hasRefund: false, hasTeam: false, score: 0 };
                    const evalB = verBObj ? evaluateContent(verBObj.content) : { hasRefund: false, hasTeam: false, score: 0 };
                    const total = 2;

                    const winnerSide = evalA.score > evalB.score ? 'A' : evalB.score > evalA.score ? 'B' : 'tie';

                    return (
                      <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-200">
                        {/* Selector bar */}
                        <div className="flex items-end gap-4 flex-wrap">
                          <div className="space-y-1">
                            <label className="text-xs text-zinc-500 block">Version A</label>
                            <select
                              value={compareVerA}
                              onChange={(e) => {
                                setCompareVerA(Number(e.target.value));
                                setCompareStatus('idle');
                              }}
                              className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 font-mono focus:outline-none transition-colors"
                            >
                              {versions.map((v) => (
                                <option key={v.versionNumber} value={v.versionNumber} disabled={v.versionNumber === compareVerB}>
                                  v{v.versionNumber} ({v.commitMessage})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-zinc-650 pb-1.5 font-mono text-sm select-none">vs</div>

                          <div className="space-y-1">
                            <label className="text-xs text-zinc-500 block">Version B</label>
                            <select
                              value={compareVerB}
                              onChange={(e) => {
                                setCompareVerB(Number(e.target.value));
                                setCompareStatus('idle');
                              }}
                              className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 font-mono focus:outline-none transition-colors"
                            >
                              {versions.map((v) => (
                                <option key={v.versionNumber} value={v.versionNumber} disabled={v.versionNumber === compareVerA}>
                                  v{v.versionNumber} ({v.commitMessage})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="ml-auto">
                            <button
                              onClick={() => {
                                setCompareStatus('running');
                                setTimeout(() => {
                                  setCompareStatus('done');
                                }, 1000);
                              }}
                              disabled={compareStatus === 'running' || compareVerA === compareVerB}
                              className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-all cursor-pointer"
                            >
                              {compareStatus === 'running' ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Running...
                                </span>
                              ) : (
                                'Run Comparison'
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Inline warnings */}
                        {compareVerA === compareVerB && (
                          <p className="text-xs text-amber-400 font-mono">⚠ Select two different versions to compare.</p>
                        )}

                        {/* Running state skeleton */}
                        {compareStatus === 'running' && (
                          <div className="space-y-6">
                            {/* Winner banner skeleton */}
                            <div className="rounded-lg border border-zinc-900 bg-zinc-900/10 p-4 flex items-center justify-between animate-pulse">
                              <div className="space-y-2 w-1/3">
                                <div className="h-5 bg-zinc-800 rounded w-1/2" />
                                <div className="h-3 bg-zinc-900 rounded w-1/3" />
                              </div>
                              <div className="flex gap-4">
                                <div className="h-8 bg-zinc-850 rounded w-10" />
                                <div className="h-8 bg-zinc-850 rounded w-10" />
                              </div>
                            </div>

                            {/* Progress bars skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[1, 2].map((i) => (
                                <div key={i} className="rounded-lg border border-zinc-900 p-4 space-y-3 bg-zinc-900/10 animate-pulse">
                                  <div className="flex justify-between">
                                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                                    <div className="h-3 bg-zinc-855 rounded w-1/6" />
                                  </div>
                                  <div className="h-2 bg-zinc-900 rounded w-full" />
                                </div>
                              ))}
                            </div>

                            {/* Results table skeleton */}
                            <div className="rounded-lg border border-zinc-900 overflow-hidden bg-zinc-950/20 animate-pulse">
                              <div className="grid grid-cols-[1fr_auto_auto] border-b border-zinc-900 bg-zinc-900/30 px-4 py-3">
                                <div className="h-3 bg-zinc-800 rounded w-1/4" />
                                <div className="h-3 bg-zinc-850 rounded w-12" />
                                <div className="h-3 bg-zinc-850 rounded w-12" />
                              </div>
                              <div className="divide-y divide-zinc-900/50 p-4 space-y-4">
                                {[1, 2].map((i) => (
                                  <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center pt-2">
                                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                                    <div className="h-6 bg-zinc-850 rounded w-14 mx-4" />
                                    <div className="h-6 bg-zinc-850 rounded w-14 mx-4" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Winner banner */}
                        {compareStatus === 'done' && (
                          <div
                            className={`rounded-lg border p-4 flex items-center justify-between gap-4 transition-all ${
                              winnerSide === 'tie'
                                ? 'border-zinc-800 bg-zinc-900/50'
                                : 'border-emerald-800/60 bg-emerald-950/20'
                            }`}
                          >
                            <div className="flex items-baseline gap-3">
                              <span className={`text-lg font-bold ${winnerSide === 'tie' ? 'text-zinc-350' : 'text-emerald-450'}`}>
                                {winnerSide === 'tie' ? '🤝 Tie' : `🏆 v${winnerSide === 'A' ? compareVerA : compareVerB} wins`}
                              </span>
                              {winnerSide !== 'tie' ? (
                                <span className="text-sm text-zinc-500 font-mono">
                                  {evalA.score}/{total} vs {evalB.score}/{total}
                                </span>
                              ) : (
                                <span className="text-sm text-zinc-500 font-mono">
                                  Both versions scored {evalA.score}/{total}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-center min-w-[3rem]">
                                <div className="text-[10px] font-mono text-zinc-500 mb-0.5">v{compareVerA}</div>
                                <div className={`text-xl font-bold tabular-nums ${winnerSide === 'A' ? 'text-emerald-450' : 'text-zinc-400'}`}>
                                  {evalA.score}/{total}
                                </div>
                              </div>
                              <div className="text-zinc-700 text-xs font-mono select-none">vs</div>
                              <div className="text-center min-w-[3rem]">
                                <div className="text-[10px] font-mono text-zinc-500 mb-0.5">v{compareVerB}</div>
                                <div className={`text-xl font-bold tabular-nums ${winnerSide === 'B' ? 'text-emerald-450' : 'text-zinc-400'}`}>
                                  {evalB.score}/{total}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Progress bars */}
                        {compareStatus === 'done' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { label: `v${compareVerA}`, score: evalA.score, isWinner: winnerSide === 'A' },
                              { label: `v${compareVerB}`, score: evalB.score, isWinner: winnerSide === 'B' }
                            ].map((side, idx) => (
                              <div
                                key={idx}
                                className={`rounded-lg border p-4 space-y-2 ${
                                  side.isWinner ? 'border-emerald-800/60 bg-emerald-950/10' : 'border-zinc-900 bg-zinc-900/10'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs text-zinc-400">{side.label}</span>
                                  <span className="text-xs text-zinc-500 font-mono">{side.score}/{total} passed</span>
                                </div>
                                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${side.score === total ? 'bg-emerald-500' : side.score > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${(side.score / total) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Results table */}
                        {compareStatus === 'done' && (
                          <div className="rounded-lg border border-zinc-900 overflow-hidden bg-zinc-950/40">
                            <div className="grid grid-cols-[1fr_auto_auto] border-b border-zinc-900 bg-zinc-900/30">
                              <div className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Assertion / Scenario</div>
                              <div className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-center font-mono ${winnerSide === 'A' ? 'text-emerald-450' : 'text-zinc-500'}`}>
                                v{compareVerA}{winnerSide === 'A' && ' 🏆'}
                              </div>
                              <div className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-center font-mono ${winnerSide === 'B' ? 'text-emerald-450' : 'text-zinc-500'}`}>
                                v{compareVerB}{winnerSide === 'B' && ' 🏆'}
                              </div>
                            </div>

                            <div className="divide-y divide-zinc-900/50">
                              {[
                                { name: 'Must offer a full refund', checkA: evalA.hasRefund, checkB: evalB.hasRefund },
                                { name: 'Sign off with Customer Support Team', checkA: evalA.hasTeam, checkB: evalB.hasTeam }
                              ].map((row, idx) => {
                                const diffRow = row.checkA !== row.checkB;
                                return (
                                  <div key={idx} className={`grid grid-cols-[1fr_auto_auto] items-center ${diffRow ? 'bg-amber-950/10' : ''}`}>
                                    <div className="px-4 py-3 text-sm text-zinc-300 font-mono">{row.name}</div>
                                    <div className="px-6 py-3 flex justify-center">
                                      <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold border ${
                                        row.checkA
                                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/50'
                                          : 'bg-red-950/60 text-red-400 border-red-900/50'
                                      }`}>
                                        {row.checkA ? 'PASS' : 'FAIL'}
                                      </span>
                                    </div>
                                    <div className="px-6 py-3 flex justify-center">
                                      <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold border ${
                                        row.checkB
                                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/50'
                                          : 'bg-red-950/60 text-red-400 border-red-900/50'
                                      }`}>
                                        {row.checkB ? 'PASS' : 'FAIL'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Idle empty state */}
                        {compareStatus === 'idle' && (
                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-900 py-16 text-center bg-zinc-950/10">
                            <div className="text-3xl mb-3 select-none">⚖</div>
                            <h4 className="text-sm font-semibold text-zinc-350 mb-1">Ready to compare</h4>
                            <p className="text-xs text-zinc-500 max-w-xs">
                              Select two versions above and click{' '}
                              <span className="font-mono text-zinc-400">Run Comparison</span> to see which prompt performs better.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
