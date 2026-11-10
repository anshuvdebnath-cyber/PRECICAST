import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Calendar, CloudRain, AlertTriangle } from 'lucide-react';
import historicalData from '../data/historical_trends.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import HairlineNumberRoll from './hairline/HairlineNumberRoll';

export default function HistoricalAnalytics() {
  const { annual_trends, monthly_averages, historical_cyclones } = historicalData;

  const glassTooltipStyle = {
    background: 'rgba(5, 4, 18, 0.90)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.45)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overview Stat Cards with Hairline Glass & Number Rolls */}
      <div className="grid-3">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan-bright)', marginBottom: '0.65rem' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Verified Historical Timeline
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            2010 – 2026
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            16+ years of continuous atmospheric reanalysis (6,153 days)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.65rem' }}>
            <CloudRain size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              IMD Climatological Normal
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <HairlineNumberRoll value={1650} decimals={0} suffix=" mm / yr" />
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            Official annual baseline for Kolkata (Alipore Observatory)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.65rem' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Extreme Downpours
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <HairlineNumberRoll value={22} decimals={0} suffix=" Days" />
          </div>
          <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            Daily precipitation &gt;64.5 mm (Severe waterlogging thresholds)
          </div>
        </HairlineCard>
      </div>

      {/* Chart 1: Annual Rainfall vs IMD Normal */}
      <HairlineCard>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Annual Kolkata Rainfall (2010–2026) vs. IMD Normal
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
            Comparing recorded annual precipitation totals against the official India Meteorological Department baseline (1,650 mm).
          </p>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={annual_trends} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="barAuroraGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8aa2ff" stopOpacity={0.95} />
                  <stop offset="60%" stopColor="#5230e0" stopOpacity={0.70} />
                  <stop offset="100%" stopColor="#1a0866" stopOpacity={0.40} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit=" mm" />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${val} mm`, 'Rainfall']}
              />
              <ReferenceLine y={1650} stroke="#34d399" strokeDasharray="5 5" label={{ value: 'IMD Normal (1650 mm)', fill: '#34d399', position: 'insideTopRight', fontSize: 12 }} />
              <Bar dataKey="rainfall_mm" fill="url(#barAuroraGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </HairlineCard>

      {/* Chart 2: Monthly Seasonal Monsoon Distribution */}
      <HairlineCard>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Monthly Precipitation Profile: Southwest Monsoon Dominance
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
            Average monthly rainfall distribution showing the distinct surge during the core monsoon months (June to September).
          </p>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={monthly_averages} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="lineAuroraGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5230e0" />
                  <stop offset="50%" stopColor="#8aa2ff" />
                  <stop offset="100%" stopColor="#d9ebff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit=" mm" />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${val} mm`, 'Avg Monthly Total']}
              />
              <Line 
                type="monotone" 
                dataKey="avg_rainfall_mm" 
                stroke="url(#lineAuroraGrad)" 
                strokeWidth={3.5} 
                dot={{ fill: '#d9ebff', r: 5, stroke: '#1a0866', strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </HairlineCard>

      {/* Extreme Historical Storm Case Studies */}
      <HairlineCard>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Benchmark Historical Storm Events in Dataset
        </h3>
        <div className="grid-3">
          {historical_cyclones.map((c, i) => (
            <HairlineCard key={i} variant="inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>{c.name}</span>
                <HairlineBadge tone="neutral" size="sm">{c.date}</HairlineBadge>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', marginBottom: '1rem', lineHeight: '1.5' }}>
                {c.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan-bright)' }}>
                <span>Rain: {c.rainfall_mm} mm</span>
                <span>Min P: {c.min_pressure_hpa} hPa</span>
                <span>Wind: {c.max_wind_kmh} km/h</span>
              </div>
            </HairlineCard>
          ))}
        </div>
      </HairlineCard>
    </div>
  );
}
