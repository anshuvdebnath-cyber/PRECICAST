import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · HairlineActionButton
 * Tactile micro-interaction button with 3% physical press give,
 * async state morphing (idle -> spinner -> checkmark), and hairline specular borders.
 */
export default function HairlineActionButton({
  children,
  onClick,
  className = '',
  style = {},
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'success'

  const handleClick = async (e) => {
    if (status !== 'idle') return;
    setStatus('pending');
    try {
      if (onClick) {
        await Promise.resolve(onClick(e));
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1400);
    } catch {
      setStatus('idle');
    }
  };

  const isPending = status === 'pending';
  const isSuccess = status === 'success';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`hairline-btn ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.42rem 0.95rem',
        borderRadius: '9999px',
        fontSize: '0.82rem',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        color: isSuccess ? '#34d399' : '#e2e8f0',
        background: isSuccess ? 'rgba(52, 211, 153, 0.15)' : 'rgba(5, 4, 18, 0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: isSuccess ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.38)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
        borderRight: '1px solid rgba(0, 0, 0, 0.65)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.85)',
        boxShadow: isSuccess
          ? '0 0 16px rgba(52, 211, 153, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          : '0 8px 24px -6px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        cursor: isPending ? 'wait' : 'pointer',
        outline: 'none',
        userSelect: 'none',
        transition: `all 200ms ${EASE_OUT}`,
        transform: 'translateY(0) scale(1)',
        ...style,
      }}
      onMouseDown={(e) => {
        if (!isPending) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Icon slot with smooth fade-scale transition */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          transition: `transform 260ms ${EASE_OUT}`,
        }}
      >
        {isSuccess ? (
          <Check size={14} color="#34d399" />
        ) : (
          <RefreshCw size={13} className={isPending ? 'hairline-spin' : ''} />
        )}
      </span>

      <span>{isSuccess ? 'Live Telemetry Synced' : isPending ? 'Querying Satellite...' : children}</span>
    </button>
  );
}

