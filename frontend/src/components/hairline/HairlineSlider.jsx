import React, { useState, useRef } from 'react';
import { EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · HairlineSlider
 * Recessed hairline groove track with glowing liquid fill and floating bubble tooltip.
 * Smooth tactile drag and precision feedback adapted for atmospheric parameters.
 */
export default function HairlineSlider({
  label = '',
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange,
  className = '',
  style = {},
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handlePointer = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const rawPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = min + rawPct * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    const clampedVal = Math.max(min, Math.min(max, Number(steppedVal.toFixed(2))));
    if (onChange) onChange(clampedVal);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handlePointer(e.clientX);

    const onMove = (moveEvent) => {
      handlePointer(moveEvent.clientX);
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const showBubble = isDragging || isHovered;

  return (
    <div
      className={`hairline-slider-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label and Value Readout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.84rem', color: 'var(--text-silver)', fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan-bright)',
            background: 'rgba(110, 110, 248, 0.12)',
            padding: '0.15rem 0.55rem',
            borderRadius: '6px',
            border: '1px solid rgba(148, 174, 255, 0.25)',
          }}
        >
          {value} {unit}
        </span>
      </div>

      {/* Slider Interactive Track */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        {/* Recessed Hairline Groove */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '6px',
            borderRadius: '999px',
            background: 'rgba(2, 1, 8, 0.85)',
            borderTop: '1px solid rgba(0, 0, 0, 0.9)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Luminous Fill Band */}
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #5230e0 0%, #8aa2ff 100%)',
              boxShadow: '0 0 10px rgba(110, 110, 248, 0.5)',
              transition: isDragging ? 'none' : `width 160ms ${EASE_OUT}`,
            }}
          />
        </div>

        {/* Floating Bubble Value Tooltip */}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            top: '-26px',
            transform: 'translateX(-50%)',
            opacity: showBubble ? 1 : 0,
            pointerEvents: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            background: 'rgba(5, 4, 18, 0.90)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
            padding: '0.12rem 0.45rem',
            borderRadius: '6px',
            transition: `opacity 180ms ${EASE_OUT}, transform 180ms ${EASE_OUT}`,
            whiteSpace: 'nowrap',
          }}
        >
          {value} {unit}
        </div>

        {/* Tactile Metallic Circular Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            transform: `translateX(-50%) scale(${isDragging ? 1.15 : 1.0})`,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #d9ebff 45%, #8aa2ff 100%)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 12px rgba(138, 162, 255, 0.65)',
            transition: isDragging ? 'transform 100ms ease' : `left 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
          }}
        />
      </div>
    </div>
  );
}

