'use client';

import React, { useState } from 'react';
import { GithubIcon } from './ui-tokens';

export function FaqFooter() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Does Git for Prompts store my LLM API keys?',
      a: 'No. Local evals run directly in your terminal using your environment API keys. On the cloud SaaS, API keys are stored as non-reversible SHA-256 lookup hashes.'
    },
    {
      q: 'How does local-first SQLite versioning work?',
      a: 'packages/cli uses Wasm SQLite (sql.js) locally in your directory. Every prompt save creates an immutable version row without requiring a network connection.'
    },
    {
      q: 'What is a Prompt Bundle?',
      a: 'A prompt bundle is the atomic unit of versioning in GFP v2. It includes the system prompt, user template, model configurations (provider, model, temperature, topP), tools, and Zod response format schema.'
    },
    {
      q: 'How do concurrent pushes handle version collisions?',
      a: 'Cloud sync uses PostgreSQL transaction advisory locking (`pg_advisory_xact_lock`) via `insertNextVersion` to ensure concurrent pushes never overwrite or collision version numbers.'
    },
    {
      q: 'Can I migrate my existing raw prompt strings to GFP?',
      a: 'Yes! Running `gfp init` automatically detects existing prompt templates and wraps them into valid v2 Prompt Bundles.'
    }
  ];

  return (
    <>
      {/* FAQ Accordion */}
      <section id="docs" className="px-6 max-w-4xl mx-auto mb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-100 font-serif mb-2">Developer FAQ</h2>
          <p className="text-xs font-mono text-zinc-500">Everything you need to know about Git for Prompts.</p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto mb-24 font-sans">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              onClick={() => toggleFaq(idx)}
              className="bg-[#161619] rounded-xl border border-zinc-800/80 p-4 cursor-pointer hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-zinc-100">
                <span className="font-mono">{faq.q}</span>
                <span className="text-zinc-500 font-mono">{openFaq === idx ? '−' : '+'}</span>
              </div>
              {openFaq === idx && (
                <p className="mt-3 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3 font-sans">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Terminal CTA Banner */}
        <div className="bg-[#161619] text-white rounded-3xl p-10 text-center border border-zinc-800/80 shadow-2xl relative overflow-hidden font-mono">
          <div className="w-10 h-10 rounded-xl bg-[#1D1D22] border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Git for Prompts Logo" width={24} height={24} className="w-6 h-6 rounded-lg" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-zinc-100">
            Start versioning your prompts locally in seconds
          </h3>
          <p className="text-zinc-400 text-xs max-w-md mx-auto mb-8 font-sans">
            Run `$ npx gfp init` inside any repository. Immutable history, offline SQLite, zero setup.
          </p>
          <a 
            href="#cli"
            className="inline-block bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold font-mono px-6 py-3 rounded-xl active:scale-97 transition-all cursor-pointer"
          >
            Get Started Free →
          </a>
        </div>
      </section>

      {/* Full Dark Developer Footer */}
      <footer className="bg-[#121214] text-zinc-400 py-16 px-6 text-xs font-mono border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Git for Prompts Logo" width={24} height={24} className="w-6 h-6 rounded-lg shrink-0 shadow-md" />
              <span>Git for Prompts</span>
            </div>
            <p className="text-zinc-500 text-xs max-w-xs font-sans leading-relaxed">
              Open-source local-first prompt package manager. Immutable snapshots, Wasm SQLite engine, and zero-lockin cloud sync.
            </p>
            <div className="text-[10px] text-emerald-300 flex items-center gap-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> MIT Open Source License
            </div>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">CORE ARCHITECTURE</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li><a href="#" className="hover:text-zinc-200 transition-colors">packages/core</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">packages/cli</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Next.js Cloud App</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Bundle Zod Spec</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">DOCUMENTATION</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li><a href="#" className="hover:text-zinc-200 transition-colors">CLI Commands</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Wasm SQLite Engine</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Eval Runner</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Webhooks API</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">REPOS & COMMUNITY</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" />
                <a href="https://github.com/kwakhare5/Git-for-Prompts" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">GitHub Repository</a>
              </li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Contribute</a></li>
              <li><a href="#" className="hover:text-zinc-200 transition-colors">Security Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <div>© 2026 Git for Prompts • Built with Next.js 15, Drizzle ORM, & Wasm SQLite</div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span>SHA-256 Auth</span>
            <span>Advisory Locking</span>
          </div>
        </div>
      </footer>
    </>
  );
}
