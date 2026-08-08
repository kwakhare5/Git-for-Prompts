import React from 'react';
import { getAuthUserId } from '@/lib/auth';
import { Navbar } from '@/components/website/Navbar';
import { HeroSection } from '@/components/website/HeroSection';
import { DashboardHeroScreen } from '@/components/website/DashboardHeroScreen';
import { BentoFeatures } from '@/components/website/BentoFeatures';
import { PromptStudioShowcase } from '@/components/website/PromptStudioShowcase';
import { EngineShowcase } from '@/components/website/EngineShowcase';
import { FaqFooter } from '@/components/website/FaqFooter';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-200">
      <HeroSection />
      <DashboardHeroScreen />
      <BentoFeatures />
      <PromptStudioShowcase />
      <EngineShowcase />
      <FaqFooter />
    </div>
  );
}
