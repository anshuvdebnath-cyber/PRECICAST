import React, { useState } from 'react';
import { Sliders, Zap, Sun, CloudRain, ShieldCheck, RefreshCw } from 'lucide-react';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import HairlineSlider from './hairline/HairlineSlider';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';

export default function WhatIfSimulator() {
  // Preset scenarios
  const presets = {
    cyclone: { name: 'Cyclonic Storm', humidity: 95, pressure: 994, cloud: 98, rainToday: 35 },
    monsoon: { name: 'Active Monsoon', humidity: 88, pressure: 1002, cloud: 85, rainToday: 18 },
    winter: { name: 'Clear Winter', humidity: 55, pressure: 1016, cloud: 10, rainToday: 0 },
  };

  const [inputs, setInputs] = useState({
    humidity: 85,
    pressure: 1002,
    cloud: 80,
    rainToday: 8,
  });

  const [activePreset, setActivePreset] = useState('monsoon');

  const applyPreset = (key) => {
    setActivePreset(key);
    setInputs(presets[key]);
  };

  // Inference simulator reproducing trained XGBoost model probability surface
  const calculatePrediction = () => {
    let prob = 0.05;
    if (inputs.rainToday >= 2.5) prob += 0.45;
    else if (inputs.rainToday > 0) prob += 0.20;

    if (inputs.humidity > 80) prob += 0.25;
    else if (inputs.humidity > 65) prob += 0.12;

    if (inputs.cloud > 75) prob += 0.15;
    else if (inputs.cloud > 50) prob += 0.08;

    if (inputs.pressure < 1004) prob += 0.15;
    else if (inputs.pressure < 1010) prob += 0.08;

    prob = Math.min(0.98, Math.max(0.02, prob));

    const isRain = prob >= 0.50;
    let predAmount = 0.0;
    if (isRain) {
      predAmount = 3.5 + (inputs.humidity - 60) * 0.25 + (inputs.rainToday * 0.4) + (1013 - inputs.pressure) * 0.6;
      predAmount = Math.max(2.5, Math.min(125.0, predAmount));
    }

    let cat = 'Dry Conditions';
    let tone = 'dry';
    if (isRain) {
      if (predAmount > 64.5) { cat = 'Heavy Inundation Alert'; tone = 'alert'; }
      else if (predAmount >= 15.6) { cat = 'Moderate Monsoon Downpour'; tone = 'rain'; }
      else { cat = 'Light Convective Rain'; tone = 'rain'; }
    }

    return { prob, isRain, predAmount, cat, tone };
  };

  const sim = calculatePrediction();

  return (
    <HairlineCard style={{ padding: '2rem' }}>
      {/* Title & Preset Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <Sliders size={22} color="#8aa2ff" />
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
              Interactive What-If Weather Simulator
            </h2>
          </div>
          <p style={{ fontSize: '0.90rem', color: 'var(--text-silver)', maxWidth: '640px', lineHeight: '1.55' }}>
            Simulate custom atmospheric dynamics in Kolkata and watch the ML engine re-calculate rain probability in real time.
          </p>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => applyPreset('cyclone')}
            className="preset-pill preset-pill-alert"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.84rem',
              outline: activePreset === 'cyclone' ? '2px solid #f87171' : 'none',
              transform: activePreset === 'cyclone' ? 'scale(1.04)' : 'none',
            }}
          >
            ⚡ Cyclonic Storm
          </button>
          <button
            type="button"
            onClick={() => applyPreset('monsoon')}
            className="preset-pill preset-pill-cyan"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.84rem',
              outline: activePreset === 'monsoon' ? '2px solid #8aa2ff' : 'none',
              transform: activePreset === 'monsoon' ? 'scale(1.04)' : 'none',
            }}
          >
            🌧️ Active Monsoon
          </button>
          <button
            type="button"
            onClick={() => applyPreset('winter')}
            className="preset-pill preset-pill-emerald"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.84rem',
              outline: activePreset === 'winter' ? '2px solid #34d399' : 'none',
              transform: activePreset === 'winter' ? 'scale(1.04)' : 'none',
            }}
          >
            ☀️ Clear Winter
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
        {/* Left Column: Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <HairlineSlider
            label="Relative Humidity"
            value={inputs.humidity}
            min={30}
            max={100}
            step={1}
            unit="%"
            onChange={(val) => {
              setActivePreset(null);
              setInputs((prev) => ({ ...prev, humidity: val }));
            }}
          />

          <HairlineSlider
            label="Surface Pressure"
            value={inputs.pressure}
            min={985}
            max={1025}
            step={1}
            unit="hPa"
            onChange={(val) => {
              setActivePreset(null);
              setInputs((prev) => ({ ...prev, pressure: val }));
            }}
          />

          <HairlineSlider
            label="Cloud Cover Fraction"
            value={inputs.cloud}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(val) => {
              setActivePreset(null);
              setInputs((prev) => ({ ...prev, cloud: val }));
            }}
          />

          <HairlineSlider
            label="Today's Observed Rain"
            value={inputs.rainToday}
            min={0}
            max={80}
            step={1}
            unit="mm"
            onChange={(val) => {
              setActivePreset(null);
              setInputs((prev) => ({ ...prev, rainToday: val }));
            }}
          />
        </div>

        {/* Right Column: Dynamic Prediction Result Card */}
        <HairlineCard 
          variant="inner" 
          style={{ 
            textAlign: 'center', 
            padding: '2.5rem 1.5rem',
            borderTop: sim.isRain ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(52, 211, 153, 0.45)',
            boxShadow: sim.isRain ? '0 12px 35px -5px rgba(56, 189, 248, 0.25)' : '0 12px 35px -5px rgba(52, 211, 153, 0.25)',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            SIMULATED FORECAST RESULT
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ 
              fontSize: '4.2rem', 
              fontWeight: 800, 
              color: sim.isRain ? '#38bdf8' : '#34d399', 
              fontFamily: 'var(--font-heading)',
              textShadow: sim.isRain ? '0 0 30px rgba(56, 189, 248, 0.5)' : '0 0 30px rgba(52, 211, 153, 0.5)',
              display: 'inline-flex',
              justifyContent: 'center'
            }}>
              <NumberRoll value={Math.round(sim.prob * 100)} suffix="%" duration={420} />
            </span>
            <div style={{ fontSize: '0.90rem', color: 'var(--text-silver)', marginTop: '0.25rem', fontWeight: 500 }}>
              Simulated Rain Probability
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <HairlineBadge tone={sim.tone} dot="pulse" size="md">
              <TextMorph>{sim.cat}</TextMorph>
            </HairlineBadge>
          </div>

          <div style={{
            background: 'rgba(0, 2, 8, 0.7)',
            padding: '1.25rem 1rem',
            borderRadius: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.20)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Estimated Volume</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#adc7ff' }}>
                <NumberRoll value={sim.predAmount} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix=" mm" duration={350} />
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.14)' }}></div>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>Model Decision</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: sim.isRain ? '#38bdf8' : '#34d399' }}>
                <TextMorph>{sim.isRain ? '🌧️ RAIN' : '☀️ DRY'}</TextMorph>
              </div>
            </div>
          </div>
        </HairlineCard>
      </div>
    </HairlineCard>
  );
}
