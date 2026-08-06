import { Shield, Key, Database, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 space-y-12 select-none font-sans">
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
          <Shield className="h-3 w-3 text-zinc-400" /> Platform Security & Architecture
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#f5f0eb] font-sans tracking-tight">
          Production-Ready Security Standards
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed font-sans">
          Your prompts contain crucial business rules. We protect your prompt infrastructure with strict auth protocols and server validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        {/* Auth card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Lock className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Clerk Authentication</h4>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </p>
        </Card>

        {/* Database security card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Database className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Row-Level Owner Security</h4>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            All Drizzle database interactions are strictly validated at the controller level to ensure no prompt data leakages occur between organizations.
          </p>
        </Card>

        {/* API key card */}
        <Card className="p-6 space-y-3 text-left">
          <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Key className="h-4.5 w-4.5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Hashed API Keys</h4>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            API keys use SHA-256 lookup hashes for fast lookups without storing raw tokens, preventing secret leaks.
          </p>
        </Card>
      </div>
    </section>
  );
}
