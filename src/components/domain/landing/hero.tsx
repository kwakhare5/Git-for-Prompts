'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, Compass } from 'lucide-react';
import { Show } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { HeroAppDashboardReplica } from './hero-app-dashboard-replica';

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center text-center pt-10 pb-12 px-4 md:px-6 max-w-7xl mx-auto gap-6 font-sans"
    >
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Badge variant="outline" className="text-xs font-sans text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
          <GitBranch className="w-3.5 h-3.5" /> Local-First Prompt Package Manager & SaaS
        </Badge>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.15] text-balance z-10 font-sans"
      >
        {siteConfig.headline}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans z-10 text-balance"
      >
        Version, diff, and evaluate full prompt bundles (system prompt + user template + model config + tools) — offline via CLI & SQLite, synced to cloud SaaS.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 z-10 font-sans"
      >
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <>
            <Show when="signed-in">
              <Link href="/dashboard" passHref>
                <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans gap-2">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-up" passHref>
                <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Show>
          </>
        ) : (
          <Link href="/sign-up" passHref>
            <Button size="lg" variant="default" className="font-semibold cursor-pointer shadow-sm font-sans gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
        <Link href="/explore" passHref>
          <Button variant="outline" size="lg" className="cursor-pointer font-sans gap-2">
            <Compass className="w-4 h-4" /> Explore Public Prompts
          </Button>
        </Link>
      </motion.div>

      {/* Large Interactive Dashboard Screen Replica Centerpiece */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full mt-4 z-10"
      >
        <HeroAppDashboardReplica />
      </motion.div>
    </section>
  );
}
