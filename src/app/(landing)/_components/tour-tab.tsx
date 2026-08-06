import { Hero } from './hero';
import { UnifiedPlayground } from './unified-playground';
import { FixesSection } from './fixes-section';
import { DeveloperPlatform } from './developer-platform';
import { SecurityInfo } from './security-info';
import { FaqAccordion } from './faq-accordion';
import { Footer } from './footer';

interface TourTabProps {
  onOpenSandbox: () => void;
}

export function TourTab({ onOpenSandbox }: TourTabProps) {
  return (
    <div className="w-full space-y-12 md:space-y-16 py-4 font-sans select-none">
      {/* 1. Hero */}
      <Hero onTrySandbox={onOpenSandbox} />

      {/* 2. Master Unified Interactive Workbench (Diff, Sandbox, SDK/CLI) */}
      <UnifiedPlayground />

      {/* 3. Core Solutions & Fixes Matrix */}
      <FixesSection onOpenSandbox={onOpenSandbox} />

      {/* 4. Unified Evals & Developer Platform */}
      <DeveloperPlatform />

      {/* 5. Enterprise Security Standards */}
      <SecurityInfo />

      {/* 6. Developer FAQ Accordion */}
      <FaqAccordion />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
