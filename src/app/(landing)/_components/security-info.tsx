import { Shield, Key, Database, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 space-y-12 select-none font-sans">
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 font-mono text-xs uppercase tracking-wider font-semibold">
          <Shield className="h-3.5 w-3.5 text-zinc-400" /> Platform Security & Architecture
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#f5f0eb] font-sans tracking-tight">
          Production-Ready Security Standards
        </h3>
        <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-normal font-sans">
          Your prompts contain crucial business rules. We protect your prompt infrastructure with strict auth protocols and server validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* Auth card */}
        <Card className="p-6 space-y-3 text-left bg-[#161616] border-white/[0.08] rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Clerk Authentication</h4>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </p>
        </Card>

        {/* Database security card */}
        <Card className="p-6 space-y-3 text-left bg-[#161616] border-white/[0.08] rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Database className="h-5 w-5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Row-Level Owner Security</h4>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            All Drizzle database interactions are strictly validated at the controller level to ensure no prompt data leakages occur between organizations.
          </p>
        </Card>

        {/* API key card */}
        <Card className="p-6 space-y-3 text-left bg-[#161616] border-white/[0.08] rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Key className="h-5 w-5 text-[#f5f0eb]" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-[#f5f0eb] font-sans">Hashed API Keys</h4>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            API keys use SHA-256 lookup hashes for fast lookups without storing raw tokens, preventing secret leaks.
          </p>
        </Card>
      </div>
    </section>
  );
}
