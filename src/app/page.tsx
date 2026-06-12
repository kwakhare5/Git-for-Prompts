'use client';

import { useState } from 'react';
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
          <div className="max-w-6xl mx-auto px-6 py-16 w-full space-y-24">
            {/* Tour Tab Content Placeholder */}
            <div className="text-center text-zinc-500 font-mono text-sm">Product Tour View</div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
            {/* Sandbox Tab Content Placeholder */}
            <div className="text-center text-zinc-500 font-mono text-sm">Interactive Sandbox View</div>
          </div>
        )}
      </main>
    </div>
  );
}
