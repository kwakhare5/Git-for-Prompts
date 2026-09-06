import React from 'react';
import { HeroSection } from '@/components/website/HeroSection';
import { DashboardHeroScreen } from '@/components/website/DashboardHeroScreen';
import { BentoFeatures } from '@/components/website/BentoFeatures';
import { PromptStudioShowcase } from '@/components/website/PromptStudioShowcase';
import { EngineShowcase } from '@/components/website/EngineShowcase';
import { FaqFooter } from '@/components/website/FaqFooter';
import { JsonLd } from '@/components/website/json-ld';


export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-page text-zinc-100 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-200">
      <JsonLd />
      <HeroSection />
      <DashboardHeroScreen />
      <BentoFeatures />
      <PromptStudioShowcase />
      <EngineShowcase />
      <FaqFooter />
    </div>
  );
}
