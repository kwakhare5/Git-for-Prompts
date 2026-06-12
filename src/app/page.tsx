


'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Show } from '@clerk/nextjs';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  Play, 
  Sparkles, 
  Check, 
  ArrowRight,
  Copy,
  Clock,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);
  const [wipePos, setWipePos] = useState<number>(50);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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

  // States for Feature Graphic 1 (Git Tree)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [commitTyped, setCommitTyped] = useState('');
  const commitMsg = '"feat: adjust refund criteria for v3"';
  useEffect(() => {
    if (activeFeature !== 0 || activeTab !== 'tour') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommitTyped('');
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setCommitTyped(commitMsg.slice(0, i));
      if (i >= commitMsg.length) clearInterval(typer);
    }, 55);
    return () => clearInterval(typer);
  }, [activeFeature, activeTab]);

  // States for Feature Graphic 3 (Pipeline)
  const [pipelineState, setPipelineState] = useState<number>(0);
  const [showPassedBadge, setShowPassedBadge] = useState(false);
  useEffect(() => {
    if (activeFeature !== 2 || activeTab !== 'tour') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPipelineState(0);
    setShowPassedBadge(false);
    const steps = [800, 1500, 2300, 3100, 4200];
    const timers = steps.map((delay, i) => setTimeout(() => {
      if (i < 4) setPipelineState(i + 1);
      if (i === 4) setShowPassedBadge(true);
    }, delay));
    const reset = setTimeout(() => {
      setPipelineState(0);
      setShowPassedBadge(false);
    }, 7200);
    return () => { timers.forEach(clearTimeout); clearTimeout(reset); };
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
        /* ── Graphic 1 (original) ───────────────────────── */
        @keyframes draw-line {
          from { stroke-dashoffset: 320; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes draw-branch {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 8px rgba(16,185,129,0.3); }
          50%       { opacity: 1;   box-shadow: 0 0 22px rgba(16,185,129,0.7); }
        }
        /* ── Graphic 1 NEW (pure SVG) ───────────────────── */
        @keyframes draw-trunk {
          from { stroke-dashoffset: 140; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes draw-branch-g1 {
          from { stroke-dashoffset: 230; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes svg-glow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(16,185,129,0.5)); }
          50%       { filter: drop-shadow(0 0 10px rgba(16,185,129,0.9)); }
        }
        .animate-draw-trunk {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: draw-trunk 1.2s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-draw-branch-g1 {
          stroke-dasharray: 230;
          stroke-dashoffset: 230;
          animation: draw-branch-g1 1.4s 0.9s cubic-bezier(.4,0,.2,1) forwards;
        }
        .svg-node-active {
          animation: svg-glow 2s ease-in-out infinite;
        }
        /* ── Graphic 2 (diff wipe CSS sweep) ────────────── */
        @keyframes wipe-scan {
          0%   { width: 30%; }
          100% { width: 70%; }
        }
        .animate-wipe-scan {
          animation: wipe-scan 3.5s ease-in-out infinite alternate;
        }
        /* ── Graphic 4 (packet bounce) ───────────────────── */
        @keyframes packet-req {
          0%   { left: 0%;               opacity: 1; }
          42%  { left: calc(100% - 36px); opacity: 1; }
          50%  { left: calc(100% - 36px); opacity: 0; }
          100% { left: calc(100% - 36px); opacity: 0; }
        }
        @keyframes packet-res {
          0%   { left: calc(100% - 36px); opacity: 0; }
          50%  { left: calc(100% - 36px); opacity: 0; }
          58%  { left: calc(100% - 36px); opacity: 1; }
          100% { left: 4px;               opacity: 1; }
        }
        .animate-packet-req {
          animation: packet-req 4.5s ease-in-out infinite;
        }
        .animate-packet-res {
          animation: packet-res 4.5s ease-in-out infinite;
        }
        /* ── Shared ──────────────────────────────────────── */
        @keyframes cdn-flow {
          0%   { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes badge-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes packet-glow {
          0%, 100% { box-shadow: 0 0 6px rgba(56,189,248,0.5); }
          50%       { box-shadow: 0 0 16px rgba(56,189,248,1); }
        }
        .animate-draw-line {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: draw-line 1.8s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-draw-branch {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw-branch 1.4s 0.6s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-cdn-flow {
          stroke-dasharray: 6 6;
          animation: cdn-flow 0.8s linear infinite;
        }
        .animate-badge-pop {
          animation: badge-pop 0.5s cubic-bezier(.4,0,.2,1) forwards;
        }
        .animate-packet-glow {
          animation: packet-glow 1.2s ease-in-out infinite;
        }
        .node-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .glow-green {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }
        .glow-green-strong {
          box-shadow: 0 0 28px rgba(16, 185, 129, 0.45);
        }
        .glow-sky {
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
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
      <header 
        className={cn(
          "sticky z-50 mx-auto flex items-center justify-between border border-zinc-900/60 bg-zinc-950/70 backdrop-blur-md rounded-lg shadow-2xl transition-all duration-300",
          isScrolled 
            ? "top-2 max-w-3xl w-[calc(100%-1rem)] px-4 py-1.5 mt-1 border-zinc-800 bg-zinc-950/90" 
            : "top-4 max-w-5xl w-[calc(100%-2rem)] px-5 py-2.5 mt-4"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <GitBranch className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <div className={`flex flex-col transition-all duration-300 ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
            <span className="font-bold text-sm tracking-tight leading-none">Git for Prompts</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-widest font-semibold">Prompt vcs</span>
          </div>
        </div>

        {/* Desktop Menu - Simple, Direct Necessary Links Only */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="#features" className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
            Features
          </Link>
          <Link href="#docs" className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
            Docs
          </Link>
          <button
            onClick={() => setActiveTab(activeTab === 'tour' ? 'sandbox' : 'tour')}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer bg-transparent border-none"
          >
            {activeTab === 'tour' ? 'Sandbox' : 'Tour'}
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
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 px-3 py-1.5 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                "inline-flex items-center justify-center font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)]",
                isScrolled ? "px-3.5 py-1 text-[11px]" : "px-4 py-1.5 text-xs"
              )}
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
                className="bg-zinc-950/95 border-l border-zinc-900 w-full max-w-xs gap-0 backdrop-blur-lg text-zinc-100"
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
                      <Link href="#features" className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors block py-2 px-3 hover:bg-zinc-900 rounded-md">
                        Features
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="#docs" className="text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors block py-2 px-3 hover:bg-zinc-900 rounded-md">
                        Documentation
                      </Link>
                    </SheetClose>
                    <button
                      onClick={() => {
                        setActiveTab(activeTab === 'tour' ? 'sandbox' : 'tour');
                      }}
                      className="w-full text-left py-2 px-3 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors bg-transparent border-none cursor-pointer"
                    >
                      {activeTab === 'tour' ? 'Try Sandbox' : 'View Tour'}
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-900 mt-4 flex flex-col gap-2">
                    <Link
                      href="/sign-in"
                      className="w-full text-left py-2 px-3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
                  
                  {/* Graphic 1: Branching Git Tree — Pure SVG, all labels in viewBox */}
                  {activeFeature === 0 && (
                    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Version History — Git Tree</span>
                        <span className="text-[10px] font-mono text-emerald-500/80">● Live branch: main</span>
                      </div>

                      <div className="flex-1 relative min-h-0">
                        <svg
                          viewBox="0 0 500 230"
                          preserveAspectRatio="xMidYMid meet"
                          className="absolute inset-0 w-full h-full"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Dashed trunk continuation */}
                          <line x1="60" y1="148" x2="460" y2="148" stroke="#27272a" strokeWidth="2" strokeDasharray="5 5" />
                          {/* Trunk v1→v2 — animated draw */}
                          <line x1="100" y1="148" x2="240" y2="148" stroke="#52525b" strokeWidth="2.5" className="animate-draw-trunk" />
                          {/* Branch arc v2→v3 — animated draw, delayed */}
                          <path d="M 240 148 C 295 148 305 75 355 75 L 405 75" stroke="#10b981" strokeWidth="2.5" fill="none" className="animate-draw-branch-g1" />

                          {/* v1 circle */}
                          <circle cx="100" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="2"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNode('v1')}
                            onMouseLeave={() => setHoveredNode(null)}
                          />
                          <text x="100" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v1</text>
                          <text x="100" y="178" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>Initial draft</text>

                          {/* v2 circle + fork dot */}
                          <circle cx="240" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="2"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNode('v2')}
                            onMouseLeave={() => setHoveredNode(null)}
                          />
                          <circle cx="240" cy="148" r="5" fill="#52525b" style={{ pointerEvents: 'none' }} />
                          <text x="240" y="148" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v2</text>
                          <text x="240" y="178" textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ pointerEvents: 'none', userSelect: 'none' }}>+ refund fix</text>

                          {/* v3 active — glowing */}
                          <circle cx="405" cy="75" r="24" fill="#052e16" stroke="#10b981" strokeWidth="2.5"
                            className="svg-node-active cursor-pointer"
                            onMouseEnter={() => setHoveredNode('v3')}
                            onMouseLeave={() => setHoveredNode(null)}
                          />
                          <text x="405" y="75" textAnchor="middle" dominantBaseline="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>v3</text>
                          <text x="405" y="44" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="600" style={{ pointerEvents: 'none', userSelect: 'none' }}>● Active</text>

                          {/* main trunk stub */}
                          <circle cx="455" cy="148" r="18" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
                          <text x="455" y="148" textAnchor="middle" dominantBaseline="middle" fill="#52525b" fontSize="9" fontFamily="monospace" style={{ userSelect: 'none' }}>main</text>
                        </svg>

                        {/* Hover metadata card — HTML corner popup */}
                        {hoveredNode && (
                          <div className="absolute top-2 right-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[9px] font-mono space-y-0.5 shadow-xl z-20 animate-in fade-in duration-150">
                            <div className="text-zinc-500 uppercase font-semibold tracking-wider">Commit — {hoveredNode}</div>
                            <div className="text-zinc-300">
                              {hoveredNode === 'v1' && 'Initial prompt draft'}
                              {hoveredNode === 'v2' && 'feat: add refund check'}
                              {hoveredNode === 'v3' && 'feat: adjust criteria (active)'}
                            </div>
                            <div className="text-zinc-600">
                              {hoveredNode === 'v1' && 'karan · 2h ago'}
                              {hoveredNode === 'v2' && 'karan · 45m ago'}
                              {hoveredNode === 'v3' && 'karan · 10m ago'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Typewriter commit log */}
                      <div className="border border-zinc-900 bg-zinc-950/70 rounded-lg p-3 font-mono text-[10px] text-zinc-400 space-y-1 shrink-0">
                        <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
                          <span>Latest Commit</span>
                          <span className="text-emerald-600">branch: main</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-200">
                          <span className="text-emerald-400 font-semibold">commit 4d9863f</span>
                          <span className="text-zinc-500">—</span>
                          <span className="text-zinc-300">{commitTyped}<span className="inline-block w-[5px] h-[11px] bg-zinc-400 ml-0.5 align-middle animate-pulse" /></span>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Graphic 2: Diff Wipe — CSS auto-scan, user can drag */}
                  {activeFeature === 1 && (
                    <div
                      ref={wipeContainerRef}
                      className="flex-1 flex flex-col p-5 justify-between h-full select-none animate-in fade-in duration-400"
                      onMouseMove={(e) => {
                        if (!isWiping || !wipeContainerRef.current) return;
                        const rect = wipeContainerRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
                        setWipePos(pct);
                      }}
                      onMouseUp={() => setIsWiping(false)}
                      onMouseLeave={() => setIsWiping(false)}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Side-by-Side Prompt Diff</span>
                        <span className="text-[9px] text-zinc-500 bg-zinc-900/70 border border-zinc-800 px-2 py-0.5 rounded font-mono">
                          ↔ Drag handle to compare
                        </span>
                      </div>

                      {/* Diff Container */}
                      <div className="flex-1 border border-zinc-900 rounded-lg overflow-hidden relative bg-zinc-950 cursor-ew-resize">

                        {/* Left panel — Original v1 */}
                        <div
                          className={`absolute inset-y-0 left-0 bg-red-950/10 overflow-hidden ${!isWiping ? 'animate-wipe-scan' : ''}`}
                          style={isWiping ? { width: `${wipePos}%`, animation: 'none' } : undefined}
                        >
                          <div className="p-3 min-w-[260px]">
                            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-red-950/40">
                              <span className="w-2 h-2 rounded-full bg-red-500/70 inline-block" />
                              <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 font-bold">v1  Original</span>
                            </div>
                            <div className="font-mono text-[10px] leading-[1.8] space-y-px">
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">01  System: You answer queries.</div>
                              <div className="flex gap-1 overflow-hidden">
                                <span className="text-red-600 w-4 shrink-0">−</span>
                                <span className="bg-red-950/50 border-l-2 border-red-500 pl-1.5 text-red-300/90 whitespace-nowrap overflow-hidden">You answer questions about customer returns.</span>
                              </div>
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">03  ...</div>
                              <div className="flex gap-1 overflow-hidden">
                                <span className="text-red-600 w-4 shrink-0">−</span>
                                <span className="bg-red-950/50 border-l-2 border-red-500 pl-1.5 text-red-300/90 whitespace-nowrap overflow-hidden">Thank you for your message.</span>
                              </div>
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">05  User: {'{customer_query}'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Right panel — Refined v2 */}
                        <div
                          className="absolute inset-y-0 right-0 bg-emerald-950/10 overflow-hidden border-l border-zinc-800"
                          style={isWiping ? { left: `${wipePos}%` } : undefined}
                        >
                          <div className="p-3 min-w-[260px]">
                            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-emerald-950/40">
                              <span className="w-2 h-2 rounded-full bg-emerald-500/70 inline-block" />
                              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">v2  Refined</span>
                            </div>
                            <div className="font-mono text-[10px] leading-[1.8] space-y-px">
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">01  System: You answer queries.</div>
                              <div className="flex gap-1 overflow-hidden">
                                <span className="text-emerald-500 w-4 shrink-0">+</span>
                                <span className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5 text-emerald-300/90 whitespace-nowrap overflow-hidden">You are a polite returns agent. Offer a full refund if broken.</span>
                              </div>
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">03  ...</div>
                              <div className="flex gap-1 overflow-hidden">
                                <span className="text-emerald-500 w-4 shrink-0">+</span>
                                <span className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5 text-emerald-300/90 whitespace-nowrap overflow-hidden">Sign off: &quot;Customer Support Team&quot;.</span>
                              </div>
                              <div className="text-zinc-600 whitespace-nowrap overflow-hidden">05  User: {'{customer_query}'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Divider handle */}
                        <div
                          className={`absolute inset-y-0 z-10 flex items-center justify-center pointer-events-none ${!isWiping ? 'animate-wipe-scan' : ''}`}
                          style={isWiping ? { left: `calc(${wipePos}% - 12px)`, width: '24px', animation: 'none' } : { width: '24px', marginLeft: '-12px' }}
                        >
                          <div className="h-full w-[2px] bg-zinc-600" />
                          <div
                            className="absolute w-7 h-10 rounded-xl bg-zinc-900 border border-zinc-600 shadow-xl flex items-center justify-center cursor-ew-resize pointer-events-auto"
                            onMouseDown={(e) => { e.preventDefault(); setIsWiping(true); }}
                          >
                            <span className="text-[11px] text-zinc-400 leading-none select-none">⟷</span>
                          </div>
                        </div>
                      </div>

                      {/* Diff stats footer */}
                      <div className="flex items-center gap-3 pt-2.5 font-mono text-[9px] text-zinc-600">
                        <span className="text-red-400">−2 removed</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-emerald-400">+2 added</span>
                        <span className="text-zinc-700">·</span>
                        <span>v1 → v2 · 3 lines changed</span>
                      </div>
                    </div>
                  )}






                  {/* Graphic 3: Pipeline — flex row with inline connection bars */}
                  {activeFeature === 2 && (
                    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Automated Scoring Pipeline</span>
                        <span className={`text-[9px] font-mono transition-colors ${showPassedBadge ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {showPassedBadge ? '● All assertions passed' : '● Simulation running…'}
                        </span>
                      </div>

                      {/* Node row — flex so bars naturally span between nodes */}
                      <div className="flex items-center py-5 px-1">

                        {/* Node 1 — Input */}
                        <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-300 ${
                          pipelineState >= 1 ? 'bg-zinc-900/80 border-zinc-700' : 'bg-zinc-950 border-zinc-900'
                        }`}>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">1. Input</span>
                          <span className="text-[9px] text-zinc-300 font-mono block mt-1 truncate font-semibold">returns_v2</span>
                          {pipelineState >= 1 && (
                            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
                          )}
                        </div>

                        {/* Bar 1: Node1 → Node2 */}
                        <div className="flex-1 mx-2 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: pipelineState >= 2 ? '100%' : '0%' }}
                          />
                        </div>

                        {/* Node 2 — LLM */}
                        <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-500 ${
                          pipelineState >= 2
                            ? 'bg-zinc-900 border-emerald-800 glow-green'
                            : pipelineState === 1
                            ? 'bg-zinc-900/50 border-zinc-700 animate-pulse'
                            : 'bg-zinc-950 border-zinc-900'
                        }`}>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">2. Groq LLM</span>
                          <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
                            pipelineState >= 2 ? 'text-emerald-400' : pipelineState === 1 ? 'text-zinc-400' : 'text-zinc-600'
                          }`}>
                            {pipelineState >= 2 ? 'Responded ✓' : pipelineState === 1 ? 'Calling…' : 'Idle'}
                          </span>
                          {pipelineState >= 2 && (
                            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
                          )}
                        </div>

                        {/* Bar 2: Node2 → Node3 */}
                        <div className="flex-1 mx-2 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: pipelineState >= 3 ? '100%' : '0%' }}
                          />
                        </div>

                        {/* Node 3 — Grader */}
                        <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-500 ${
                          showPassedBadge
                            ? 'bg-emerald-950/30 border-emerald-700 glow-green-strong'
                            : pipelineState >= 3
                            ? 'bg-zinc-900/80 border-zinc-700'
                            : 'bg-zinc-950 border-zinc-900'
                        }`}>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">3. Grader</span>
                          <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
                            showPassedBadge ? 'text-emerald-300' : pipelineState >= 3 ? 'text-zinc-400' : 'text-zinc-600'
                          }`}>
                            {showPassedBadge ? 'Scored ✓' : pipelineState >= 3 ? 'Grading…' : 'Idle'}
                          </span>
                          {showPassedBadge && (
                            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
                          )}
                        </div>
                      </div>

                      {/* Log window */}
                      <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-3.5 font-mono text-[10px] text-zinc-400 space-y-1.5 min-h-[110px] flex flex-col justify-center relative overflow-hidden">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <span className="text-zinc-700">⏱ [0.0s]</span>
                          <span>Dispatching test: &quot;customer_returns_query&quot;</span>
                        </div>
                        {pipelineState >= 1 && (
                          <div className="flex items-center gap-2 text-zinc-400 animate-in slide-in-from-bottom-1 duration-200">
                            <span className="text-zinc-600">🤖 [0.4s]</span>
                            <span>Calling llama-3.3-70b-versatile via Groq…</span>
                          </div>
                        )}
                        {pipelineState >= 2 && (
                          <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-1 duration-200">
                            <span>✔ Assert &quot;Offer refund if broken&quot;</span>
                            <span className="text-emerald-500">PASS 100/100</span>
                          </div>
                        )}
                        {pipelineState >= 3 && (
                          <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-1 duration-200">
                            <span>✔ Assert &quot;Sign off with support team&quot;</span>
                            <span className="text-emerald-500">PASS 100/100</span>
                          </div>
                        )}
                        {showPassedBadge && (
                          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
                            <div className="animate-badge-pop flex flex-col items-center gap-1">
                              <div className="px-5 py-2 rounded-xl bg-emerald-950 border-2 border-emerald-500 glow-green-strong">
                                <span className="font-mono font-bold text-emerald-300 text-sm tracking-widest">● ALL PASSED</span>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-600">2/2 assertions · 100/100</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}


                  {/* Graphic 4: Runtime API Delivery — pure CSS packet animation */}
                  {activeFeature === 3 && (
                    <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Runtime API Delivery</span>
                        <span className="text-[9px] font-mono text-zinc-500">● Live endpoint</span>
                      </div>

                      {/* Packet flow diagram */}
                      <div className="flex items-center gap-3 px-2 py-5">

                        {/* Client node */}
                        <div className="shrink-0 p-3 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col items-center w-28">
                          <div className="w-5 h-5 mb-1.5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-[8px] font-mono text-zinc-400">&#123;&#125;</span>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Your App</span>
                          <span className="text-[9px] text-zinc-300 font-mono mt-0.5 font-bold">Backend</span>
                        </div>

                        {/* Connection track */}
                        <div className="flex-1 relative h-10 flex items-center">
                          {/* Dashed track */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#27272a" strokeWidth="1.5" strokeDasharray="5 5" className="animate-cdn-flow" />
                          </svg>

                          {/* Request packet — pure CSS left→right */}
                          <div className="animate-packet-req absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" style={{ boxShadow: '0 0 6px rgba(56,189,248,0.8)' }} />
                            <span className="text-[8px] font-mono text-sky-400 whitespace-nowrap">GET</span>
                          </div>

                          {/* Response packet — pure CSS right→left */}
                          <div className="animate-packet-res absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-[8px] font-mono text-emerald-400 whitespace-nowrap">200</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
                          </div>

                          {/* Track label */}
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-700 whitespace-nowrap">
                            api.gitforprompts.com
                          </div>
                        </div>

                        {/* GFP node */}
                        <div className="shrink-0 p-3 border border-emerald-900/60 rounded-xl bg-zinc-950 flex flex-col items-center w-28">
                          <div className="w-5 h-5 mb-1.5 rounded bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-center">
                            <span className="text-[8px] font-mono text-emerald-400">GFP</span>
                          </div>
                          <span className="text-[8px] font-mono text-emerald-500 uppercase font-semibold">Edge CDN</span>
                          <span className="text-[9px] text-emerald-300 font-mono mt-0.5 font-bold">returns_v2</span>
                        </div>
                      </div>

                      {/* Response JSON panel */}
                      <div className="border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden font-mono text-[10px]">
                        <div className="px-3 py-1.5 border-b border-zinc-900 bg-zinc-900/40 flex justify-between items-center">
                          <span className="text-zinc-500 text-[9px]">GET /api/v1/prompts/<span className="text-sky-500">p_returns</span>/latest</span>
                          <span className="text-[9px] font-semibold text-emerald-400">200 OK · 14ms</span>
                        </div>
                        <pre className="p-3 overflow-x-auto select-none leading-[1.7]">
                          <span className="text-zinc-600">{'{'}</span>{`
  `}<span className="text-sky-400">&quot;id&quot;</span><span className="text-zinc-500">:</span> <span className="text-amber-300">&quot;p_customer_returns&quot;</span><span className="text-zinc-600">,</span>{`
  `}<span className="text-sky-400">&quot;version&quot;</span><span className="text-zinc-500">:</span> <span className="text-violet-400">2</span><span className="text-zinc-600">,</span>{`
  `}<span className="text-sky-400">&quot;content&quot;</span><span className="text-zinc-500">:</span> <span className="text-emerald-300">&quot;You are a polite returns agent…&quot;</span>{`
`}<span className="text-zinc-600">{'}'}</span>
                        </pre>
                      </div>
                    </div>
                  )}



                </div>
              </div>
            </section>



            {/* Inspiration from OneClarity: "What we help teams fix" Section */}
            <section id="features" className="border-t border-zinc-900 pt-20 px-6 max-w-6xl mx-auto space-y-12 select-none">
              
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
            <section id="docs" className="max-w-6xl mx-auto px-6 border-t border-zinc-900 pt-20 pb-12 space-y-8">
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
