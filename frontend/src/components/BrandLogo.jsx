import React from 'react';

/**
 * BrandLogo: Minimalist Optical Wave Monogram for PRECICAST
 * 
 * Design Characteristics:
 * - Ultra-minimalist optical geometry: Intersecting parabolic isobar waves with periwinkle-ice focal point.
 * - Refined Typography: Clean tracking (0.09em), Instrument Sans font, pure white with subtle specular sheen.
 */
export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', userSelect: 'none', cursor: 'default' }}>
      {/* Prismatic Optical Insignia */}
      <div 
        style={{
          position: 'relative',
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'rgba(5, 4, 18, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.48)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.22)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
          borderRight: '1px solid rgba(0, 0, 0, 0.6)',
          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoRefraction" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d9ebff" />
              <stop offset="50%" stopColor="#8aa2ff" />
              <stop offset="100%" stopColor="#5230e0" />
            </linearGradient>
            <linearGradient id="specularRim" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Dual Intersecting Atmospheric Isobar Waves */}
          <path 
            d="M3 14.5C6 11 10 11 13 14.5C16 18 20 18 22 14.5" 
            stroke="url(#logoRefraction)" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M3 9.5C6 6 10 6 13 9.5C16 13 20 13 22 9.5" 
            stroke="url(#specularRim)" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.85"
          />

          {/* Optical Refractive Core */}
          <circle cx="13" cy="9.5" r="2.2" fill="#8aa2ff" />
          <circle cx="13" cy="9.5" r="1.0" fill="#ffffff" />
        </svg>

        {/* Specular Glint Top Corner */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 80%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Brand Typography */}
      <span 
        style={{ 
          fontSize: '1.15rem', 
          fontWeight: 700, 
          letterSpacing: '0.09em',
          color: '#ffffff',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
        }}
      >
        PRECICAST
      </span>
    </div>
  );
}
