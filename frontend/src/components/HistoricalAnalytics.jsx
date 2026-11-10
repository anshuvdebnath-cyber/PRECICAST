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
  const annualTitles = annual_trends.map((d) => `${d.year} Annual Total`);

  // Clean Monthly data points for Hairline UI MorphingChart
  const monthlyLabels = monthly_averages.map((d) => d.month);
  const monthlyValues = monthly_averages.map((d) => Math.round(d.avg_rainfall_mm ?? 0));
  const monthlyTitles = monthly_averages.map((d) => `${d.month} Climatological Mean`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Stat Cards with Hairline Glass & Official Number Rolls */}
      <div className="grid-3">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#adc7ff', marginBottom: '0.45rem' }}>
            <Calendar size={17} />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Verified Historical Timeline</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            2010 – 2026
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            16+ years continuous reanalysis (6,153 days)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.45rem' }}>
            <CloudRain size={17} />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>IMD Climatological Normal</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            <NumberRoll value={1650} suffix=" mm / yr" duration={500} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Official Kolkata baseline (Alipore Observatory)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.45rem' }}>
            <AlertTriangle size={17} />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Extreme Downpours</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.15rem 0' }}>
            <NumberRoll value={22} suffix=" Days" duration={500} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Daily precipitation &gt;64.5 mm (Waterlogging risks)
          </div>
        </HairlineCard>
      </div>

      {/* Main Interactive Morphing Chart Section - Strictly Aligned & Contained */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#8aa2ff', marginBottom: '0.15rem' }}>
              {chartView === 'annual' ? <TrendingUp size={16} /> : <Layers size={16} />}
              <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <TextMorph>{chartView === 'annual' ? 'Atmospheric Precipitation Morph' : 'Monsoon Hydrology Distribution'}</TextMorph>
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              <TextMorph>{chartView === 'annual' ? 'Annual Kolkata Rainfall (2010–2026)' : 'Monthly Precipitation Profile (Southwest Monsoon Surge)'}</TextMorph>
            </h3>
          </div>

          {/* Hairline Mode Toggle: Annual vs Monthly */}
          <div style={{ display: 'inline-flex', background: 'rgba(5, 4, 18, 0.75)', padding: '3px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <button
              type="button"
              onClick={() => setChartView('annual')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: chartView === 'annual' ? 650 : 500,
                color: chartView === 'annual' ? '#ffffff' : 'var(--text-muted)',
                background: chartView === 'annual' ? 'rgba(82, 46, 230, 0.45)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Annual Trend (16y)
            </button>
            <button
              type="button"
              onClick={() => setChartView('monthly')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: chartView === 'monthly' ? 650 : 500,
                color: chartView === 'monthly' ? '#ffffff' : 'var(--text-muted)',
                background: chartView === 'monthly' ? 'rgba(82, 46, 230, 0.45)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly Monsoon Cycle
            </button>
          </div>
        </div>

        {/* Morphing Chart Component */}
        {chartView === 'annual' ? (
          <MorphingChart
            key="annual-chart"
            title="Annual Kolkata Rainfall Volume"
            caption="Recorded precipitation (mm) against 1,650 mm IMD Normal"
            labels={annualLabels}
            titles={annualTitles}
            values={annualValues}
            defaultShape="bars"
            className="glass-morphing-chart"
          />
        ) : (
          <MorphingChart
            key="monthly-chart"
            title="Mean Monthly Rainfall Cycle"
            caption="Multi-decadal monthly accumulation showing July-August monsoon surge (mm)"
            labels={monthlyLabels}
            titles={monthlyTitles}
            values={monthlyValues}
            defaultShape="area"
            className="glass-morphing-chart"
          />
        )}
      </div>

      {/* Extreme Historical Storm Case Studies */}
      <HairlineCard style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            <TextMorph>Benchmark Historical Storm Events in Dataset</TextMorph>
          </h3>
          <p style={{ fontSize: '0.80rem', color: 'var(--text-silver)' }}>
            Supercyclonic and severe tropical weather systems verified in the ERA5 Kolkata archive.
          </p>
        </div>

        <div className="grid-3">
          {historical_cyclones.map((c, i) => (
            <HairlineCard key={i} variant="inner" style={{ padding: '1rem 1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f87171' }}>
                  <TextMorph>{c.name}</TextMorph>
                </span>
                <HairlineBadge tone="neutral" size="sm">{c.date}</HairlineBadge>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-silver)', marginBottom: '0.75rem', lineHeight: '1.45' }}>
                {c.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#adc7ff' }}>
                <span>Rain: <strong><NumberRoll value={c.rainfall_mm} suffix=" mm" /></strong></span>
                <span>Min P: <strong><NumberRoll value={c.min_pressure_hpa} suffix=" hPa" /></strong></span>
                <span>Wind: <strong><NumberRoll value={c.max_wind_kmh} suffix=" km/h" /></strong></span>
              </div>
            </HairlineCard>
          ))}
        </div>
      </HairlineCard>
    </div>
  );
}
