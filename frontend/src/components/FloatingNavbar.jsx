import React from 'react';
import { CloudRain, Sliders, LineChart, Cpu, BookOpen } from 'lucide-react';
import BrandLogo from './BrandLogo';
import HairlineLiquidTabs from './hairline/HairlineLiquidTabs';

export default function FloatingNavbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'forecast', label: 'Live Forecast', icon: CloudRain },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'analytics', label: 'Historical (16y)', icon: LineChart },
    { id: 'model', label: 'Model (83.2%)', icon: Cpu },
    { id: 'about', label: 'Syllabus & About', icon: BookOpen },
  ];

  return (
    <header className="floating-navbar-wrapper">
      <nav className="floating-navbar glass-card-nav">
        {/* Brand Identity */}
        <BrandLogo />

        {/* Hairline UI Liquid Tabs with Surface Tension */}
        <HairlineLiquidTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </nav>
    </header>
  );
}
