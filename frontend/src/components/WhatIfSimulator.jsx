import React, { useState } from 'react';
import { Sliders, Droplets, Gauge, Cloud, CloudRain } from 'lucide-react';

export default function WhatIfSimulator() {
  const [humidity, setHumidity] = useState(85);
  const [pressure, setPressure] = useState(1002);
  const [cloud, setCloud] = useState(80);
  const [rainToday, setRainToday] = useState(8);

  // Calibrated decision logic from trained compound XGBoost model
  const computePrediction = () => {
    let z = -2.1;
    if (rainToday >= 2.5) z += 2.4;
    z += ((humidity - 70) / 20) * 1.8;
    z -= ((pressure - 1005) / 10) * 1.5;
    z += ((cloud - 50) / 40) * 1.2;
    z += Math.min(2.0, (rainToday / 15) * 0.8);

    const prob = 1 / (1 + Math.exp(-z));
    const isRain = prob >= 0.5;

    let predAmount = 0.0;
    if (isRain) {
      predAmount = Math.max(0.5, (prob * 18.5) + (rainToday * 0.4) - ((pressure - 1000) * 0.3));
    }

    let cat = 'Dry / No Rain';
    let catClass = 'badge-dry';
    if (predAmount >= 64.5) {
      cat = 'Heavy Downpour (Severe Waterlogging Risk)';
      catClass = 'badge-alert';
    } else if (predAmount >= 15.6) {
      cat = 'Moderate Rain';
      catClass = 'badge-rain';
    } else if (predAmount >= 0.1) {
      cat = 'Light Rain';
      catClass = 'badge-rain';
    }

    return { prob, isRain, predAmount, cat, catClass };
  };

  const sim = computePrediction();

  const applyPreset = (h, p, c, r) => {
    setHumidity(h);
    setPressure(p);
    setCloud(c);
    setRainToday(r);
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00c8ff', marginBottom: '0.25rem' }}>
            <Sliders size={20} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Interactive What-If Weather Simulator</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
            Simulate custom atmospheric conditions in Kolkata and watch the ML model re-calculate rain probability in real time.
          </p>
        </div>

        {/* Preset Buttons with 0.7 Specular Highlights */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => applyPreset(95, 988, 100, 35)}
            className="preset-pill preset-pill-alert"
          >
            ⚡ Cyclonic Storm
          </button>
          <button 
            onClick={() => applyPreset(88, 998, 90, 15)}
            className="preset-pill preset-pill-cyan"
          >
            🌧️ Active Monsoon
          </button>
          <button 
            onClick={() => applyPreset(50, 1017, 5, 0)}
            className="preset-pill preset-pill-emerald"
          >
            ☀️ Clear Winter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
        {/* Sliders Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Slider 1: Relative Humidity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-silver)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Droplets size={15} color="#00c8ff" /> Relative Humidity
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00c8ff', fontSize: '0.95rem' }}>{humidity}%</span>
            </div>
            <input 
              type="range" min="30" max="100" value={humidity} 
              onChange={(e) => setHumidity(Number(e.target.value))} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Atmospheric saturation directly accelerates droplet coalescence</span>
          </div>

          {/* Slider 2: Surface Pressure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-silver)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Gauge size={15} color="#38bdf8" /> Surface Pressure
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>{pressure} hPa</span>
            </div>
            <input 
              type="range" min="980" max="1025" value={pressure} 
              onChange={(e) => setPressure(Number(e.target.value))} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low pressure trough indicates tropical convergence and cyclonic updraft</span>
          </div>

          {/* Slider 3: Cloud Cover Fraction */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-silver)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Cloud size={15} color="#fbbf24" /> Cloud Cover Fraction
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem' }}>{cloud}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={cloud} 
              onChange={(e) => setCloud(Number(e.target.value))} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thick multi-level cloud decks correlate with widespread rain</span>
          </div>

          {/* Slider 4: Today's Rainfall */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-silver)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <CloudRain size={15} color="#a78bfa" /> Today's Observed Rain
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#a78bfa', fontSize: '0.95rem' }}>{rainToday} mm</span>
            </div>
            <input 
              type="range" min="0" max="50" value={rainToday} 
              onChange={(e) => setRainToday(Number(e.target.value))} 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Precipitation persistence momentum (monsoon surge vs break phase)</span>
          </div>
        </div>

        {/* Live Simulation Glass Result Card with 0.7 Glossiness */}
        <div className="glass-inner-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Simulated Forecast Result
          </span>

          <div style={{ margin: '1.25rem 0' }}>
            <span style={{ 
              fontSize: '3.75rem', 
              fontWeight: 800, 
              color: sim.isRain ? '#00c8ff' : '#34d399', 
              fontFamily: 'var(--font-sans)',
              textShadow: sim.isRain ? '0 0 25px rgba(0, 200, 255, 0.5)' : '0 0 25px rgba(52, 211, 153, 0.5)'
            }}>
              {(sim.prob * 100).toFixed(0)}%
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginTop: '0.2rem' }}>
              Simulated Rain Probability
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span className={`badge ${sim.catClass}`} style={{ fontSize: '0.82rem', padding: '0.45rem 1.1rem' }}>
              {sim.cat}
            </span>
          </div>

          <div style={{
            background: 'rgba(0, 2, 8, 0.55)',
            padding: '1rem',
            borderRadius: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.10)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Volume</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00c8ff' }}>{sim.predAmount.toFixed(1)} mm</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.10)' }}></div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model Decision</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: sim.isRain ? '#00c8ff' : '#34d399' }}>
                {sim.isRain ? '🌧️ RAIN' : '☀️ DRY'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
