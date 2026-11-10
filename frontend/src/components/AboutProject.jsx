import React from 'react';
import { GraduationCap, ExternalLink, FileText } from 'lucide-react';

export default function AboutProject() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* University Card with 0.7 Glossiness */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ 
            background: 'rgba(0, 200, 255, 0.15)', 
            padding: '0.75rem', 
            borderRadius: '14px', 
            color: '#00c8ff',
            borderTop: '1px solid rgba(255, 255, 255, 0.45)',
            boxShadow: '0 8px 20px rgba(0, 200, 255, 0.25)'
          }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <span className="badge badge-rain">Academic Credentials</span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>Techno India University, West Bengal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
              Syllabus for B.Tech — Environmental Studies (EVS) | Group B: Project & Presentation
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '1.5rem' }}>
          <div className="glass-inner-card">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Domain</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00c8ff', marginTop: '0.25rem' }}>Topic 1: Climate Change & Weather Prediction</div>
          </div>
          <div className="glass-inner-card">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sub-Topic Focus</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', marginTop: '0.25rem' }}>Rainfall Prediction Using Machine Learning</div>
          </div>
          <div className="glass-inner-card">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Presentation Date</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', marginTop: '0.25rem' }}>November 14, 2026</div>
          </div>
        </div>
      </div>

      {/* Verified Data Sources */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
          Official Scientific Data Sources & Citations
        </h3>
        
        <div className="grid-2">
          <div className="glass-inner-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: 800, color: '#00c8ff', fontSize: '1.05rem' }}>Copernicus ERA5 Atmospheric Reanalysis</span>
              <span className="badge badge-rain">Primary Training Data</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: '1.55', marginBottom: '0.75rem' }}>
              Operated by the European Centre for Medium-Range Weather Forecasts (ECMWF). Hourly reanalysis gridded atmospheric variables covering 2010 to 2026 for Kolkata coordinates (22.57°N, 88.36°E).
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Variables: 2m Temperature, Dew Point, Relative Humidity, Surface Pressure, Total Precipitation, U/V Wind Vectors, Cloud Cover.
            </div>
          </div>

          <div className="glass-inner-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>India Meteorological Department (IMD)</span>
              <span className="badge badge-dry">Ground-Truth Baseline</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: '1.55', marginBottom: '0.75rem' }}>
              Regional Meteorological Centre, Alipore, Kolkata. Climatological rainfall normals, monsoon onset/withdrawal windows, and standard IMD threshold definitions (≥ 2.5 mm = Rainy Day).
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Thresholds: 2.5–15.5 mm (Light Rain), 15.6–64.4 mm (Moderate), &gt;64.5 mm (Heavy Rain Alert).
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Deck Outline (13 Slides) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>College Presentation Slide Deck (13 Slides)</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', marginTop: '0.2rem' }}>
              Word-for-word script matching the syllabus headings approved for November 14, 2026.
            </p>
          </div>
          <span className="badge badge-rain">13 Slides Complete</span>
        </div>

        <div className="grid-3">
          {[
            { num: 1, title: 'Title & Team Credentials', desc: 'Project topic, university credentials, and team member roll numbers.' },
            { num: 2, title: 'Introduction & Local Context', desc: 'Why Kolkata rainfall matters: monsoon drainage, transit, and waterlogging.' },
            { num: 3, title: 'Literature Review & Gaps', desc: 'Traditional NWP physics models vs. modern data-driven Machine Learning.' },
            { num: 4, title: 'Study Area & Coordinates', desc: 'Geographic setting: 22.57°N, 88.36°E, proximity to Bay of Bengal.' },
            { num: 5, title: 'Official Data Architecture', desc: 'Copernicus ECMWF ERA5 reanalysis (2010–2026, 6,153 continuous days).' },
            { num: 6, title: 'Meteorological Engineering', desc: 'Vapor pressure deficit, dew point depression, wind vectors, pressure delta.' },
            { num: 7, title: 'Machine Learning Workflow', desc: 'Two-stage compound XGBoost: Binary Classifier + Intensity Regressor.' },
            { num: 8, title: 'Rigorous Test Results', desc: 'ROC-AUC 0.9126, 83.16% accuracy on 1,039 unseen future days (2024–2026).' },
            { num: 9, title: 'Historical Climate Analysis', desc: '16-year monsoon trends, Cyclone Amphan and Remal anomaly tracking.' },
            { num: 10, title: 'Interactive Dashboard Demo', desc: 'Real-time telemetry, what-if weather sliders, municipal waterlogging alerts.' },
            { num: 11, title: 'Environmental & Civic Impact', desc: 'Municipal flood readiness, KMC pumping station optimization, urban transit.' },
            { num: 12, title: 'Limitations & Future Scope', desc: 'Doppler radar integration, hyperlocal ward-level modeling (Alipore vs Dum Dum).' },
            { num: 13, title: 'References & Viva Q&A', desc: 'Citations (ECMWF, IMD, Chen & Guestrin XGBoost) and top 5 defense answers.' },
          ].map((s) => (
            <div key={s.num} className="glass-inner-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                <span style={{ 
                  background: 'rgba(0, 200, 255, 0.15)', 
                  color: '#00c8ff', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  padding: '0.2rem 0.55rem', 
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 200, 255, 0.3)'
                }}>
                  Slide {s.num}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{s.title}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-silver)', lineHeight: '1.45' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
