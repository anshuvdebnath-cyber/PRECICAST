import React, { useState } from 'react';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import TextMorph from './hairline/text-morph';

export default function HairlineNewsletterFooter() {
  const brandLetters = ['P', 'r', 'e', 'c', 'i', 'c', 'a', 's', 't'];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <footer style={{ marginTop: '4rem', marginBottom: '2.5rem' }}>
      <HairlineCard style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem)', overflow: 'hidden', textAlign: 'center' }}>
        
        {/* Subtle Top Indicator & Context */}
        <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <HairlineBadge tone="rain" dot="pulse" size="md">
            <TextMorph>Atmospheric Intelligence &bull; Kolkata 22.57&deg;N, 88.36&deg;E</TextMorph>
          </HairlineBadge>
        </div>

        <h2 style={{ 
          fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', 
          fontWeight: 700, 
          color: '#ffffff', 
          letterSpacing: '-0.025em',
          lineHeight: 1.25,
          fontFamily: 'Outfit, sans-serif',
          maxWidth: '780px',
          margin: '0 auto 0.75rem auto'
        }}>
          Empirical Weather Intelligence for the Gangetic Delta
        </h2>

        <p style={{ 
          fontSize: '0.94rem', 
          color: 'var(--text-silver)', 
          lineHeight: 1.6,
          maxWidth: '640px',
          margin: '0 auto 3rem auto'
        }}>
          Bridging continuous multi-decadal Copernicus ERA5 reanalysis data with high-confidence calibrated machine learning models to forecast next-day precipitation dynamics.
        </p>

        {/* Big Interactive Precicast Typography with Per-Letter Glowing Physics */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            userSelect: 'none', 
            padding: '1.5rem 0 2rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            gap: 'clamp(0.15rem, 0.6vw, 0.6rem)',
            flexWrap: 'nowrap'
          }}
        >
          {brandLetters.map((char, idx) => {
            const isHovered = hoveredIndex === idx;
            const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1;

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  fontSize: 'clamp(4.2rem, 14vw, 11.5rem)',
                  fontWeight: 850,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.9,
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered 
                    ? 'translateY(-14px) scale(1.12)' 
                    : isNeighbor 
                      ? 'translateY(-6px) scale(1.04)' 
                      : 'translateY(0) scale(1)',
                  color: isHovered 
                    ? '#ffffff' 
                    : isNeighbor 
                      ? '#d9ebff' 
                      : 'rgba(255, 255, 255, 0.38)',
                  textShadow: isHovered
                    ? '0 0 25px rgba(255, 255, 255, 0.95), 0 0 50px rgba(138, 162, 255, 0.9), 0 0 85px rgba(82, 46, 230, 0.95), 0 0 120px rgba(56, 189, 248, 0.7)'
                    : isNeighbor
                      ? '0 0 20px rgba(138, 162, 255, 0.55), 0 0 40px rgba(82, 46, 230, 0.45)'
                      : '0 2px 14px rgba(0, 0, 0, 0.6)',
                  background: isHovered 
                    ? 'none' 
                    : isNeighbor 
                      ? 'none' 
                      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(138, 162, 255, 0.12) 100%)',
                  WebkitBackgroundClip: isHovered || isNeighbor ? 'unset' : 'text',
                  WebkitTextFillColor: isHovered || isNeighbor ? 'unset' : 'transparent',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Clean Bottom Metadata Specifications */}
        <div style={{ 
          marginTop: '2rem',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1.5rem',
          flexWrap: 'wrap',
          fontSize: '0.82rem', 
          color: 'var(--text-muted)', 
          fontWeight: 500,
          letterSpacing: '0.04em'
        }}>
          <span>16-Year ECMWF ERA5 Dataset (2010–2026)</span>
          <span>&bull;</span>
          <span>Compound Calibrated XGBoost</span>
          <span>&bull;</span>
          <span>83.16% Generalization Accuracy</span>
          <span>&bull;</span>
          <span>IMD Climatological Baseline</span>
        </div>

      </HairlineCard>
    </footer>
  );
}
