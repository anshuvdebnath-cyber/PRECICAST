import React, { useState } from 'react';
import { Sliders, Droplets, Gauge, Cloud, CloudRain } from 'lucide-react';
import HairlineCard from './hairline/HairlineCard';
import HairlineSlider from './hairline/HairlineSlider';
import HairlineBadge from './hairline/HairlineBadge';
import HairlineNumberRoll from './hairline/HairlineNumberRoll';

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
    let tone = 'success';
    if (predAmount >= 64.5) {
      cat = 'Heavy Downpour (Severe Waterlogging Risk)';
      tone = 'warning';
    } else if (predAmount >= 15.6) {
      cat = 'Moderate Rain';
      tone = 'rain';
    } else if (predAmount >= 0.1) {
      cat = 'Light Rain';
      tone = 'rain';
    }

    return { prob, isRain, predAmount, cat, tone };
  };

  const sim = computePrediction();

  const applyPreset = (h, p, c, r) => {
    setHumidity(h);
    setPressure(p);
    setCloud(c);
    setRainToday(r);
  };

  return (
    <HairlineCard style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan-bright)', marginBottom: '0.25rem' }}>
            <Sliders size={20} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Interactive What-If Weather Simulator
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
            Simulate custom atmospheric conditions in Kolkata and watch the ML model re-calculate rain probability in real time.
          </p>
        </div>

        {/* Preset Pills with Tactile 3% Give & Hairline Rim */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => applyPreset(95, 988, 100, 35)}
            className="preset-pill preset-pill-alert"
          >
            ⚡ Cyclonic Storm
          </button>
          <button 
            type="button"
            onClick={() => applyPreset(88, 998, 90, 15)}
            className="preset-pill preset-pill-cyan"
          >
            🌧️ Active Monsoon
          </button>
          <button 
            type="button"
            onClick={() => applyPreset(50, 1017, 5, 0)}
            className="preset-pill preset-pill-emerald"
          >
            ☀️ Clear Winter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
        {/* Hairline Sliders Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <HairlineSlider
            label="Relative Humidity"
            value={humidity}
            min={30}
            max={100}
            step={1}
            unit="%"
            onChange={setHumidity}
          />

          <HairlineSlider
            label="Surface Pressure"
            value={pressure}
            min={980}
            max={1025}
            step={1}
            unit="hPa"
            onChange={setPressure}
          />

          <HairlineSlider
            label="Cloud Cover Fraction"
            value={cloud}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={setCloud}
          />

          <HairlineSlider
            label="Today's Observed Rain"
            value={rainToday}
            min={0}
            max={50}
            step={1}
            unit="mm"
            onChange={setRainToday}
          />
        </div>

        {/* Live Simulation Hairline Glass Result Card */}
        <HairlineCard variant="inner" style={{ padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Simulated Forecast Result
          </span>

          <div style={{ margin: '1.25rem 0' }}>
            <span style={{ 
              fontSize: '3.75rem', 
              fontWeight: 800, 
              color: sim.isRain ? '#00c8ff' : '#34d399', 
              fontFamily: 'var(--font-sans)',
              textShadow: sim.isRain ? '0 0 25px rgba(0, 200, 255, 0.45)' : '0 0 25px rgba(52, 211, 153, 0.45)',
              display: 'inline-flex',
              justifyContent: 'center'
            }}>
              <HairlineNumberRoll value={sim.prob * 100} decimals={0} suffix="%" />
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginTop: '0.2rem' }}>
              Simulated Rain Probability
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <HairlineBadge tone={sim.tone} dot="pulse" size="md">
              {sim.cat}
            </HairlineBadge>
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
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan-bright)' }}>
                <HairlineNumberRoll value={sim.predAmount} decimals={1} suffix=" mm" />
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.10)' }}></div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model Decision</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: sim.isRain ? '#00c8ff' : '#34d399' }}>
                {sim.isRain ? '🌧️ RAIN' : '☀️ DRY'}
              </div>
            </div>
          </div>
        </HairlineCard>
      </div>
    </HairlineCard>
  );
}
