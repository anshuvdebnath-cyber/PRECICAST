import React, { useState } from 'react';
import RefractedGlassBackground from './components/RefractedGlassBackground';
import FloatingNavbar from './components/FloatingNavbar';
import LiveForecastHero from './components/LiveForecastHero';
import WhatIfSimulator from './components/WhatIfSimulator';
import HistoricalAnalytics from './components/HistoricalAnalytics';
import ModelPerformance from './components/ModelPerformance';
import AboutProject from './components/AboutProject';

export default function App() {
  const [activeTab, setActiveTab] = useState('forecast');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* 1. Animated Refracted Fluted Glass Shader Background (Non-interactable, zIndex: 0) */}
      <RefractedGlassBackground />

      {/* 2. Content Container (zIndex: 10, sits cleanly over transparent glass canvas) */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Floating Glassmorphism Navbar with Fluid Tab Transitions (Glossiness: 0.7) */}
        <FloatingNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Fluid Slide & Fade Transition Container */}
        <main key={activeTab} className="tab-content-fluid">
          {activeTab === 'forecast' && (
            <>
              <LiveForecastHero />
              <WhatIfSimulator />
            </>
          )}
          {activeTab === 'simulator' && <WhatIfSimulator />}
          {activeTab === 'analytics' && <HistoricalAnalytics />}
          {activeTab === 'model' && <ModelPerformance />}
          {activeTab === 'about' && <AboutProject />}
        </main>

        {/* Elegant Refractive Glass Footer */}
        <footer 
          style={{ 
            marginTop: '4rem', 
            padding: '1.75rem', 
            borderRadius: '16px',
            background: 'rgba(1, 4, 14, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.22)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.6)',
            textAlign: 'center', 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)' 
          }}
        >
          <p style={{ color: 'var(--text-silver)', fontWeight: 600 }}>
            Predictive Modeling of Next-Day Rainfall for Kolkata Using Machine Learning
          </p>
          <p style={{ marginTop: '0.35rem', fontSize: '0.75rem' }}>
            Techno India University, West Bengal — Environmental Studies (EVS) | Data: Copernicus ECMWF ERA5 & IMD Standards
          </p>
        </footer>
      </div>
    </div>
  );
}
