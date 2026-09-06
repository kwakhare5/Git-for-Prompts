import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Git for Prompts privacy policy and security commitment. Zero API key storage, local-first data custody, and cryptographic hashing.',
  alternates: {
    canonical: 'https://gitforprompts.vercel.app/privacy',
  },
};

export const dynamic = 'force-static';

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 font-sans">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800/90 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span>PRIVACY &amp; SECURITY POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-100 tracking-tight">
            Security by Architecture, Not Just Policy
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-sans">
            Git for Prompts is designed so we never hold the keys to your artificial intelligence infrastructure. Last updated: September 2026.
          </p>
        </div>

        {/* Section 1: Zero Key Storage */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">1. Zero API Key Custody Commitment</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            When you run prompt evaluation suites using our CLI (`gitforprompts run test-suite`), the evaluations execute 100% locally within your workstation process. The CLI communicates directly with LLM inference providers (such as Groq, Anthropic, OpenAI, or OpenRouter) using the API keys configured in your local environment variables.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Your third-party LLM API keys are never transmitted to, processed by, or logged on Git for Prompts servers. They remain strictly in your local shell session memory.
          </p>
        </section>

        {/* Section 2: Local SQLite Data Custody */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">2. Local-First SQLite Repositories</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            By default, Git for Prompts creates a local `.gitforprompts/` directory containing an embedded SQLite database. All version snapshots, commit logs, test assertions, and prompt templates are written directly to your local file system.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            You maintain full sovereignty over your local prompt repositories. You can operate completely offline, keep repositories air-gapped, or commit the `.gitforprompts/` bundle into your internal version control systems without interacting with our cloud infrastructure.
          </p>
        </section>

        {/* Section 3: Cloud Synchronization & Cryptographic Hashing */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">3. Cloud Sync &amp; API Key Storage</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            If you optionally choose to synchronize your prompt bundles to the Git for Prompts cloud platform (`gitforprompts push`), your prompt templates, version descriptions, and test definitions are stored in an encrypted PostgreSQL database protected by Clerk user authentication and row-level access controls.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            When you generate a Git for Prompts API key to deliver prompts to production backend systems:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400 pl-2 font-mono">
            <li>The raw plaintext API key is shown to you exactly once upon generation.</li>
            <li>The database stores only a non-reversible cryptographic hash generated with SHA-256 (`crypto.createHash(&apos;sha256&apos;)`).</li>
            <li>Neither our engineers nor any automated process can reverse or recover your raw API key.</li>
          </ul>
        </section>

        {/* Section 4: Analytics & Cookies */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">4. Analytics &amp; Cookies</h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            We use Vercel Analytics and Speed Insights to track aggregate Core Web Vitals (FCP, LCP, CLS) and improve website performance. These analytics do not use tracking cookies, do not track you across other domains, and are strictly privacy-preserving. Authentication session cookies are managed securely via Clerk with HTTP-only and SameSite flags.
          </p>
        </section>

        {/* Section 5: Data Rights & Contact */}
        <section className="space-y-4 border-t border-zinc-800/90 pt-8">
          <h2 className="text-xl font-bold text-zinc-100 font-mono">5. Data Deletion &amp; Inquiries</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            You may permanently delete your prompt repositories or account at any time through the dashboard. Upon deletion, all associated versions, test runs, and hashed API credentials are permanently purged from the database.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="text-xs font-mono font-bold text-zinc-300 hover:text-white underline underline-offset-4"
            >
              Have questions? Contact our privacy team →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
