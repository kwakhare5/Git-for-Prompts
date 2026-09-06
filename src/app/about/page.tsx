import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Git for Prompts',
  description: 'Learn about Git for Prompts, the open-source, local-first prompt package manager and version control system for AI engineering.',
  alternates: {
    canonical: 'https://gitforprompts.vercel.app/about',
  },
};

export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 font-sans">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800/90 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span>ABOUT GIT FOR PROMPTS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-100 tracking-tight">
            Version Control Built for AI Engineering
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-sans">
            Treating prompts like production code with immutable commit history, automated dual-model evaluations, and local-first developer tooling.
          </p>
        </div>

        {/* Mission & Background */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">Our Mission</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Prompts govern production application behavior, but engineering teams still manage them as raw strings scattered across codebases. When a prompt change breaks output schemas or causes regressions, there is rarely a commit log showing what changed, why, or how to roll back.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Git for Prompts brings the discipline of code versioning to prompts: immutable commits, visual diffs, automated regression tests, and zero-lockin local storage.
          </p>
        </section>

        {/* Core Architecture */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">Architecture &amp; Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
              <h3 className="font-bold text-zinc-200 text-sm">1. Local-First Engineering</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Developers should never be blocked by network connectivity or cloud outages. The CLI operates on a local SQLite database directly inside your project (.gitforprompts/). You can create prompts, commit snapshots, and run evaluations completely offline in your terminal.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
              <h3 className="font-bold text-zinc-200 text-sm">2. Transactional Concurrency</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                When syncing prompt versions across teams, cloud mutations use database transaction locks to guarantee version numbers never collide or overwrite existing history.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
              <h3 className="font-bold text-zinc-200 text-sm">3. Zero Key Custody</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Your LLM API keys belong to you. Local evaluations run using your workstation environment variables. Cloud API credentials are stored solely as non-reversible SHA-256 hashes for authenticated prompt delivery.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
              <h3 className="font-bold text-zinc-200 text-sm">4. Autonomous Agent Readiness</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Engineered for both human developers and autonomous coding agents. Features full support for the Model Context Protocol (MCP), structured schemas, standard llms.txt endpoints, and spec-compliant Markdown content negotiation.
              </p>
            </div>
          </div>
        </section>

        {/* Open Source & Links */}
        <section className="space-y-4 border-t border-zinc-800/90 pt-8">
          <h2 className="text-xl font-bold text-zinc-100 font-mono">100% Open Source</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Git for Prompts is fully open-source under the MIT license. We welcome contributions from developers, researchers, and AI engineers across the world.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
            <a
              href="https://github.com/kwakhare5/Git-for-Prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-colors"
            >
              View GitHub Repository →
            </a>
            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-bg-card hover:bg-bg-panel text-zinc-300 transition-colors"
            >
              Contact Team
            </Link>
            <Link
              href="/privacy"
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-bg-card hover:bg-bg-panel text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
