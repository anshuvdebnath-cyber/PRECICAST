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
          padding: 'clamp(1.75rem, 3.5vw, 2.5rem) clamp(1.25rem, 3.5vw, 2.5rem) clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3.5vw, 2.5rem)',
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

        {/* Big Signature Typography (Exact Kept Replica: Hollow Stroke Outlines with Solid Fill Wave on Hover) */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline',
            userSelect: 'none', 
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0.88
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {brandLetters.map((char, idx) => {
            const isHovered = hoveredIndex === idx;
            const dist = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

            // Exact reproduction of Kept reference screenshot:
            // - Active hovered letter: solid crisp off-white (#f4f4f5, no stroke)
            // - Immediate neighbor (dist === 1): solid medium gray (#52525b, no stroke)
            // - Distant letters (dist >= 2 or unhovered): hollow stroke outline only
            let fillStyle = 'transparent';
            let strokeStyle = '1.5px rgba(255, 255, 255, 0.22)';
            
            if (isHovered) {
              fillStyle = '#f4f4f5';
              strokeStyle = 'none';
            } else if (dist === 1) {
              fillStyle = '#52525b';
              strokeStyle = 'none';
            }

            return (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  cursor: 'pointer',
                  padding: '0 clamp(0.12rem, 0.85vw, 0.95rem)',
                  fontSize: 'clamp(4rem, 14.5vw, 16.5rem)',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  color: fillStyle,
                  WebkitTextStroke: strokeStyle,
                  transition: 'color 140ms ease, -webkit-text-stroke 140ms ease'
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
