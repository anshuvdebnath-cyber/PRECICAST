import React from 'react';
import { Database, ShieldCheck, Cpu, CloudRain } from 'lucide-react';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import TextMorph from './hairline/text-morph';

export default function AboutProject() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Official Scientific Data Sources & Citations */}
      <HairlineCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(82, 46, 230, 0.22)',
            padding: '0.65rem',
            borderRadius: '12px',
            color: '#adc7ff',
            borderTop: '1px solid rgba(255, 255, 255, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={24} />
          </div>
          <div>
            <HairlineBadge tone="rain" dot="pulse">
              <TextMorph>Verified Data Architecture</TextMorph>
            </HairlineBadge>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
              <TextMorph>Official Scientific Data Sources & Citations</TextMorph>
            </h3>
          </div>
        </div>
        
        <div className="grid-2">
          <HairlineCard variant="inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontWeight: 700, color: '#adc7ff', fontSize: '1.02rem' }}>
                Copernicus ERA5 Atmospheric Reanalysis
              </span>
              <HairlineBadge tone="rain" size="sm">Primary Training Data</HairlineBadge>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: '1.55', marginBottom: '0.75rem' }}>
              Operated by the European Centre for Medium-Range Weather Forecasts (ECMWF). Hourly reanalysis gridded atmospheric variables covering 2010 to 2026 for Kolkata coordinates (22.57°N, 88.36°E).
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Variables: 2m Temperature, Dew Point, Relative Humidity, Surface Pressure, Total Precipitation, U/V Wind Vectors, Cloud Cover.
            </div>
          </HairlineCard>

          <HairlineCard variant="inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontWeight: 700, color: '#34d399', fontSize: '1.02rem' }}>
                India Meteorological Department (IMD)
              </span>
              <HairlineBadge tone="success" size="sm">Ground-Truth Baseline</HairlineBadge>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', lineHeight: '1.55', marginBottom: '0.75rem' }}>
              Regional Meteorological Centre, Alipore, Kolkata. Climatological rainfall normals, monsoon onset/withdrawal windows, and standard IMD threshold definitions (≥ 2.5 mm = Rainy Day).
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Thresholds: 2.5–15.5 mm (Light Rain), 15.6–64.4 mm (Moderate), &gt;64.5 mm (Heavy Rain Alert).
            </div>
          </HairlineCard>
        </div>
      </HairlineCard>

      {/* Model Engine & Operational Pipeline */}
      <HairlineCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.18)',
            padding: '0.65rem',
            borderRadius: '12px',
            color: '#38bdf8',
            borderTop: '1px solid rgba(255, 255, 255, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <HairlineBadge tone="neutral">
              <TextMorph>System Specifications</TextMorph>
            </HairlineBadge>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
              <TextMorph>precicast Machine Learning Pipeline</TextMorph>
            </h3>
          </div>
        </div>

        <div className="grid-3">
          <HairlineCard variant="inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#adc7ff' }}>
              <CloudRain size={16} />
              <span style={{ fontWeight: 650, fontSize: '0.92rem' }}>Two-Stage ML Pipeline</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-silver)', lineHeight: '1.5' }}>
              Stage 1 executes binary classification (Rain vs No Rain) using calibrated XGBoost. Stage 2 estimates continuous precipitation depth (mm) conditioned on rainfall occurrence.
            </p>
          </HairlineCard>

          <HairlineCard variant="inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#34d399' }}>
              <ShieldCheck size={16} />
              <span style={{ fontWeight: 650, fontSize: '0.92rem' }}>Temporal Generalization</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-silver)', lineHeight: '1.5' }}>
              Strict chronological split: trained on 2010–2023 (5,114 days) and evaluated exclusively on 1,039 unseen future days (2024–2026), preventing data leakage.
            </p>
          </HairlineCard>

          <HairlineCard variant="inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#fbbf24' }}>
              <Database size={16} />
              <span style={{ fontWeight: 650, fontSize: '0.92rem' }}>Meteorological Features</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-silver)', lineHeight: '1.5' }}>
              Engineered features include vapor pressure deficit (VPD), dew point depression, barometric tendency (24h delta), and cyclonic vorticity indicators.
            </p>
          </HairlineCard>
        </div>
      </HairlineCard>
    </div>
  );
}
