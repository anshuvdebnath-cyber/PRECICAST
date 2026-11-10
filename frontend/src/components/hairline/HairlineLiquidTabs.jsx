import React, { useRef, useState, useEffect } from 'react';
import { EASE_OUT, EASE_THROW } from './interaction-motion';

/**
 * Hairline UI · HairlineLiquidTabs
 * Signature liquid tabs where the active pill indicator smoothly glides
 * across tabs with physical surface tension and tactile 3% press give.
 */
export default function HairlineLiquidTabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className={`hairline-liquid-tabs ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        background: 'rgba(2, 1, 8, 0.72)',
        padding: '0.25rem 0.35rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4)',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Sliding Fluid Indicator Pill */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(138, 162, 255, 0.35) 0%, rgba(82, 48, 224, 0.40) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.65)',
          borderBottom: '1px solid rgba(138, 162, 255, 0.35)',
          boxShadow: '0 6px 20px -3px rgba(110, 110, 248, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.60)',
          pointerEvents: 'none',
          opacity: indicatorStyle.opacity,
          transition: `left 320ms ${EASE_THROW}, width 280ms ${EASE_OUT}, opacity 200ms ease`,
        }}
      />

      {/* Tabs */}
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.90rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.84rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: `color 200ms ${EASE_OUT}`,
              whiteSpace: 'nowrap',
              textShadow: isActive ? '0 1px 8px rgba(138, 162, 255, 0.65)' : 'none',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {Icon && <Icon size={15} style={{ opacity: isActive ? 1 : 0.8 }} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

