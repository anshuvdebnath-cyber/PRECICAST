import React from 'react';

/**
 * BrandLogo: Pure Minimalist Typography for precicast
 * Features lowercase editorial Outfit typography, crisp letter-spacing, and subtle specular glow.
 */
export default function BrandLogo() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', userSelect: 'none', cursor: 'default' }}>
      <span 
        style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          letterSpacing: '-0.035em',
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1,
          textShadow: '0 2px 14px rgba(138, 162, 255, 0.45), 0 1px 2px rgba(0, 0, 0, 0.8)',
          padding: '0.1rem 0.4rem',
        }}
      >
        Precicast
      </span>
    </div>
  );
}
