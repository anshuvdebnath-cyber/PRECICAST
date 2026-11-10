import React from 'react';
import { CloudRain, Sliders, LineChart, Cpu, BookOpen } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { LiquidTabs } from './hairline/liquid-tabs';

export default function FloatingNavbar({ activeTab, setActiveTab }) {
  const tabs = [
    { 
      value: 'forecast', 
      label: 'Live Forecast', 
      icon: <CloudRain className="size-4 shrink-0" />,
      color: '#4338ca',
      foreground: '#ffffff'
    },
    { 
      value: 'simulator', 
      label: 'What-If Simulator', 
      icon: <Sliders className="size-4 shrink-0" />,
      color: '#4f46e5',
      foreground: '#ffffff'
    },
    { 
      value: 'analytics', 
      label: 'Historical (16y)', 
      icon: <LineChart className="size-4 shrink-0" />,
      color: '#4338ca',
      foreground: '#ffffff'
    },
    { 
      value: 'model', 
      label: 'Model (83.2%)', 
      icon: <Cpu className="size-4 shrink-0" />,
      color: '#4f46e5',
      foreground: '#ffffff'
    },
    { 
      value: 'about', 
      label: 'Syllabus & About', 
      icon: <BookOpen className="size-4 shrink-0" />,
      color: '#3730a3',
      foreground: '#ffffff'
    },
  ];

  return (
    <header className="floating-navbar-wrapper">
      <nav className="floating-navbar glass-card-nav">
        {/* Brand Identity */}
        <BrandLogo />

        {/* Official Hairline UI Liquid Tabs with Surface Tension Physics */}
        <LiquidTabs
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          label="PRECICAST Navigation Tabs"
          size="md"
        />
      </nav>
    </header>
  );
}
