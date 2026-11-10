import React from 'react';
import { Calendar, CloudRain, AlertTriangle, TrendingUp, Layers, Wind } from 'lucide-react';
import historicalData from '../data/historical_trends.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';
import MorphingChart from './hairline/morphing-chart';

export default function HistoricalAnalytics() {
  const { annual_trends, monthly_averages, historical_cyclones } = historicalData;

  // Clean Annual data points for Hairline UI MorphingChart (2010–2026)
  const annualLabels = annual_trends.map((d) => String(d.year));
  const annualValues = annual_trends.map((d) => Math.round(d.rainfall_mm ?? 0));
  const annualTitles = annual_trends.map((d) => `Calendar Year ${d.year}: ${Math.round(d.rainfall_mm).toLocaleString()} mm Total Precipitation`);

  // Clean Monthly data points for Hairline UI MorphingChart
  const monthlyLabels = monthly_averages.map((d) => d.month);
  const monthlyValues = monthly_averages.map((d) => Math.round(d.avg_rainfall_mm ?? 0));
  const monthlyTitles = monthly_averages.map((d) => `${d.month}: ${Math.round(d.avg_rainfall_mm).toLocaleString()} mm 16-Year Average Rainfall`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Overview Stat Cards with Hairline Glass & Official Number Rolls */}
      <div className="grid-3">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#adc7ff', marginBottom: '0.55rem' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Verified Historical Timeline</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.15rem 0', fontFamily: 'Outfit, sans-serif' }}>
            2010 – 2026
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-silver)', lineHeight: 1.45 }}>
            16+ consecutive years of ECMWF ERA5 hourly gridded data (6,153 continuous days)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.55rem' }}>
            <CloudRain size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>India Meteorological Department Baseline</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.15rem 0', fontFamily: 'Outfit, sans-serif' }}>
            <NumberRoll value={1650} suffix=" mm / year" duration={600} />
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-silver)', lineHeight: 1.45 }}>
            Official climatological normal for Kolkata (Alipore Meteorological Observatory)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.55rem' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Extreme Precipitation Days</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.15rem 0', fontFamily: 'Outfit, sans-serif' }}>
            <NumberRoll value={22} suffix=" Days Recorded" duration={600} />
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-silver)', lineHeight: 1.45 }}>
            Single-day deluge exceeding 64.5 mm (causing municipal drainage waterlogging)
          </div>
        </HairlineCard>
      </div>

      {/* 2. Card 1: 16-Year Annual Kolkata Rainfall History (2010–2026) */}
      <HairlineCard style={{ padding: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8aa2ff', marginBottom: '0.35rem' }}>
              <TrendingUp size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <TextMorph>Atmospheric Precipitation Dynamics</TextMorph>
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
              <TextMorph>Annual Kolkata Rainfall History (2010–2026)</TextMorph>
            </h3>
            <p style={{ fontSize: '0.90rem', color: 'var(--text-silver)', marginTop: '0.35rem', lineHeight: 1.45 }}>
              Total annual precipitation in millimeters compared against the 1,650 mm IMD Normal (Copernicus ECMWF ERA5 verified ground record).
            </p>
          </div>
          <HairlineBadge tone="rain" size="md">
            16-Year Time Series
          </HairlineBadge>
        </div>

        <MorphingChart
          title="Total Annual Kolkata Rainfall (Millimeters)"
          labels={annualLabels}
          values={annualValues}
          titles={annualTitles}
          defaultShape="bars"
          format={{ maximumFractionDigits: 0 }}
          subtitle="Total annual precipitation in millimeters compared to 1,650 mm IMD Normal"
          className="w-full bg-transparent shadow-none"
        />
      </HairlineCard>

      {/* 3. Card 2: 12-Month Climatological Monsoon Cycle (Brought Down in Separate Dedicated Section) */}
      <HairlineCard style={{ padding: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', marginBottom: '0.35rem' }}>
              <Layers size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <TextMorph>Monsoon Hydrology Distribution</TextMorph>
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
              <TextMorph>12-Month Climatological Monsoon Cycle (Southwest Monsoon Surge)</TextMorph>
            </h3>
            <p style={{ fontSize: '0.90rem', color: 'var(--text-silver)', marginTop: '0.35rem', lineHeight: 1.45 }}>
              16-year average monthly precipitation accumulation highlighting the June–September Southwest monsoon surge.
            </p>
          </div>
          <HairlineBadge tone="success" size="md">
            Climatological Normal
          </HairlineBadge>
        </div>

        <MorphingChart
          title="Climatological Monthly Precipitation Cycle (Millimeters)"
          labels={monthlyLabels}
          values={monthlyValues}
          titles={monthlyTitles}
          defaultShape="area"
          format={{ maximumFractionDigits: 0 }}
          subtitle="16-year average monthly accumulation highlighting the July–August monsoon peak (mm)"
          className="w-full bg-transparent shadow-none"
        />
      </HairlineCard>

      {/* 4. Card 3: Benchmark Historical Storm Events in Dataset */}
      <HairlineCard style={{ padding: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.35rem' }}>
          <Wind size={22} color="#fbbf24" />
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
            <TextMorph>Benchmark Historical Storm Events in ERA5 Dataset</TextMorph>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {historical_cyclones.map((c) => (
            <HairlineCard key={c.name} variant="inner" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{c.name}</h4>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{c.date}</span>
                </div>
                <HairlineBadge tone="alert" size="sm">
                  {c.intensity_category}
                </HairlineBadge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem', textAlign: 'center' }}>
                <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.65rem 0.35rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Peak Rain</div>
                  <strong style={{ color: '#adc7ff', fontSize: '0.95rem' }}><NumberRoll value={c.rainfall_mm} suffix=" mm" /></strong>
                </div>
                <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.65rem 0.35rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Pressure</div>
                  <strong style={{ color: '#adc7ff', fontSize: '0.95rem' }}><NumberRoll value={c.min_pressure_hpa} suffix=" hPa" /></strong>
                </div>
                <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.65rem 0.35rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Max Wind</div>
                  <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}><NumberRoll value={c.max_wind_kmh} suffix=" km/h" /></strong>
                </div>
              </div>
            </HairlineCard>
          ))}
        </div>
      </HairlineCard>
    </div>
  );
}
