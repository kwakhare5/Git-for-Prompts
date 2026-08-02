'use client';

import { Hero } from './hero';
import { InteractiveDiffPlayground } from './interactive-diff-playground';
import { FixesSection } from './fixes-section';
import { DeveloperPlatform } from './developer-platform';
import { SecurityInfo } from './security-info';
import { Footer } from './footer';

interface TourTabProps {
  onOpenSandbox: () => void;
}

export function TourTab({ onOpenSandbox }: TourTabProps) {
  return (
    <div className="w-full space-y-0 py-4 bg-[#111111]">
      {/* 1. Hero & Instant Monaco Diff Proof */}
      <Hero onTrySandbox={onOpenSandbox} />
      <InteractiveDiffPlayground />

      {/* 2. What We Help Teams Fix (4 Core Solutions) */}
      <FixesSection onOpenSandbox={onOpenSandbox} />

      {/* 3. Unified Evals & Developer SDK Integration */}
      <DeveloperPlatform />

      {/* 4. Enterprise Trust & Security */}
      <SecurityInfo />

      {/* Footer */}
      <Footer />
    </div>
  );
}
