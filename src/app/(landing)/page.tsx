'use client';

import { Navbar } from '@/components/domain/landing/navbar';
import { Hero } from '@/components/domain/landing/hero';
import { FixesSection } from '@/components/domain/landing/fixes-section';
import { DeveloperPlatform } from '@/components/domain/landing/developer-platform';
import { SecurityInfo } from '@/components/domain/landing/security-info';
import { FaqAccordion } from '@/components/domain/landing/faq-accordion';
import { Footer } from '@/components/domain/landing/footer';

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
      <main className="flex-1 flex flex-col pt-20 font-sans space-y-16">
        {/* 1. Hero Section with Interactive Dashboard Replica Screen */}
        <Hero />

        {/* 2. Key Solutions & Architectural Pillars */}
        <div id="features">
          <FixesSection />
        </div>

        {/* 3. Developer CLI & Platform */}
        <div id="developers">
          <DeveloperPlatform />
        </div>

        {/* 4. Enterprise Security */}
        <SecurityInfo />

        {/* 5. Frequently Asked Questions */}
        <div id="faq">
          <FaqAccordion />
        </div>

        {/* 6. Footer */}
        <Footer />
      </main>
    </div>
  );
}
