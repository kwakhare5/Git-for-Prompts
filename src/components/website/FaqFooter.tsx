'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GithubIcon } from './ui-tokens';

export function FaqFooter() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Does Git for Prompts store my LLM API keys?',
      a: 'No. Local evaluations run in your terminal using your local environment variables. On the cloud platform, API credentials are stored as non-reversible SHA-256 hashes.'
    },
    {
      q: 'How does local-first SQLite versioning work?',
      a: 'The CLI uses a lightweight SQLite database stored directly inside your project folder (.gitforprompts/). Every prompt change creates a local snapshot without touching the internet.'
    },
    {
      q: 'What is a Prompt Bundle?',
      a: 'A prompt bundle packages your prompt template with its model settings (provider, temperature, max tokens), tools, and structured output schema into a single versioned unit.'
    },
    {
      q: 'How do concurrent pushes handle version collisions?',
      a: 'Cloud sync uses transaction locks to guarantee version numbers never collide or overwrite existing history, even when multiple team members push at the same time.'
    },
    {
      q: 'Can I migrate my existing raw prompt strings to Git for Prompts?',
      a: 'Yes. Running `gitforprompts init` detects your existing prompt templates and wraps them into valid versioned prompt bundles.'
    }
  ];

  return (
    <>
      {/* FAQ Accordion */}
      <section id="docs" className="px-4 sm:px-6 max-w-4xl mx-auto mb-16 sm:mb-28">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2.5xl sm:text-3xl font-bold text-zinc-100 font-serif mb-2 [text-wrap:balance]">Developer FAQ</h2>
          <p className="text-[11px] sm:text-xs font-mono text-zinc-500">Everything you need to know about Git for Prompts.</p>
        </div>

        <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto mb-16 sm:mb-24 font-sans">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              onClick={() => toggleFaq(idx)}
              className="bg-bg-card rounded-xl border border-zinc-800/90 p-3.5 sm:p-4 tab-interactive hover:border-zinc-700 shadow-xl overflow-hidden cursor-pointer select-none"
            >
              <div className="flex items-center justify-between text-xs font-bold text-zinc-100 gap-3">
                <span className="font-mono leading-snug">{faq.q}</span>
                <span className={`text-zinc-500 font-mono transition-transform duration-200 shrink-0 text-sm ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`}>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </div>
              {openFaq === idx && (
                <p className="mt-3 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3 font-sans transition-opacity duration-200 opacity-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Terminal CTA Banner */}
        <div className="bg-bg-card text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center border border-zinc-800/90 shadow-2xl relative overflow-hidden font-mono">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/50 border border-zinc-800 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Git for Prompts Logo" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg" />
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-3 sm:mb-4 text-zinc-100 [text-wrap:balance]">
            Start versioning your prompts locally in seconds
          </h3>
          <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6 sm:mb-8 font-sans leading-relaxed">
            Run `$ npx gitforprompts init` inside any repository. Immutable history, offline SQLite, zero setup.
          </p>
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold font-mono px-6 py-3 rounded-xl btn-interactive"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Full Dark Developer Footer */}
      <footer className="bg-bg-page text-zinc-400 py-12 sm:py-16 px-4 sm:px-6 text-xs font-mono border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10 sm:mb-12">
          
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="Git for Prompts Logo" width={24} height={24} className="w-6 h-6 rounded-lg shrink-0 shadow-md" />
              <span>Git for Prompts</span>
            </div>
            <p className="text-zinc-500 text-xs max-w-xs font-sans leading-relaxed">
              Open-source prompt version control and test runner. Immutable snapshots, local SQLite storage, and team sync.
            </p>
            <div className="text-[10px] text-emerald-300 flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> MIT Open Source License
            </div>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">CORE ARCHITECTURE</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li><a href="https://github.com/kwakhare5/Git-for-Prompts/tree/main/packages/core" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">packages/core</a></li>
              <li><a href="https://github.com/kwakhare5/Git-for-Prompts/tree/main/packages/cli" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">packages/cli</a></li>
              <li><Link href="/dashboard" className="hover:text-zinc-200 transition-colors">Prompt Studio Dashboard</Link></li>
              <li><a href="https://github.com/kwakhare5/Git-for-Prompts/blob/main/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">Bundle Zod Spec</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">DOCUMENTATION</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li><Link href="/about" className="hover:text-zinc-200 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-200 transition-colors">Contact &amp; Support</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy Policy</Link></li>
              <li><a href="/llms.txt" className="hover:text-zinc-200 transition-colors">Agent Index (llms.txt)</a></li>
              <li><Link href="/dashboard/api-keys" className="hover:text-zinc-200 transition-colors">API Keys API</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[10px]">REPOS &amp; COMMUNITY</h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" />
                <a href="https://github.com/kwakhare5/Git-for-Prompts" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">GitHub Repository</a>
              </li>
              <li><a href="https://github.com/kwakhare5/Git-for-Prompts/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">Contribute</a></li>
              <li><a href="https://github.com/kwakhare5/Git-for-Prompts/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">Security &amp; License</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-zinc-800/80 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 text-center sm:text-left">
          <div>
            © 2026 Git for Prompts • Designed &amp; Built by{" "}
            <a
              href="https://github.com/kwakhare5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white font-semibold underline decoration-zinc-700 underline-offset-4 transition-colors"
            >
              Karan Wakhare
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <a href="/llms.txt" className="hover:text-zinc-300 transition-colors">llms.txt</a>
          </div>
        </div>
      </footer>
    </>
  );
}
