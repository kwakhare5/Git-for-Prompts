'use client';

import { Navbar } from '@/components/domain/landing/navbar';
import { Hero } from '@/components/domain/landing/hero';
import { FixesSection } from '@/components/domain/landing/fixes-section';
import { VersionFeatures } from '@/components/domain/landing/version-features';
import { VariableFeatures } from '@/components/domain/landing/variable-features';
import { TestSuiteInfo } from '@/components/domain/landing/test-suite-info';
import { SdkSection } from '@/components/domain/landing/sdk-section';
import { SecurityInfo } from '@/components/domain/landing/security-info';
import { FaqAccordion } from '@/components/domain/landing/faq-accordion';
import { Footer } from '@/components/domain/landing/footer';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="flex flex-col min-h-screen bg-background bg-grid-pattern text-foreground font-sans selection:bg-accent selection:text-accent-foreground relative overflow-x-hidden">
      {/* Header Navigation */}
      <Navbar onNavClick={handleNavClick} />

      {/* Main Content Flow */}
      <main className="flex-1 flex flex-col pt-20 font-sans space-y-12">
        {/* 1. Hero Section with Interactive Dashboard Replica Screen */}
        <Hero />

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 2. Tailark Expandable Features 1 — Core Solutions */}
        <div id="features">
          <FixesSection />
        </div>

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 3. Tailark Expandable Features 3 — Version Control & Diffs */}
        <VersionFeatures />

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 4. Tailark Expandable Features 6 — Variable Engine & Schemas */}
        <VariableFeatures />

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 5. Tailark Features 4 — QA & Automated Evals */}
        <div id="qa">
          <TestSuiteInfo />
        </div>

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 6. Tailark Code Demo 2 — CLI & SDK Platform */}
        <div id="developers">
          <SdkSection />
        </div>

        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 7. Tailark Features 7 — Enterprise Security */}
        <SecurityInfo />


        <Separator className="max-w-6xl mx-auto opacity-40" />

        {/* 7. Frequently Asked Questions */}
        <div id="faq">
          <FaqAccordion />
        </div>

        {/* 8. Tailark Footer 2 */}
        <Footer />
      </main>
    </div>
  );
}


