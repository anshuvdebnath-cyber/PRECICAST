import React from 'react';
import { EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · HairlineBadge
 * Ultra-crisp status badge with breathing live dots, hairline borders, and fluid tone easing.
 * Adapted for PRECICAST Aurora color spectrum.
 */
export default function HairlineBadge({
  children,
  tone = 'neutral',
  dot = false,
  icon = null,
  size = 'md',
  className = '',
  style = {},
}) {
  const tones = {
    rain: {
      color: '#adc7ff',
      bg: 'rgba(110, 110, 248, 0.16)',
      border: 'rgba(148, 174, 255, 0.36)',
      dotColor: '#8094fc',
      glow: '0 0 12px rgba(110, 110, 248, 0.35)',
    },
    success: {
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.14)',
      border: 'rgba(52, 211, 153, 0.36)',
      dotColor: '#34d399',
      glow: '0 0 12px rgba(52, 211, 153, 0.30)',
    },
    warning: {
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.14)',
      border: 'rgba(251, 191, 36, 0.36)',
      dotColor: '#fbbf24',
      glow: '0 0 12px rgba(251, 191, 36, 0.30)',
    },
    neutral: {
      color: '#e2e8f0',
      bg: 'rgba(255, 255, 255, 0.07)',
      border: 'rgba(255, 255, 255, 0.15)',
      dotColor: '#94a3b8',
      glow: 'none',
    },
  };

  const t = tones[tone] || tones.neutral;
  const isSm = size === 'sm';

  return (
    <span
      className={`hairline-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '0.35rem' : '0.45rem',
        padding: isSm ? '0.18rem 0.55rem' : '0.28rem 0.75rem',
        borderRadius: '9999px',
        fontSize: isSm ? '0.70rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        fontFamily: 'var(--font-sans)',
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.12), ${t.glow}`,
        transition: `background 240ms ${EASE_OUT}, border-color 240ms ${EASE_OUT}, color 240ms ${EASE_OUT}`,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isSm ? '6px' : '7px',
            height: isSm ? '6px' : '7px',
          }}
        >
          {dot === 'pulse' && (
            <span
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: t.dotColor,
                opacity: 0.75,
                animation: 'hairline-pulse 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
          )}
          <span
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: t.dotColor,
            }}
          />
        </span>
      )}
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

