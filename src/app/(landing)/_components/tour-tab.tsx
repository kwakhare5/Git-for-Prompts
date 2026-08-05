'use client';

import { Hero } from './hero';
import { Features } from './features';
import { QuickStart } from './quickstart';
import { InteractiveDiffPlayground } from './interactive-diff-playground';
import { ComparisonTable } from './comparison-table';
import { FixesSection } from './fixes-section';
import { SdkSection } from './sdk-section';
import { TestSuiteInfo } from './test-suite-info';
import { SecurityInfo } from './security-info';
import { Footer } from './footer';

interface TourTabProps {
  onOpenSandbox: () => void;
}

export function TourTab({ onOpenSandbox }: TourTabProps) {
  return (
    <div className="w-full space-y-0 py-4 bg-[#111111]">
      <Hero onTrySandbox={onOpenSandbox} />
      <Features />
      <QuickStart />
      <InteractiveDiffPlayground />
      <ComparisonTable />
      <FixesSection onOpenSandbox={onOpenSandbox} />
      <SdkSection />
      <TestSuiteInfo />
      <SecurityInfo />
      <Footer />
    </div>
  );
}
