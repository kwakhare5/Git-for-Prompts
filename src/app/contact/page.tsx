import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 font-sans">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800/90 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-100 tracking-tight">
            Contact &amp; Support
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-sans">
            Have questions about Git for Prompts, need help integrating our CLI into your CI pipeline, or want to report a security issue? We are here to help.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* GitHub Issues */}
          <div className="p-6 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Primary Channel</div>
            <h2 className="text-lg font-bold text-zinc-100 font-mono">GitHub Discussions &amp; Issues</h2>
            <p className="text-zinc-400 font-sans leading-relaxed">
              For bug reports, feature requests, CLI feedback, and roadmap discussions, GitHub Issues is our primary public workspace. We review every issue within 24–48 hours.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/kwakhare5/Git-for-Prompts/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-colors"
              >
                Open GitHub Issues →
              </a>
            </div>
          </div>

          {/* Email Support */}
          <div className="p-6 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Direct Email</div>
            <h2 className="text-lg font-bold text-zinc-100 font-mono">Core Maintainer Team</h2>
            <p className="text-zinc-400 font-sans leading-relaxed">
              For enterprise inquiries, private security vulnerability reports, or partnership opportunities, reach out directly to the core maintainer team.
            </p>
            <div className="pt-2 space-y-1">
              <div className="text-zinc-300 font-bold">support@gitforprompts.org</div>
              <div className="text-[11px] text-zinc-500 font-sans">General &amp; Security Support</div>
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
            <a
              href="https://gitforprompts.vercel.app/llms.txt"
              className="p-4 rounded-xl border border-zinc-800 bg-bg-page hover:bg-bg-panel text-zinc-300 transition-colors block"
            >
              <div className="font-bold text-zinc-100 mb-1">Agent Index (llms.txt)</div>
              <div className="text-[11px] text-zinc-500 font-sans">Machine-readable index for autonomous agents.</div>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
