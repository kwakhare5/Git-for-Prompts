import React from 'react';
import Link from 'next/link';
import { GithubIcon } from './ui-tokens';

export function DeveloperFooter() {
  return (
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
            <li><Link href="/developers" className="hover:text-zinc-200 transition-colors">Developer Portal &amp; API</Link></li>
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
          <Link href="/developers" className="hover:text-zinc-300 transition-colors">Developers</Link>
          <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          <a href="/llms.txt" className="hover:text-zinc-300 transition-colors">llms.txt</a>
        </div>
      </div>
    </footer>
  );
}
