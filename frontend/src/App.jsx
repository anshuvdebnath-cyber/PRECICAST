import React, { useState, Component } from 'react';
import RefractedGlassBackground from './components/RefractedGlassBackground';
import FloatingNavbar from './components/FloatingNavbar';
import LiveForecastHero from './components/LiveForecastHero';
import WhatIfSimulator from './components/WhatIfSimulator';
import HistoricalAnalytics from './components/HistoricalAnalytics';
import ModelPerformance from './components/ModelPerformance';
import AboutProject from './components/AboutProject';
import HairlineNewsletterFooter from './components/HairlineNewsletterFooter';

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

        {/* Hairline UI Glassmorphism Newsletter Footer with Big Precicast Typography */}
        <HairlineNewsletterFooter />
      </div>
    </div>
  );
}
