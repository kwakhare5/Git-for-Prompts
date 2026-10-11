'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Database, ShieldCheck, Bot, ArrowRight } from 'lucide-react';
import { GithubIcon } from './ui-tokens';

export function AboutSection() {
  const principles = [
    {
      number: '01',
      title: 'Local-first workflow',
      desc: 'You never need an internet connection. The CLI saves prompts in a local SQLite database inside your project (.gitforprompts/). Create prompts, save versions, and run tests completely offline.',
      icon: Database,
      accent: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      number: '02',
      title: 'Safe version history',
      desc: 'When syncing prompt versions across a team, database locks ensure version numbers never collide or overwrite someone else work.',
      icon: Terminal,
      accent: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    },
    {
      number: '03',
      title: 'Your keys stay private',
      desc: 'We never store your AI API keys. Tests run using your own local environment variables, so your secrets never leave your machine.',
      icon: ShieldCheck,
      accent: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    },
    {
      number: '04',
      title: 'Built for developers and AI agents',
      desc: 'Built for both human developers and AI coding assistants. Supports clean schemas, standard API endpoints, and direct CLI commands.',
      icon: Bot,
      accent: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <section id="about" className="px-4 sm:px-6 max-w-6xl mx-auto mb-16 sm:mb-28 font-sans">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase inline-block mb-3 sm:mb-4">
          About Git for Prompts
        </span>
        <h2 className="text-2.5xl sm:text-4xl md:text-5xl font-semibold tracking-normal text-zinc-100 font-serif mb-3 sm:mb-4 [text-wrap:balance]">
          Version control built for AI engineering
        </h2>
        <p className="text-zinc-400 text-xs sm:text-base leading-relaxed font-sans">
          Prompts control how AI apps behave, but most teams still keep them scattered across code files. Git for Prompts brings git-like version control to your prompts: clean version history, side-by-side diffs, automated testing, and local storage.
        </p>
      </div>

      {/* 4 Architecture Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="bg-bg-card p-5 sm:p-7 rounded-2xl border border-zinc-800/90 shadow-xl card-interactive hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center ${item.accent}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500">{item.number}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-2 font-mono">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open Source & Deep Documentation Banner */}
      <div className="bg-bg-card border border-zinc-800/90 rounded-2xl p-5 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-300 uppercase">
              100% open source &bull; MIT license
            </span>
          </div>
          <p className="text-zinc-300 text-xs sm:text-sm font-sans">
            Built in public. We welcome contributions from developers, researchers, and AI engineers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0 w-full sm:w-auto">
          <a
            href="https://github.com/kwakhare5/Git-for-Prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-colors btn-interactive"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <Link
            href="/about"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-bg-panel hover:bg-zinc-800 text-zinc-300 transition-colors btn-interactive"
          >
            <span>Full Story</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
