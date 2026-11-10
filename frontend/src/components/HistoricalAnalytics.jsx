import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Calendar, CloudRain, AlertTriangle } from 'lucide-react';
import historicalData from '../data/historical_trends.json';

export default function HistoricalAnalytics() {
  const { annual_trends, monthly_averages, historical_cyclones } = historicalData;

  const glassTooltipStyle = {
    background: 'rgba(0, 3, 10, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.35)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
    color: '#ffffff'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Overview Stat Cards with 0.7 Glossiness */}
      <div className="grid-3">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00c8ff', marginBottom: '0.5rem' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Historical Timeline</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>2010 – 2026</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>16+ years of continuous atmospheric reanalysis</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.5rem' }}>
            <CloudRain size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IMD Climatological Normal</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>1,650 mm / year</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official annual average for Kolkata (Alipore)</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extreme Downpours</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>22 Heavy Days</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily rainfall &gt;64.5 mm (Waterlogging events)</div>
        </div>
      </div>

      {/* Chart 1: Annual Rainfall vs IMD Normal */}
      <div className="glass-card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
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
                <linearGradient id="barBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c8ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#002db3" stopOpacity={0.4} />
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
              <Bar dataKey="rainfall_mm" fill="url(#barBlueGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Monthly Seasonal Monsoon Distribution */}
      <div className="glass-card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
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
                <linearGradient id="lineCyanGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00c8ff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a6ebff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit=" mm" />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${val} mm`, 'Avg Monthly Total']}
              />
              <Line type="monotone" dataKey="avg_rainfall_mm" stroke="url(#lineCyanGlow)" strokeWidth={3.5} dot={{ fill: '#a6ebff', r: 5, stroke: '#001a4d', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Extreme Historical Storm Case Studies */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
          Benchmark Historical Storm Events in Dataset
        </h3>
        <div className="grid-3">
          {historical_cyclones.map((c, i) => (
            <div key={i} className="glass-inner-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f87171' }}>{c.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.date}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-silver)', marginBottom: '0.9rem', lineHeight: '1.5' }}>
                {c.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#00c8ff' }}>
                <span>Rain: {c.rainfall_mm} mm</span>
                <span>Min P: {c.min_pressure_hpa} hPa</span>
                <span>Wind: {c.max_wind_kmh} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
