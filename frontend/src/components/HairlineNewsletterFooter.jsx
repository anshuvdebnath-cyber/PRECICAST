import React, { useState } from 'react';

export default function HairlineNewsletterFooter() {
  const brandLetters = ['P', 'r', 'e', 'c', 'i', 'c', 'a', 's', 't'];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <footer style={{ marginTop: '5.5rem', marginBottom: '3.5rem' }}>
      <div 
        style={{ 
          background: 'rgba(7, 5, 20, 0.82)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.28)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          borderRight: '1px solid rgba(0, 0, 0, 0.75)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.85)',
          borderRadius: '26px',
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3.5vw, 2.75rem) clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 3.5vw, 2.75rem)',
          overflow: 'hidden',
          boxShadow: '0 28px 70px -15px rgba(0, 0, 0, 0.95), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)'
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
            marginBottom: 'clamp(3rem, 6.5vw, 5.5rem)' 
          }}
        >
          {/* Left: Clean Brand Copyright */}
          <div style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            <span>&copy; {new Date().getFullYear()} Precicast &bull; Kolkata Atmospheric Intelligence Engine</span>
          </div>

          {/* Right: All Systems Normal Status Pill */}
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.55rem', 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              borderRadius: '9999px', 
              padding: '0.4rem 0.95rem', 
              fontSize: '0.80rem', 
              color: '#d4d4d8',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            <span 
              style={{ 
                display: 'inline-block', 
                width: '6.5px', 
                height: '6.5px', 
                borderRadius: '50%', 
                background: '#22c55e',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.75)'
              }} 
            />
            <span>All systems normal</span>
          </div>
        </div>

        {/* Big Signature Typography: Connected Letters with Extra-Large Scale & Gentle Atmospheric Sheen */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline',
            userSelect: 'none', 
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0.80
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {brandLetters.map((char, idx) => {
            const isHovered = hoveredIndex === idx;

            // Soft atmospheric illumination (matte off-white, ambient periwinkle/violet halo)
            const fillStyle = isHovered ? '#f1f5f9' : 'transparent';
            const strokeStyle = isHovered ? '0px transparent' : '1.5px rgba(255, 255, 255, 0.22)';
            const shadowStyle = isHovered 
              ? '0 0 16px rgba(173, 199, 255, 0.40), 0 0 35px rgba(122, 142, 252, 0.22)' 
              : 'none';

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                style={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  // Extra-large scale hero typography with snug connected letter spacing
                  fontSize: 'clamp(5.5rem, 19.5vw, 21.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.045em',
                  margin: '0 -0.02em',
                  fontFamily: 'Outfit, sans-serif',
                  color: fillStyle,
                  WebkitTextStroke: strokeStyle,
                  textShadow: shadowStyle,
                  // Smooth responsive illumination on hover (140ms); gentle, slow fade out (850ms) when cursor leaves
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
