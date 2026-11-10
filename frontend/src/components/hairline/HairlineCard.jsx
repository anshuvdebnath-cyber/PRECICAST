import React from 'react';
import { EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · HairlineCard
 * Smoked inky optical glass surface with hairline specular edge lighting,
 * subtle inner bevel reflection, and smooth tactile elevation.
 */
export default function HairlineCard({
  children,
  className = '',
  style = {},
  variant = 'default', // 'default' | 'inner' | 'interactive'
  ...props
}) {
  const isInner = variant === 'inner';
  const isInteractive = variant === 'interactive';

  return (
    <div
      className={`hairline-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: isInner ? '18px' : '24px',
        padding: isInner ? '1.5rem' : '2.25rem',
        background: isInner ? 'rgba(3, 2, 12, 0.65)' : 'rgba(5, 4, 18, 0.68)',
        backdropFilter: 'blur(26px) saturate(200%)',
        WebkitBackdropFilter: 'blur(26px) saturate(200%)',
        borderTop: isInner ? '1px solid rgba(255, 255, 255, 0.32)' : '1px solid rgba(255, 255, 255, 0.45)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
        borderRight: '1px solid rgba(0, 0, 0, 0.75)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.85)',
        boxShadow: isInner
          ? '0 12px 30px -8px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.35)'
          : '0 24px 60px -15px rgba(0, 0, 0, 0.95), inset 0 1px 1px 0 rgba(255, 255, 255, 0.48), 0 0 32px -6px rgba(110, 110, 248, 0.22)',
        transition: isInteractive ? `all 280ms ${EASE_OUT}` : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

