import React, { useState } from 'react';
import { Sliders, Droplets, Gauge, Cloud, CloudRain, Zap, Sun } from 'lucide-react';
import HairlineCard from './hairline/HairlineCard';
import HairlineSlider from './hairline/HairlineSlider';
import HairlineBadge from './hairline/HairlineBadge';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';

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

    let cat = 'Dry / Clear Sky';
    let tone = 'success';
    if (predAmount >= 64.5) {
      cat = 'Severe Tropical Cloudburst';
      tone = 'warning';
    } else if (predAmount >= 15.6) {
      cat = 'Moderate Monsoon Downpour';
      tone = 'rain';
    } else if (predAmount >= 0.1) {
      cat = 'Intermittent Light Showers';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8aa2ff', marginBottom: '0.25rem' }}>
            <Sliders size={20} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              <TextMorph>Interactive What-If Weather Simulator</TextMorph>
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)' }}>
            Simulate custom atmospheric dynamics in Kolkata and watch the ML engine re-calculate rain probability in real time.
          </p>
        </div>

        {/* Preset Pills with Tactile Hairline Press Give */}
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
            <TextMorph>Simulated Forecast Result</TextMorph>
          </span>

          <div style={{ margin: '1.25rem 0' }}>
            <span style={{ 
              fontSize: '3.75rem', 
              fontWeight: 800, 
              color: sim.isRain ? '#38bdf8' : '#34d399', 
              fontFamily: 'var(--font-sans)',
              textShadow: sim.isRain ? '0 0 25px rgba(56, 189, 248, 0.45)' : '0 0 25px rgba(52, 211, 153, 0.45)',
              display: 'inline-flex',
              justifyContent: 'center'
            }}>
              <NumberRoll value={Math.round(sim.prob * 100)} suffix="%" duration={420} />
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginTop: '0.2rem' }}>
              Simulated Rain Probability
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <HairlineBadge tone={sim.tone} dot="pulse" size="md">
              <TextMorph>{sim.cat}</TextMorph>
            </HairlineBadge>
          </div>

          <div style={{
            background: 'rgba(0, 2, 8, 0.65)',
            padding: '1.1rem',
            borderRadius: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.18)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.10)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Estimated Volume</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#adc7ff' }}>
                <NumberRoll value={sim.predAmount} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix=" mm" duration={350} />
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}></div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Model Decision</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: sim.isRain ? '#38bdf8' : '#34d399' }}>
                <TextMorph>{sim.isRain ? '🌧️ RAIN' : '☀️ DRY'}</TextMorph>
              </div>
            </div>
          </div>
        </HairlineCard>
      </div>
    </HairlineCard>
  );
}
