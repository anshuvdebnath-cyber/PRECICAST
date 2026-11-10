import React, { useEffect, useState, useRef } from 'react';
import { EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · HairlineNumberRoll
 * Precision rolling odometer for numbers, decimals, and statistical telemetry.
 * Each digit rolls smoothly to its destination with cubic-bezier(0.16, 1, 0.3, 1).
 */
export default function HairlineNumberRoll({
  value = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 500,
  style = {},
  className = '',
}) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    if (startVal === endVal) return;

    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // EASE_OUT cubic-bezier(0.16, 1, 0.3, 1) approximation
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * ease;

      setDisplayedValue(current);

      if (progress < 1.0) {
        requestAnimationFrame(animate);
      } else {
        setDisplayedValue(endVal);
        prevValueRef.current = endVal;
      }
    }

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  const formattedStr = Number(displayedValue).toFixed(decimals);

  return (
    <span
      className={`hairline-number-roll ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {prefix && <span style={{ marginRight: '0.15em', opacity: 0.85 }}>{prefix}</span>}
      <span>{formattedStr}</span>
      {suffix && <span style={{ marginLeft: '0.15em', opacity: 0.85 }}>{suffix}</span>}
    </span>
  );
}

