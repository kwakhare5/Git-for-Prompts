'use client';

import { Key, Database, Lock } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 rounded-md">
          Platform Security & HMAC Webhooks
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans">
          Production-Grade Infrastructure
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-sans">
          Your prompts contain core business logic. We protect your prompt pipelines with strict server validation and cryptographic hashing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* Auth card */}
        <Card className="p-6 space-y-3 bg-card/70 border-white/10 backdrop-blur-md hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground font-sans">Clerk Authentication</CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans">
            Protected user account gates using Clerk, supporting developer primary logins via GitHub OAuth and email fallback routes.
          </CardDescription>
        </Card>

        {/* Database security card */}
        <Card className="p-6 space-y-3 bg-card/70 border-white/10 backdrop-blur-md hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
            <Database className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground font-sans">Row-Level Owner Security</CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans">
            All Drizzle database interactions are strictly scoped to verified owner IDs to ensure complete tenant isolation.
          </CardDescription>
        </Card>

        {/* API key card */}
        <Card className="p-6 space-y-3 bg-card/70 border-white/10 backdrop-blur-md hover:border-primary/40 transition-all shadow-xl font-sans">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Key className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground font-sans">Hashed API Keys</CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans">
            API keys use SHA-256 lookup hashes for fast O(1) runtime resolution without storing plaintext credentials.
          </CardDescription>
        </Card>
      </div>
    </section>
  );
}
