import { Shield, Key, Database, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 border-t border-white/[0.08] pt-24 pb-12 space-y-12 select-none font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
          <Shield className="h-3 w-3 text-zinc-400" /> Platform Security & Architecture
        </div>
        <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight">
          Production-Ready Security Standards
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed font-light font-sans">
          Your prompts contain crucial business rules. We protect your prompt infrastructure with strict auth protocols and server validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        {/* Auth card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Lock className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-semibold text-sm text-white">Clerk Authentication</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </p>
        </Card>

        {/* Database security card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Database className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-semibold text-sm text-white">Row-Level Owner Security</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            All Drizzle database interactions are strictly validated at the controller level to ensure no prompt data leakages occur between organizations.
          </p>
        </Card>

        {/* API key card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Key className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-semibold text-sm text-white">Hashed Key Storage</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Developer API keys are generated as random tokens, verified via SHA-256 hashes, and never stored in plain-text format on the server.
          </p>
        </Card>
      </div>
    </section>
  );
}
