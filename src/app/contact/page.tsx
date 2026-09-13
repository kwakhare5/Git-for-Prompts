import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeveloperFooter } from '@/components/website/DeveloperFooter';

export const metadata: Metadata = {
  title: 'Contact Git for Prompts',
  description: 'Get in touch with the Git for Prompts core maintainers, report bugs, ask security questions, or contribute.',
  alternates: {
    canonical: 'https://gitforprompts.vercel.app/contact',
  },
};

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-page text-zinc-100 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 font-sans w-full flex-1">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800/90 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-zinc-100 tracking-normal">
            Contact &amp; Support
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-sans">
            Git for Prompts is open source and built by Karan Wakhare. If you hit a bug, have a feature idea, or want to get in touch, here is where to find me.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* GitHub Issues */}
          <div className="p-6 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Public Discussions</div>
              <h2 className="text-lg font-bold text-zinc-100 font-mono">GitHub Issues &amp; Discussions</h2>
              <p className="text-zinc-400 font-sans leading-relaxed">
                For bug reports, CLI feedback, questions, and feature requests. Opening an issue on GitHub keeps discussions open and searchable for everyone.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://github.com/kwakhare5/Git-for-Prompts/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-colors btn-interactive"
              >
                Open GitHub Issues →
              </a>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="p-6 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Direct Message</div>
              <h2 className="text-lg font-bold text-zinc-100 font-mono">Karan Wakhare</h2>
              <p className="text-zinc-400 font-sans leading-relaxed">
                For direct questions, feedback, or quick chats, send an email or message me on X.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="mailto:kwakhare5@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-bg-panel hover:bg-zinc-800 text-zinc-200 font-bold transition-colors btn-interactive"
              >
                <span>kwakhare5@gmail.com</span>
              </a>
              <a
                href="https://x.com/kwakhare5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-bg-panel hover:bg-zinc-800 text-zinc-200 font-bold transition-colors btn-interactive"
              >
                <span>X: @kwakhare5 →</span>
              </a>
            </div>
          </div>
        </div>

        {/* Community & FAQ */}
        <section className="space-y-4 border-t border-zinc-800/90 pt-8">
          <h2 className="text-xl font-bold text-zinc-100 font-mono">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <Link
              href="/about"
              className="p-4 rounded-xl border border-zinc-800 bg-bg-page hover:bg-bg-panel text-zinc-300 transition-colors block"
            >
              <div className="font-bold text-zinc-100 mb-1">About Git for Prompts</div>
              <div className="text-[11px] text-zinc-500 font-sans">Learn our story and architectural principles.</div>
            </Link>
            <Link
              href="/privacy"
              className="p-4 rounded-xl border border-zinc-800 bg-bg-page hover:bg-bg-panel text-zinc-300 transition-colors block"
            >
              <div className="font-bold text-zinc-100 mb-1">Privacy &amp; Security</div>
              <div className="text-[11px] text-zinc-500 font-sans">Details on key custody and data isolation.</div>
            </Link>
            <Link
              href="/llms.txt"
              className="p-4 rounded-xl border border-zinc-800 bg-bg-page hover:bg-bg-panel text-zinc-300 transition-colors block"
            >
              <div className="font-bold text-zinc-100 mb-1">Agent Index (llms.txt)</div>
              <div className="text-[11px] text-zinc-500 font-sans">Machine-readable index for autonomous agents.</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
    <DeveloperFooter />
  </div>
  );
}
