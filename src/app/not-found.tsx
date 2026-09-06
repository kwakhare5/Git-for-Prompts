import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function RootNotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-16 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-bg-card border border-zinc-800/90 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
          <span>HTTP 404 · NOT FOUND</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            The requested path does not exist on this server.
          </p>
        </div>

        {/* Machine-Readable Recovery Section for AI Agents */}
        <div className="p-4 rounded-xl bg-bg-page border border-zinc-800 text-left font-mono text-xs space-y-2">
          <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Agent Recovery Links
          </div>
          <ul className="space-y-1.5 text-blue-400">
            <li>
              <a href="/llms.txt" className="hover:underline">
                → /llms.txt (Agent Instructions &amp; Docs)
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:underline">
                → /sitemap.xml (Public Routes)
              </a>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                → / (Homepage &amp; Prompt Studio)
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline">
                → /dashboard (Prompt Repositories)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-bold transition-colors shadow-xs"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
