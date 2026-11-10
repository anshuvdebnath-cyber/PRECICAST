import React, { useState } from 'react';
import { Send, CheckCircle2, Satellite, Cpu, Compass, ShieldCheck } from 'lucide-react';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import HairlineActionButton from './hairline/HairlineActionButton';
import TextMorph from './hairline/text-morph';

export default function HairlineNewsletterFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  return (
    <footer style={{ marginTop: '3.5rem', marginBottom: '2rem' }}>
      <HairlineCard style={{ padding: 'clamp(1.75rem, 3.5vw, 3rem)', overflow: 'hidden' }}>
        
        {/* Newsletter & Real-Time Alert Broadcast Unit */}
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
            <HairlineBadge tone="rain" dot="pulse" size="md">
              <TextMorph>Atmospheric Telemetry Dispatches</TextMorph>
            </HairlineBadge>
          </div>

          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', 
            fontWeight: 700, 
            color: '#ffffff', 
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            fontFamily: 'Outfit, sans-serif'
          }}>
            Synchronize with Kolkata Microclimate &amp; Precipitation Forecasts
          </h2>

          <p style={{ 
            fontSize: '0.90rem', 
            color: 'var(--text-silver)', 
            marginTop: '0.65rem', 
            lineHeight: 1.55,
            maxWidth: '560px',
            margin: '0.65rem auto 1.5rem auto'
          }}>
            Receive automated notifications for high-confidence convective precipitation alerts, Southwest monsoon surges, and reanalysis model updates.
          </p>

          <form onSubmit={handleSubmit} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(3, 2, 14, 0.82)', 
            border: '1px solid rgba(255, 255, 255, 0.16)', 
            borderRadius: '9999px', 
            padding: '0.35rem 0.45rem 0.35rem 1.15rem',
            boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            maxWidth: '520px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={subscribed ? "✓ Telemetry Channel Activated" : "Enter observational email address..."}
              disabled={subscribed}
              style={{
                flex: '1 1 200px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontFamily: 'DM Sans, sans-serif',
                padding: '0.4rem 0.2rem'
              }}
            />
            <HairlineActionButton 
              variant="primary"
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.82rem', gap: '0.45rem' }}
            >
              {subscribed ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-300" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Subscribe</span>
                </>
              )}
            </HairlineActionButton>
          </form>
        </div>

        {/* Project Architecture & Engineering Specifications Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.25rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.10)',
          marginBottom: '2.5rem'
        }}>
          <HairlineCard variant="inner" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', marginBottom: '0.4rem' }}>
              <Satellite size={17} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Copernicus ERA5
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
              16 continuous years (2010–2026) of verified ECMWF hourly reanalysis comprising 6,153 continuous calendar days.
            </p>
          </HairlineCard>

          <HairlineCard variant="inner" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', marginBottom: '0.4rem' }}>
              <Cpu size={17} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Compound Pipeline
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
              Two-stage calibrated XGBoost architecture resolving zero-inflation bias with 83.16% test accuracy and 0.9126 ROC-AUC.
            </p>
          </HairlineCard>

          <HairlineCard variant="inner" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', marginBottom: '0.4rem' }}>
              <Compass size={17} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Delta Microclimate
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
              Precision grid coordinates at 22.57°N, 88.36°E capturing lower Gangetic moisture convergence and Bay of Bengal advection.
            </p>
          </HairlineCard>

          <HairlineCard variant="inner" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.4rem' }}>
              <ShieldCheck size={17} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Strict Generalization
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-silver)', lineHeight: 1.5 }}>
              Evaluated strictly across 1,039 forward unseen future test days (2024–2026) with zero temporal leakage.
            </p>
          </HairlineCard>
        </div>

        {/* Big Signature Editorial Precicast Watermark */}
        <div style={{ 
          textAlign: 'center', 
          userSelect: 'none', 
          cursor: 'default',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div 
            style={{ 
              fontSize: 'clamp(3.5rem, 11vw, 8.5rem)', 
              fontWeight: 800, 
              letterSpacing: '-0.045em',
              lineHeight: 0.9,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(138, 162, 255, 0.08) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.75rem'
            }}
          >
            Precicast
          </div>

          <div style={{ 
            fontSize: '0.78rem', 
            color: 'var(--text-muted)', 
            letterSpacing: '0.06em', 
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            Atmospheric Intelligence &bull; Next-Day Rainfall AI Engine &bull; Kolkata 22.57&deg;N, 88.36&deg;E
          </div>
        </div>

      </HairlineCard>
    </footer>
  );
}
