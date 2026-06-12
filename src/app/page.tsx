


'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Show } from '@clerk/nextjs';
import { 
  GitBranch, 
  Play, 
  Sparkles, 
  BookOpen, 
  Check, 
  ArrowRight,
  Copy,
  Cpu,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);
  const [wipePos, setWipePos] = useState<number>(50);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  
  // Ref for slider container to calculate position
  const wipeContainerRef = useRef<HTMLDivElement>(null);

  // States for Hero Dashboard Mockup
  const [heroStep, setHeroStep] = useState<number>(0);
  const [heroPrompt, setHeroPrompt] = useState<string>('You are a helpful returns bot.');
  
  // Hero Mockup Loop
  useEffect(() => {
    if (activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setHeroStep((prev) => {
        const next = (prev + 1) % 3;
        if (next === 0) {
          setHeroPrompt('You are a helpful returns bot.');
        } else if (next === 1) {
          setHeroPrompt('You are a helpful returns bot. If items are broken, offer a full refund.');
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Autoplay for features tab list
  useEffect(() => {
    if (isAutoplayPaused || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplayPaused, activeTab]);

  // States for Feature Graphic 3 (Pipeline)
  const [pipelineState, setPipelineState] = useState<number>(0);
  useEffect(() => {
    if (activeFeature !== 2 || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setPipelineState((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeFeature, activeTab]);

  // States for Feature Graphic 4 (API Packet Flow)
  const [apiProgress, setApiProgress] = useState<number>(0);
  useEffect(() => {
    if (activeFeature !== 3 || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setApiProgress((prev) => (prev === 100 ? 0 : 100));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeFeature, activeTab]);

  // States for New 'What Git for Prompts Fixes' Section
  const [card1State, setCard1State] = useState<number>(0);
  const [card2DecayIdx, setCard2DecayIdx] = useState<number>(0);
  const [card3Step, setCard3Step] = useState<number>(0);
  const [card3Timer, setCard3Timer] = useState<string>('0m');
  const [card4State, setCard4State] = useState<number>(0);

  // Interval loops for the "What GFP Fixes" cards
  useEffect(() => {
    if (activeTab !== 'tour') return;

    // Card 1: Regression check loop
    const c1Interval = setInterval(() => {
      setCard1State((prev) => (prev + 1) % 3);
    }, 3500);

    // Card 2: Knowledge decay fade loop
    const c2Interval = setInterval(() => {
      setCard2DecayIdx((prev) => (prev + 1) % 4);
    }, 2000);

    // Card 3: Slack query stopwatch loop
    const c3Interval = setInterval(() => {
      setCard3Step((prev) => {
        const next = (prev + 1) % 4;
        if (next === 0) setCard3Timer('0m');
        else if (next === 1) setCard3Timer('14m');
        else if (next === 2) setCard3Timer('1h 45m');
        else if (next === 3) setCard3Timer('3h 12m');
        return next;
      });
    }, 3000);

    // Card 4: Buried crash logs loop
    const c4Interval = setInterval(() => {
      setCard4State((prev) => (prev + 1) % 3);
    }, 3200);

    return () => {
      clearInterval(c1Interval);
      clearInterval(c2Interval);
      clearInterval(c3Interval);
      clearInterval(c4Interval);
    };
  }, [activeTab]);

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
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 relative overflow-x-hidden">
      
      {/* Local Premium Styles */}
      <style>{`
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes cdn-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-draw-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-line 1.5s forwards ease-in-out;
        }
        .animate-cdn-flow {
          stroke-dasharray: 6;
          animation: cdn-flow 1s linear infinite;
        }
        .glow-green {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .glow-red {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
        }
        .dots-bg {
          background-image: radial-gradient(rgba(63, 63, 70, 0.15) 1px, transparent 0);
          background-size: 16px 16px;
        }
      `}</style>

      {/* Header - Floating Premium Glass Navbar */}
      <header className="sticky top-4 z-50 mx-auto mt-4 max-w-5xl w-[calc(100%-2rem)] flex items-center justify-between border border-zinc-900 bg-zinc-950/70 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <GitBranch className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-none">Git for Prompts</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-widest font-semibold">Prompt vcs</span>
          </div>
        </div>

        {/* Floating pill switcher */}
        <div className="flex items-center bg-zinc-900/50 border border-zinc-850 p-0.5 rounded-full">
          <button
            onClick={() => setActiveTab('tour')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'tour'
                ? 'bg-zinc-800 text-zinc-50 border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Tour
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-zinc-800 text-zinc-50 border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Sandbox
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-full border border-zinc-850 bg-zinc-900/40 text-zinc-200 hover:bg-zinc-900 transition-colors shadow-sm"
            >
              Dashboard
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)]"
            >
              Get Started
            </Link>
          </Show>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'tour' ? (
          <div className="w-full space-y-24 py-12">
            
            {/* Hero Section */}
            <section className="text-center space-y-6 px-6 max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.15]">
                Treat your prompts <br className="hidden md:inline" />like production code.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                Version, test, A/B compare, and deploy AI prompt templates using a clean, developer-first Git workflow. No more prompt chaos in Notion or hardcoded source files.
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


              {/* High-Fidelity Hero Dashboard Mockup (macOS style, fully readable, no overlap) */}
              <div className="pt-10 w-full max-w-4xl mx-auto select-none">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/20 via-transparent to-zinc-950/20 pointer-events-none" />
                  
                  {/* macOS Mock Window Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/45 px-4 py-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] block" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] block" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB2F] block" />
                      <span className="text-[11px] font-mono text-zinc-500 ml-3">returns_agent_v3.git</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Live in Production</span>
                    </div>
                  </div>

                  {/* Mock Workspace Content */}
                  <div className="flex flex-col md:grid md:grid-cols-12 text-left md:h-[360px] w-full">
                    
                    {/* Left Pane - Commit List */}
                    <div className="md:col-span-4 border-r border-zinc-850 p-4 space-y-3 bg-zinc-900/10 overflow-hidden flex flex-col justify-start">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Commit Log</span>
                      <div className="space-y-2 flex-1 overflow-y-auto">
                        
                        <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                          heroStep === 2 ? 'bg-zinc-950 border-zinc-800 shadow-sm opacity-100' : 'bg-transparent border-transparent opacity-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] font-semibold text-emerald-400">v3 (active)</span>
                            <span className="text-[8px] font-mono text-zinc-500">2m ago</span>
                          </div>
                          <p className="text-[10px] text-zinc-300 mt-1 truncate">feat: added strict refund instruction</p>
                        </div>

                        <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                          heroStep === 1 ? 'bg-zinc-950 border-zinc-800 shadow-sm opacity-100' : 'bg-transparent border-transparent opacity-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] font-semibold text-zinc-400">v2</span>
                            <span className="text-[8px] font-mono text-zinc-500">10m ago</span>
                          </div>
                          <p className="text-[10px] text-zinc-300 mt-1 truncate">fix: clarify response tone</p>
                        </div>

                        <div className="p-2.5 rounded-lg border border-transparent opacity-30">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] font-semibold text-zinc-400">v1</span>
                            <span className="text-[8px] font-mono text-zinc-500">1h ago</span>
                          </div>
                          <p className="text-[10px] text-zinc-300 mt-1 truncate">Initial commit draft</p>
                        </div>

                      </div>
                    </div>

                    {/* Right Pane - Active Editor / Runner */}
                    <div className="md:col-span-8 p-4 flex flex-col justify-between bg-zinc-950/20 gap-4">
                      
                      {/* Interactive Console Screen */}
                      <div className="flex-1 flex flex-col justify-between gap-4 h-full">
                        <div className="flex-1 border border-zinc-800 bg-zinc-950 rounded-lg p-3.5 relative overflow-hidden font-mono min-h-[140px] md:h-44">
                          
                          {/* Code Editor Mockup layout */}
                          <div className="flex gap-3 font-mono text-[11px] h-full">
                            <div className="text-zinc-600 select-none text-right pr-2.5 border-r border-zinc-900 leading-relaxed font-mono">
                              <div>01</div>
                              <div>02</div>
                              <div>03</div>
                            </div>
                            <div className="leading-relaxed font-mono text-zinc-300 flex-1 whitespace-pre-wrap">
                              <span className="text-zinc-500">System: </span>
                              {heroPrompt}
                              <span className="w-1.5 h-3.5 bg-zinc-400 ml-0.5 inline-block animate-pulse align-middle" />
                            </div>
                          </div>

                          {/* Float Highlight Overlay */}
                          <div className="absolute right-3.5 top-3.5 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/90 text-[8px] text-zinc-400 font-mono tracking-wider font-semibold uppercase">
                            Prompt Editor
                          </div>
                        </div>

                        {/* Assertion Testing Progress Block */}
                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-3 space-y-2 shrink-0">
                          <div className="flex items-center justify-between border-b border-zinc-850 pb-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Automated Checks</span>
                            {heroStep === 2 ? (
                              <span className="text-[9px] text-emerald-400 font-bold font-mono tracking-wider bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded">100% PASSED</span>
                            ) : heroStep === 1 ? (
                              <span className="text-[9px] text-zinc-400 animate-pulse font-mono tracking-wider bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">RUNNING TESTS...</span>
                            ) : (
                              <span className="text-[9px] text-zinc-500 font-mono">IDLE</span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-1">
                            <div className="flex items-center gap-2">
                              {heroStep >= 2 ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400 border border-emerald-950 bg-emerald-950/20 rounded-full p-0.5" />
                              ) : heroStep === 1 ? (
                                <RefreshCw className="h-3 w-3 text-zinc-500 animate-spin" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border border-zinc-800 bg-zinc-900" />
                              )}
                              <span className="text-[10px] text-zinc-400 font-mono leading-none">Assert Refund Offer</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {heroStep >= 2 ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400 border border-emerald-950 bg-emerald-950/20 rounded-full p-0.5" />
                              ) : heroStep === 1 ? (
                                <RefreshCw className="h-3 w-3 text-zinc-500 animate-spin" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border border-zinc-800 bg-zinc-900" />
                              )}
                              <span className="text-[10px] text-zinc-400 font-mono leading-none">Assert Politeness</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Tour Panel */}
            <section 
              className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
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

              {/* Right Column - Custom Canvas (Revamped to Premium) */}
              <div className="lg:col-span-7 h-[420px] rounded-xl border border-zinc-900 bg-zinc-900/15 backdrop-blur-sm overflow-hidden flex flex-col relative select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/60 via-transparent to-zinc-950/60 pointer-events-none" />
                
                <div className="relative z-10 flex-1 flex flex-col h-full">
                  
                  {/* Graphic 1: Branching Tree Mockup */}
                  {activeFeature === 0 && (
                    <div className="flex-1 flex flex-col p-6 justify-between h-full animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Interactive Version History</span>
                        <span className="text-[10px] font-mono text-zinc-600">v1 → v2 (Active)</span>
                      </div>

                      <div className="flex-1 flex items-center justify-center relative">
                        {/* Connecting Path Graph */}
                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M 100 200 H 260 C 310 200, 310 120, 380 120 H 460" 
                            stroke="#27272a" 
                            strokeWidth="2" 
                            fill="none" 
                          />
                          <path 
                            d="M 100 200 H 260 C 310 200, 310 120, 380 120 H 460" 
                            stroke="#10b981" 
                            strokeWidth="2" 
                            fill="none" 
                            className="animate-draw-line"
                          />
                          <line x1="260" y1="200" x2="480" y2="200" stroke="#27272a" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>

                        {/* Nodes Overlay */}
                        <div className="absolute inset-0 flex items-center justify-between px-16">
                          
                          {/* Node 1 */}
                          <div className="flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-400 hover:border-zinc-500 transition-colors cursor-pointer">
                              v1
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500">Initial draft</span>
                          </div>

                          {/* Branch Marker */}
                          <div className="w-2 h-2 rounded-full bg-zinc-800 z-10 translate-x-[-15px]" />

                          {/* Node 2 (Branch active) */}
                          <div className="flex flex-col items-center gap-2 z-10 translate-y-[-40px]">
                            <div className="w-10 h-10 rounded-xl bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 glow-green cursor-pointer">
                              v2
                            </div>
                            <span className="text-[9px] font-mono text-emerald-500 font-bold">Active</span>
                          </div>

                          {/* Main trunk node */}
                          <div className="flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-500">
                              main
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600">Trunk</span>
                          </div>

                        </div>
                      </div>

                      {/* Commit details wrapper */}
                      <div className="border border-zinc-900 bg-zinc-950/60 rounded-lg p-3 font-mono text-[11px] text-zinc-400 space-y-1">
                        <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-semibold">
                          <span>Commit Metadata</span>
                          <span>branch: main</span>
                        </div>
                        <div className="text-zinc-200 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-semibold font-mono">commit e2d91bc</span> 
                          <span>- &quot;Clarified returns policy &amp; added support signature&quot;</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Graphic 2: Draggable Wipe (Polished) */}
                  {activeFeature === 1 && (
                    <div 
                      ref={wipeContainerRef}
                      className="flex-1 flex flex-col p-6 justify-between h-full select-none animate-in fade-in duration-300"
                      onMouseMove={(e) => {
                        if (!isWiping || !wipeContainerRef.current) return;
                        const rect = wipeContainerRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = Math.max(15, Math.min(85, (x / rect.width) * 100));
                        setWipePos(pct);
                      }}
                      onMouseUp={() => setIsWiping(false)}
                      onMouseLeave={() => setIsWiping(false)}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Side-by-Side Prompt Diff</span>
                        <span className="text-[9px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded font-mono">Drag divider to wipe</span>
                      </div>

                      {/* Diff Container */}
                      <div className="flex-1 border border-zinc-900 rounded-lg overflow-hidden relative bg-zinc-950 h-full mt-4 cursor-ew-resize">
                        
                        {/* Left Panel (Deleted/Original) */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-red-950/10 p-4 overflow-hidden"
                          style={{ width: `${wipePos}%` }}
                        >
                          <div className="flex items-center gap-2 mb-2 border-b border-red-950/50 pb-1.5">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 font-bold bg-red-950/30 px-1.5 py-0.5 rounded">v1 Original</span>
                          </div>
                          <div className="font-mono text-[10px] leading-relaxed text-red-300/80 space-y-1 font-mono">
                            <div className="opacity-40 font-mono">01 System: You answer queries.</div>
                            <div className="bg-red-950/40 border-l-2 border-red-500 pl-1 font-mono">- You answer questions about customer returns.</div>
                            <div className="opacity-40 font-mono">03 User: Help returns query.</div>
                          </div>
                        </div>

                        {/* Right Panel (Added/Refined) */}
                        <div 
                          className="absolute inset-y-0 right-0 bg-emerald-950/10 p-4 overflow-hidden border-l border-zinc-900"
                          style={{ left: `${wipePos}%` }}
                        >
                          <div className="flex items-center gap-2 mb-2 border-b border-emerald-950/50 pb-1.5">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/30 px-1.5 py-0.5 rounded">v2 Refined</span>
                          </div>
                          <div className="font-mono text-[10px] leading-relaxed text-emerald-300/80 space-y-1 font-mono">
                            <div className="opacity-40 font-mono">01 System: You answer queries.</div>
                            <div className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-1 font-mono">
                              + You are a polite returns agent. Offer a refund if broken. Sign off &quot;Customer Support Team&quot;.
                            </div>
                            <div className="opacity-40 font-mono">03 User: Help returns query.</div>
                          </div>
                        </div>

                        {/* Sliding Handle */}
                        <div 
                          className="absolute inset-y-0 w-[2px] bg-zinc-700 flex items-center justify-center cursor-ew-resize hover:bg-zinc-500 transition-colors"
                          style={{ left: `${wipePos}%` }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsWiping(true);
                          }}
                        >
                          <div className="w-5 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5 items-center justify-center shadow-2xl">
                            <span className="w-0.5 h-2 bg-zinc-500 rounded-full" />
                            <span className="w-0.5 h-2 bg-zinc-500 rounded-full" />
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Graphic 3: Pipeline runner (Polished) */}
                  {activeFeature === 2 && (
                    <div className="flex-1 flex flex-col p-6 justify-between h-full animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Automated Scoring Pipeline</span>
                        <span className="text-[9px] font-mono text-emerald-400">Simulation Running</span>
                      </div>

                      {/* Connection flowchart nodes */}
                      <div className="grid grid-cols-3 gap-4 py-4 relative z-10">
                        
                        <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-zinc-900 z-0">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            style={{ width: pipelineState >= 1 ? '100%' : '0%' }}
                          />
                        </div>

                        {/* Node 1 */}
                        <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-center z-10">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold">1. Prompt Version</span>
                          <span className="text-[9px] text-zinc-300 font-mono block mt-1 truncate">returns_policy_v2</span>
                        </div>

                        {/* Node 2 */}
                        <div className={`border p-3 rounded-lg text-center z-10 transition-all duration-300 ${
                          pipelineState >= 1 ? 'bg-zinc-900 border-emerald-800 glow-green' : 'bg-zinc-950 border-zinc-900'
                        }`}>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold">2. Model (Groq)</span>
                          <span className="text-[9px] text-emerald-400 font-mono block mt-1 font-bold">
                            {pipelineState >= 2 ? 'Response OK' : 'Querying...'}
                          </span>
                        </div>

                        {/* Node 3 */}
                        <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-center z-10">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold">3. Grading Suite</span>
                          <span className="text-[9px] text-zinc-400 font-mono block mt-1 font-bold">Evaluating</span>
                        </div>

                      </div>

                      {/* Assertion checklist window */}
                      <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-4 font-mono text-[10px] text-zinc-400 space-y-2 min-h-[120px] flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-zinc-500 font-mono">
                          <span>⏱️ [0.1s]</span>
                          <span>Parsing input JSON variables...</span>
                        </div>
                        {pipelineState >= 1 && (
                          <div className="flex items-center gap-2 text-zinc-300 font-mono">
                            <span>🤖 [0.4s]</span>
                            <span>Calling llama-3.3-70b-versatile (primary)...</span>
                          </div>
                        )}
                        {pipelineState >= 2 && (
                          <div className="flex items-center justify-between text-emerald-400 font-semibold font-mono animate-in fade-in">
                            <span>✔️ Assert &quot;Must offer a refund if item is broken&quot;</span>
                            <span>PASSED (100/100)</span>
                          </div>
                        )}
                        {pipelineState >= 3 && (
                          <div className="flex items-center justify-between text-emerald-400 font-semibold font-mono animate-in fade-in">
                            <span>✔️ Assert &quot;Sign off with support department team&quot;</span>
                            <span>PASSED (100/100)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Graphic 4: Runtime Fetch (Polished) */}
                  {activeFeature === 3 && (
                    <div className="flex-1 flex flex-col p-6 justify-between h-full animate-in fade-in duration-300">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Live Client Integration</span>
                        <span className="text-[9px] font-mono text-sky-400">CDN Request Flow</span>
                      </div>

                      {/* Pulse graph connection */}
                      <div className="flex items-center justify-between py-6 px-10 relative z-10">
                        
                        {/* Connecting Dotted Line */}
                        <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[10px] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <line 
                            x1="80" y1="5" x2="420" y2="5" 
                            stroke="#3f3f46" 
                            strokeWidth="1.5" 
                            strokeDasharray="6 6" 
                            className="animate-cdn-flow" 
                          />
                        </svg>

                        {/* Client Node */}
                        <div className="p-3 border border-zinc-900 rounded-lg bg-zinc-950 flex flex-col items-center z-10 w-28">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Your Server</span>
                          <span className="text-[10px] text-zinc-300 font-mono mt-1 font-bold">App Backend</span>
                        </div>

                        {/* Packet Particle */}
                        <div 
                          className="absolute h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all duration-1000 ease-in-out z-20"
                          style={{ 
                            left: apiProgress === 100 ? '78%' : '22%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />

                        {/* GFP Node */}
                        <div className="p-3 border border-zinc-900 rounded-lg bg-zinc-950 flex flex-col items-center z-10 w-28 border-emerald-900/60 glow-green">
                          <span className="text-[8px] font-mono text-emerald-400 uppercase font-semibold">GFP Edge CDN</span>
                          <span className="text-[10px] text-emerald-300 font-mono mt-1 font-bold">returns_v2</span>
                        </div>

                      </div>

                      {/* Client code response block */}
                      <div className="border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden font-mono text-[10px]">
                        <div className="px-3 py-1.5 border-b border-zinc-900 bg-zinc-900/30 text-[9px] text-zinc-500 flex justify-between font-mono">
                          <span>GET /api/v1/prompts/returns/latest</span>
                          <span className="text-emerald-400 font-semibold font-mono">200 OK (14ms)</span>
                        </div>
                        <pre className="p-3 text-zinc-400 overflow-x-auto select-none font-mono">
                          {`{
  "id": "prompt_returns_v2",
  "version": 2,
  "content": "You are a polite returns department agent. Offer a refund..."
}`}
                        </pre>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </section>



            {/* Inspiration from OneClarity: "What we help teams fix" Section */}
            <section className="border-t border-zinc-900 pt-20 px-6 max-w-6xl mx-auto space-y-12 select-none">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 font-sans">
                  What we help teams fix.
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-light font-sans">
                  Eliminate prompt regressions, untracked changes, author chasing, and model pipeline drifts.
                </p>
              </div>

              {/* 5-Card Grid inspired by OneClarity.ai - Dashboard Consistent Theme */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-stretch">
                
                {/* Card 1: Regression Test Pipeline (col-span-3) */}
                <div className="md:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 dots-bg shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/20 via-transparent to-zinc-950/20 pointer-events-none" />
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">01 / Testing & Integrity</span>
                    <h3 className="text-sm font-semibold text-zinc-50 font-sans">Untested Prompt Regressions</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      You edit a prompt instructions to solve an edge-case, and it silently breaks three others in production.
                    </p>
                  </div>

                  {/* Animated UI Preview */}
                  <div className="mt-5 border border-zinc-800 bg-zinc-950/90 rounded-lg p-3 space-y-2 relative font-mono text-[10px] z-10 shadow-inner">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 font-mono">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Assertion Tests Pipeline</span>
                      {card1State === 0 ? (
                        <span className="text-[9px] text-zinc-500 font-mono">Evaluating...</span>
                      ) : card1State === 1 ? (
                        <span className="text-[9px] text-red-400 font-bold font-mono">GAPS FOUND (33%)</span>
                      ) : (
                        <span className="text-[9px] text-emerald-400 font-bold font-mono">ALL PASSED (100%)</span>
                      )}
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-zinc-400 font-mono">Assert: Refund offer is included</span>
                        {card1State === 0 ? (
                          <span className="text-zinc-600 font-mono">Checking...</span>
                        ) : card1State === 1 ? (
                          <span className="text-red-400 font-semibold font-mono">❌ Failed</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold font-mono">✓ Passed</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between font-mono">
                        <span className="text-zinc-400 font-mono">Assert: Politeness formatting</span>
                        {card1State === 0 ? (
                          <span className="text-zinc-600 font-mono">Checking...</span>
                        ) : card1State === 1 ? (
                          <span className="text-red-400 font-semibold font-mono">❌ Failed</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold font-mono">✓ Passed</span>
                        )}
                      </div>
                    </div>

                    {/* One-click Rollback Alert */}
                    {card1State === 1 && (
                      <div className="absolute inset-0 bg-red-950/10 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
                        <div className="bg-zinc-950 border border-red-900/60 p-2.5 rounded text-center space-y-1.5 shadow-xl w-[90%]">
                          <span className="text-[9px] text-red-400 font-bold block">⚠️ Regression detected</span>
                          <button className="px-2.5 py-1 text-[8.5px] rounded bg-red-950/40 text-red-300 border border-red-900/50 hover:bg-red-900/40 transition-colors font-mono cursor-pointer w-full font-semibold">
                            Click to restore v2
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Fragmented Prompt Silos (col-span-3) */}
                <div className="md:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/20 via-transparent to-zinc-950/20 pointer-events-none" />
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">02 / Versioning & Storage</span>
                    <h3 className="text-sm font-semibold text-zinc-50 font-sans">Document Decay & Fragmentation</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Prompts live scattered in Google Docs, Slack notes, and hardcoded in app code. Nobody knows which is active.
                    </p>
                  </div>

                  {/* Fading List Animation (OneClarity style) */}
                  <div className="mt-5 space-y-2 font-mono text-[10px] z-10">
                    {[
                      { name: '📄 Google Doc: Refund Template v2', status: 'Drifted' },
                      { name: '💬 Slack: Alice draft snippet', status: 'Forgotten' },
                      { name: '💻 src/lib/openai.ts (hardcoded string)', status: 'Untracked' },
                      { name: '📄 Notion: production-system-prompts', status: 'Out-of-Sync' }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded border border-zinc-850 bg-zinc-950/60 transition-all duration-750 font-mono"
                        style={{ opacity: card2DecayIdx === idx ? 0.2 : 0.95 }}
                      >
                        <span className="text-zinc-300 font-mono truncate mr-2">{item.name}</span>
                        <span className="text-[8px] font-mono text-red-400/80 bg-red-950/20 border border-red-900/40 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Chasing Prompt Authors (col-span-2) */}
                <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 shadow-sm">
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">03 / Attribution audit</span>
                    <h3 className="text-sm font-semibold text-zinc-50 font-sans">Chasing Prompt Changes</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Who modified the system parameters on production? Finding out takes hours of Slack threads.
                    </p>
                  </div>

                  {/* Slack query stops loop */}
                  <div className="mt-5 border border-zinc-850 bg-zinc-950/90 rounded-lg p-3 space-y-2.5 font-mono text-[9px] flex-1 flex flex-col justify-center z-10 shadow-inner">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1 text-zinc-500 font-semibold font-mono">
                      <span>Slack Search Query</span>
                      <span className="flex items-center gap-1 font-mono text-zinc-600">
                        <Clock className="h-2.5 w-2.5 font-mono" /> {card3Timer} elapsed
                      </span>
                    </div>

                    <div className="space-y-2 font-mono">
                      <div className="flex items-center justify-between font-mono">
                        <span className={`font-mono transition-colors ${card3Step >= 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>1. Sarah M. (searching Slack)</span>
                        <span className="font-mono">
                          {card3Step === 0 ? (
                            <span className="text-zinc-400 animate-pulse">checking...</span>
                          ) : card3Step > 0 ? (
                            <span className="text-zinc-500">not found</span>
                          ) : (
                            <span className="text-zinc-600">pending</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className={`font-mono transition-colors ${card3Step >= 1 ? 'text-zinc-300' : 'text-zinc-600'}`}>2. Dave L. (checking git blame)</span>
                        <span className="font-mono">
                          {card3Step === 1 ? (
                            <span className="text-zinc-400 animate-pulse">checking...</span>
                          ) : card3Step > 1 ? (
                            <span className="text-zinc-500">no local copy</span>
                          ) : (
                            <span className="text-zinc-600">pending</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className={`font-mono transition-colors ${card3Step >= 2 ? 'text-zinc-300 font-semibold' : 'text-zinc-600'}`}>3. Alex K. (checking local draft)</span>
                        <span className="font-mono">
                          {card3Step === 2 ? (
                            <span className="text-zinc-400 animate-pulse">checking...</span>
                          ) : card3Step === 3 ? (
                            <span className="text-emerald-400 font-bold">✓ Found file</span>
                          ) : (
                            <span className="text-zinc-600">pending</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Buried Failures (col-span-2) */}
                <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 shadow-sm">
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">04 / Incident alerts</span>
                    <h3 className="text-sm font-semibold text-zinc-50 font-sans">Silenced Error Regressions</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      LLM format breakages and parser crashes happen, but slip past because they are buried in cloud logs.
                    </p>
                  </div>

                  {/* server logs muted list */}
                  <div className="mt-5 border border-zinc-850 bg-zinc-950/90 rounded-lg p-3 space-y-2 font-mono text-[9px] flex-1 flex flex-col justify-center z-10 shadow-inner">
                    <div className="flex justify-between border-b border-zinc-900 pb-1 text-zinc-500 font-semibold font-mono">
                      <span>Server stdout stream</span>
                      <span className="text-zinc-600 font-mono">stdout.log</span>
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div className={`flex items-center justify-between transition-all font-mono ${
                        card4State === 2 ? 'line-through text-zinc-600 opacity-40' : 'text-red-400 font-semibold font-mono'
                      }`}>
                        <span className="font-mono">JSON parser crash (Invalid character)</span>
                        <span className="font-mono">{card4State === 2 ? '[Muted]' : '[ALERT]'}</span>
                      </div>
                      <div className={`flex items-center justify-between transition-all font-mono ${
                        card4State >= 1 ? 'line-through text-zinc-600 opacity-40' : 'text-red-400 font-semibold font-mono'
                      }`}>
                        <span className="font-mono">Empty prompt response (400 Bad Req)</span>
                        <span className="font-mono">{card4State >= 1 ? '[Muted]' : '[ALERT]'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 5: Visual Call to Action (col-span-2) */}
                <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between min-h-[300px] overflow-hidden relative group transition-all hover:border-zinc-700 hover:bg-zinc-900/80 dots-bg shadow-sm select-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent pointer-events-none" />
                  
                  <div className="space-y-2 z-10">
                    <div className="h-7 w-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow">
                      <Sparkles className="h-4 w-4 text-zinc-300" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-50 font-sans">Close the gaps. Before they break your AI.</h3>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed font-sans">
                      Professional workflows for prompt engineering. Save commits, run pipeline assertions, and fetch active templates.
                    </p>
                  </div>

                  <div className="pt-4 z-10">
                    <button
                      onClick={() => setActiveTab('sandbox')}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:shadow-zinc-50/10"
                    >
                      Open Simulator Sandbox <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Integration Guide Section */}
            <section className="max-w-6xl mx-auto px-6 border-t border-zinc-900 pt-20 pb-12 space-y-8">
              <div className="max-w-2xl space-y-3">
                <h3 className="text-2xl font-bold text-zinc-100">Integration: Fetching at Runtime</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
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
          /* Interactive Sandbox Layout (Restored & Cleaned) */
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

    </div>
  );
}
