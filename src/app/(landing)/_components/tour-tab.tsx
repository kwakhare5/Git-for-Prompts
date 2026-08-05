'use client';

import { Hero } from './hero';
import { InteractiveDiffPlayground } from './interactive-diff-playground';
import { FixesSection } from './fixes-section';
import { Features } from './features';
import { TestSuiteInfo } from './test-suite-info';
import { SdkSection } from './sdk-section';
import { SecurityInfo } from './security-info';
import { Footer } from './footer';

interface TourTabProps {
  onOpenSandbox: () => void;
}

export function TourTab({ onOpenSandbox }: TourTabProps) {
  return (
    <div className="w-full space-y-0 py-4 bg-[#111111]">
      <Hero onTrySandbox={onOpenSandbox} />
      <InteractiveDiffPlayground />
      <FixesSection onOpenSandbox={onOpenSandbox} />
      <Features />
      <TestSuiteInfo />
      <SdkSection />
      <SecurityInfo />
      <Footer />
    </div>
  );
}
