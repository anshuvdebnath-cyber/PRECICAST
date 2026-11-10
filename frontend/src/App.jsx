import React, { useState, Component } from 'react';
import RefractedGlassBackground from './components/RefractedGlassBackground';
import FloatingNavbar from './components/FloatingNavbar';
import LiveForecastHero from './components/LiveForecastHero';
import WhatIfSimulator from './components/WhatIfSimulator';
import HistoricalAnalytics from './components/HistoricalAnalytics';
import ModelPerformance from './components/ModelPerformance';
import AboutProject from './components/AboutProject';

class TabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Tab Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', margin: '2rem 0' }}>
          <h3 style={{ color: '#f87171', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Visualizer Recovery Notice
          </h3>
          <p style={{ color: 'var(--text-silver)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {this.state.error?.message || "A rendering exception occurred while computing chart coordinates."}
          </p>
          <button 
            type="button" 
            onClick={() => this.setState({ hasError: false })}
            className="action-button-glass"
          >
            Reset Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('forecast');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* 1. Animated Refracted Fluted Glass Shader Background (Non-interactable, zIndex: 0) */}
      <RefractedGlassBackground />

      {/* 2. Content Container (zIndex: 10, strictly aligned within grid) */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Floating Glassmorphism Navbar with Fluid Tab Transitions */}
        <FloatingNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Fluid Tab Section Container - strictly contained */}
        <main key={activeTab} className="tab-content-fluid">
          <TabErrorBoundary key={activeTab}>
            {activeTab === 'forecast' && <LiveForecastHero />}
            {activeTab === 'simulator' && <WhatIfSimulator />}
            {activeTab === 'analytics' && <HistoricalAnalytics />}
            {activeTab === 'model' && <ModelPerformance />}
            {activeTab === 'about' && <AboutProject />}
          </TabErrorBoundary>
        </main>

        {/* Compact Refractive Glass Footer */}
        <footer 
          style={{ 
            marginTop: '2.5rem', 
            padding: '1.25rem 1.75rem', 
            borderRadius: '16px',
            background: 'rgba(3, 2, 14, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.18)',
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
