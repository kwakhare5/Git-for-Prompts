import { Shield, Key, Database, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-10 select-none font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground font-sans text-xs uppercase tracking-wider font-semibold">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" /> Platform Security & Architecture
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground font-sans tracking-tight">
          Production-Ready Security Standards
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal font-sans">
          Your prompts contain crucial business rules. We protect your prompt infrastructure with strict auth protocols and server validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* Auth card */}
        <Card className="p-6 space-y-3 text-left bg-card border-border rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-foreground font-sans">Clerk Authentication</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </p>
        </Card>

        {/* Database security card */}
        <Card className="p-6 space-y-3 text-left bg-card border-border rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
            <Database className="h-5 w-5 text-foreground" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-foreground font-sans">Row-Level Owner Security</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            All Drizzle database interactions are strictly validated at the controller level to ensure no prompt data leakages occur between organizations.
          </p>
        </Card>

        {/* API key card */}
        <Card className="p-6 space-y-3 text-left bg-card border-border rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
            <Key className="h-5 w-5 text-foreground" />
          </div>
          <h4 className="font-bold text-base md:text-lg text-foreground font-sans">Hashed API Keys</h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            API keys use SHA-256 lookup hashes for fast lookups without storing raw tokens, preventing secret leaks.
          </p>
        </Card>
      </div>
    </section>
  );
}
