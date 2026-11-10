import React from 'react';
import { CloudRain, Sliders, LineChart, Cpu, BookOpen } from 'lucide-react';
import BrandLogo from './BrandLogo';

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

        {/* Tab Controls with Smooth Sliding Pill */}
        <div className="nav-tab-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab-pill ${isActive ? 'active' : ''}`}
                aria-selected={isActive}
              >
                <Icon size={15} className="nav-icon" />
                <span className="nav-label">{tab.label}</span>
                {isActive && <div className="nav-active-glow" />}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
