import React, { useState } from 'react';

export default function HairlineNewsletterFooter() {
  const brandLetters = ['P', 'r', 'e', 'c', 'i', 'c', 'a', 's', 't'];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <footer style={{ marginTop: '5rem', marginBottom: '3rem' }}>
      <div 
        style={{ 
          background: '#111114',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: 'clamp(1.75rem, 3.5vw, 2.5rem) clamp(1.25rem, 3.5vw, 2.5rem) clamp(2rem, 4vw, 3.25rem) clamp(1.25rem, 3.5vw, 2.5rem)',
          overflow: 'hidden',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.65)'
        }}
      >
        {/* Top Minimal Meta Bar: Copyright on Left, All Systems Normal Pill on Right */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            marginBottom: 'clamp(2.5rem, 5.5vw, 4.5rem)' 
          }}
        >
          {/* Left: Clean Brand Copyright */}
          <div style={{ fontSize: '0.88rem', color: '#71717a', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            <span>&copy; {new Date().getFullYear()} Precicast</span>
          </div>

          {/* Right: All Systems Normal Status Pill */}
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.55rem', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '9999px', 
              padding: '0.35rem 0.85rem', 
              fontSize: '0.78rem', 
              color: '#d4d4d8',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            <span 
              style={{ 
                display: 'inline-block', 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#22c55e'
              }} 
            />
            <span>All systems normal</span>
          </div>
        </div>

        {/* Big Signature Typography: Connected Letters with Subtle Soft Diminishing Glow */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline',
            userSelect: 'none', 
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0.85
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {brandLetters.map((char, idx) => {
            const isHovered = hoveredIndex === idx;

            // Soft, understated glow (low brightness, refined atmospheric sheen)
            const fillStyle = isHovered ? '#f4f4f5' : 'transparent';
            const strokeStyle = isHovered ? '0px transparent' : '1.5px rgba(255, 255, 255, 0.22)';
            const shadowStyle = isHovered 
              ? '0 0 16px rgba(255, 255, 255, 0.45), 0 0 32px rgba(160, 180, 255, 0.22)' 
              : 'none';

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  // Connected letters, enlarged hero typography
                  fontSize: 'clamp(4.5rem, 15.5vw, 16.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  margin: '0 -0.015em',
                  fontFamily: 'Outfit, sans-serif',
                  color: fillStyle,
                  WebkitTextStroke: strokeStyle,
                  textShadow: shadowStyle,
                  // Responsive ignition on hover (140ms); gentle, slow fade out (850ms) when cursor leaves
                  transition: isHovered 
                    ? 'color 140ms ease-out, text-shadow 140ms ease-out, -webkit-text-stroke 140ms ease-out' 
                    : 'color 850ms cubic-bezier(0.16, 1, 0.3, 1), text-shadow 850ms cubic-bezier(0.16, 1, 0.3, 1), -webkit-text-stroke 850ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

      </div>
    </footer>
  );
}
