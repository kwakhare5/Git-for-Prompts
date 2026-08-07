'use client';

import { Key, Database, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SecurityInfo() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-12 font-sans">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md inline-flex items-center gap-1.5 font-semibold"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Security & Infrastructure Guarantees
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
          Enterprise Security Architecture
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-sans text-balance">
          Your prompt templates are core intellectual property. We protect your prompt pipelines with cryptographic hashing, advisory transaction locks, and tenant isolation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* Card 1: Clerk Auth */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 w-fit">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground font-sans">
                Clerk Google Auth & Tenant Isolation
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans mt-1">
                Zero-trust session authorization. Every DB read/write explicitly verifies <code className="font-mono text-primary">ownerId = auth().userId()</code>.
              </CardDescription>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Authentication Gate</span>
              <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0">
                Clerk Active
              </Badge>
            </div>
            <div className="text-foreground text-[10px] truncate">
              user_2N... ➔ WHERE owner_id = &apos;user_2N...&apos;
            </div>
          </div>
        </Card>

        {/* Card 2: SHA-256 API Keys */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground font-sans">
                Cryptographic SHA-256 API Keys
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans mt-1">
                API keys use SHA-256 lookup hashes for fast O(1) runtime authorization. Plaintext keys are never stored.
              </CardDescription>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>API Key Hashing</span>
              <span className="text-emerald-400">O(1) Indexed</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="text-foreground">gfp_live_...</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 truncate font-mono">sha256(hash)</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Postgres Advisory Lock */}
        <Card className="bg-gradient-to-b from-card to-background border-white/10 p-6 space-y-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground font-sans">
                Postgres Advisory Lock Concurrency
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans mt-1">
                Version increments use <code className="font-mono text-sky-400">pg_advisory_xact_lock</code> transactions to prevent version number collision races.
              </CardDescription>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-border font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Concurrency Lock</span>
              <span className="text-sky-400 font-bold">Lock Acquired</span>
            </div>
            <div className="text-[10px] text-sky-400 truncate">
              pg_advisory_xact_lock(hashtext(prompt_id))
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

