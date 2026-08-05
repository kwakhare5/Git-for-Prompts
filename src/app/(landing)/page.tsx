'use client';

import { useState } from 'react';
import { Navbar } from './_components/navbar';
import { TourTab } from './_components/tour-tab';
import { SandboxWorkspace } from './_components/sandbox-workspace';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');

  const changeTab = (tab: 'tour' | 'sandbox') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    if (sectionId === 'features' || sectionId === 'docs' || sectionId === 'home') {
      e.preventDefault();
      if (activeTab !== 'tour') {
        setActiveTab('tour');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div id="home" className="flex flex-col min-h-screen bg-[#111111] text-[#f5f0eb] font-sans selection:bg-zinc-800 relative overflow-x-hidden">
      {/* Floating Island Header */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={changeTab}
        onNavClick={handleNavClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-24">
        {activeTab === 'tour' ? (
          <TourTab onOpenSandbox={() => changeTab('sandbox')} />
        ) : (
          <SandboxWorkspace />
        )}
      </main>
    </div>
  );
}
