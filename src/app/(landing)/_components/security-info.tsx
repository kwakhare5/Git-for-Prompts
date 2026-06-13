'use client';

import { Shield, Key, Database, Lock } from 'lucide-react';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 border-t border-zinc-900 pt-20 space-y-12 select-none font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 font-mono text-[9px] uppercase tracking-wider font-semibold">
          <Shield className="h-3 w-3 text-zinc-500" /> Platform Security & Architecture
        </div>
        <h3 className="text-3xl font-extrabold text-zinc-100 font-sans">
          Production-Ready Security Standards
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed font-light font-sans">
          Your prompts contain crucial business rules. We protect your prompt infrastructure with strict auth protocols and server validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Auth card */}
        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/20 space-y-3 text-left">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
            <Lock className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <h4 className="font-semibold text-sm text-zinc-200">Clerk Authentication</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </p>
        </div>

        {/* Database security card */}
        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/20 space-y-3 text-left">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
            <Database className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <h4 className="font-semibold text-sm text-zinc-200">Row-Level Owner Security</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            All Drizzle database interactions are strictly validated at the controller level to ensure no prompt data leakages occur between organizations.
          </p>
        </div>

        {/* API key card */}
        <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/20 space-y-3 text-left">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
            <Key className="h-4.5 w-4.5 text-zinc-300" />
          </div>
          <h4 className="font-semibold text-sm text-zinc-200">Hashed Key Storage</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            Developer API keys are generated as random tokens, verified via SHA-256 hashes, and never stored in plain-text format on the server.
          </p>
        </div>

      </div>
    </section>
  );
}
