'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GithubIcon } from './ui-tokens';
import { DeveloperFooter } from './DeveloperFooter';

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
      <section id="faq" className="px-4 sm:px-6 max-w-4xl mx-auto mb-16 sm:mb-28">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2.5xl sm:text-3xl font-semibold tracking-normal text-zinc-100 font-serif mb-2 [text-wrap:balance]">Developer FAQ</h2>
          <p className="text-[11px] sm:text-xs font-mono text-zinc-500">Everything you need to know about Git for Prompts.</p>
        </div>

        <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto mb-16 sm:mb-24 font-sans">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              role="button"
              tabIndex={0}
              aria-expanded={openFaq === idx}
              onClick={() => toggleFaq(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFaq(idx);
                }
              }}
              className="bg-bg-card rounded-xl border border-zinc-800/90 p-3.5 sm:p-4 tab-interactive hover:border-zinc-700 shadow-xl overflow-hidden cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
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
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold tracking-normal mb-3 sm:mb-4 text-zinc-100 [text-wrap:balance]">
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
      <DeveloperFooter />
    </>
  );
}
