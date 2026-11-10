import React, { useState } from 'react';
import { Calendar, CloudRain, AlertTriangle, TrendingUp, Layers, Wind } from 'lucide-react';
import historicalData from '../data/historical_trends.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';
import MorphingChart from './hairline/morphing-chart';

export default function HistoricalAnalytics() {
  const { annual_trends, monthly_averages, historical_cyclones } = historicalData;
  const [chartView, setChartView] = useState('annual'); // 'annual' | 'monthly'

  // Clean Annual data points for Hairline UI MorphingChart (2010–2026)
  const annualLabels = annual_trends.map((d) => String(d.year));
  const annualValues = annual_trends.map((d) => Math.round(d.rainfall_mm ?? 0));
  const annualTitles = annual_trends.map((d) => `Calendar Year ${d.year}: ${Math.round(d.rainfall_mm).toLocaleString()} mm Total Precipitation`);

  // Clean Monthly data points for Hairline UI MorphingChart
  const monthlyLabels = monthly_averages.map((d) => d.month);
  const monthlyValues = monthly_averages.map((d) => Math.round(d.avg_rainfall_mm ?? 0));
  const monthlyTitles = monthly_averages.map((d) => `${d.month}: ${Math.round(d.avg_rainfall_mm).toLocaleString()} mm 16-Year Average Rainfall`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Overview Stat Cards with Hairline Glass & Official Number Rolls */}
      <div className="grid-3">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#adc7ff', marginBottom: '0.55rem' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Verified Historical Timeline</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            2010 – 2026
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            16+ consecutive years of ECMWF ERA5 hourly gridded data (6,153 continuous days)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.55rem' }}>
            <CloudRain size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>India Meteorological Department Baseline</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            <NumberRoll value={1650} suffix=" mm / year" duration={600} />
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            Official climatological normal for Kolkata (Alipore Meteorological Observatory)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.55rem' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Extreme Precipitation Days</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            <NumberRoll value={22} suffix=" Days Recorded" duration={600} />
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            Single-day deluge exceeding 64.5 mm (causing municipal drainage waterlogging)
          </div>
        </HairlineCard>
      </div>

      {/* Main Interactive Morphing Chart Section - Strictly Aligned & Contained */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8aa2ff', marginBottom: '0.2rem' }}>
              {chartView === 'annual' ? <TrendingUp size={16} /> : <Layers size={16} />}
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <TextMorph>{chartView === 'annual' ? 'Atmospheric Precipitation Dynamics' : 'Monsoon Hydrology Distribution'}</TextMorph>
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              <TextMorph>{chartView === 'annual' ? 'Annual Kolkata Rainfall History (2010–2026)' : '12-Month Climatological Monsoon Cycle (Southwest Monsoon Surge)'}</TextMorph>
            </h3>
          </div>

          {/* Hairline Mode Toggle with generous padding and spacing */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(5, 4, 18, 0.75)', padding: '0.35rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.14)' }}>
            <button
              type="button"
              onClick={() => setChartView('annual')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: chartView === 'annual' ? 650 : 500,
                color: chartView === 'annual' ? '#ffffff' : 'var(--text-muted)',
                background: chartView === 'annual' ? 'rgba(82, 46, 230, 0.55)' : 'transparent',
                border: chartView === 'annual' ? '1px solid rgba(173, 199, 255, 0.35)' : '1px solid transparent',
                boxShadow: chartView === 'annual' ? '0 4px 14px rgba(82, 46, 230, 0.40)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              16-Year Annual Rainfall History (2010–2026)
            </button>
            <button
              type="button"
              onClick={() => setChartView('monthly')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: chartView === 'monthly' ? 650 : 500,
                color: chartView === 'monthly' ? '#ffffff' : 'var(--text-muted)',
                background: chartView === 'monthly' ? 'rgba(82, 46, 230, 0.55)' : 'transparent',
                border: chartView === 'monthly' ? '1px solid rgba(173, 199, 255, 0.35)' : '1px solid transparent',
                boxShadow: chartView === 'monthly' ? '0 4px 14px rgba(82, 46, 230, 0.40)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              12-Month Climatological Monsoon Cycle
            </button>
          </div>
        </div>

        {/* Morphing Chart Component */}
        {chartView === 'annual' ? (
          <MorphingChart
            key="annual-chart"
            title="Total Annual Kolkata Rainfall (Millimeters)"
            caption="Total annual precipitation in millimeters compared to 1,650 mm IMD Normal"
            labels={annualLabels}
            titles={annualTitles}
            values={annualValues}
            defaultShape="bars"
            className="glass-morphing-chart"
          />
        ) : (
          <MorphingChart
            key="monthly-chart"
            title="Climatological Monthly Precipitation Cycle (Millimeters)"
            caption="16-year average monthly accumulation highlighting the July–August monsoon peak (mm)"
            labels={monthlyLabels}
            titles={monthlyTitles}
            values={monthlyValues}
            defaultShape="area"
            className="glass-morphing-chart"
          />
        )}
      </div>

      {/* Extreme Historical Storm Case Studies with full descriptive fields */}
      <HairlineCard style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            <TextMorph>Benchmark Historical Storm Events in ERA5 Dataset</TextMorph>
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-silver)' }}>
            Supercyclonic systems and severe tropical weather disturbances verified against regional meteorological ground truth.
          </p>
        </div>

        <div className="grid-3">
          {historical_cyclones.map((c, i) => (
            <HairlineCard key={i} variant="inner" style={{ padding: '1.2rem 1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>
                  <TextMorph>{c.name}</TextMorph>
                </span>
                <HairlineBadge tone="neutral" size="sm">{c.date}</HairlineBadge>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', marginBottom: '1rem', lineHeight: '1.5' }}>
                {c.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem', background: 'rgba(5, 4, 18, 0.45)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>24-Hour Rainfall Depth:</span>
                  <strong style={{ color: '#adc7ff' }}><NumberRoll value={c.rainfall_mm} suffix=" mm" /></strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Minimum Barometric Pressure:</span>
                  <strong style={{ color: '#adc7ff' }}><NumberRoll value={c.min_pressure_hpa} suffix=" hPa" /></strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Peak Sustained Wind Speed:</span>
                  <strong style={{ color: '#fbbf24' }}><NumberRoll value={c.max_wind_kmh} suffix=" km/h" /></strong>
                </div>
              </div>
            </HairlineCard>
          ))}
        </div>
      </HairlineCard>
    </div>
  );
}
