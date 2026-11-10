import React, { useRef, useState, useEffect, useId, useCallback, useLayoutEffect } from 'react';
import { createSpring, rubberBand, EASE_OUT } from './interaction-motion';

/**
 * Hairline UI · LiquidTabs
 * Exact implementation of https://hairlineui.com/r/liquid-tabs.json
 * 
 * Mechanics:
 * - Surface Tension Spring Physics: As the highlight moves, the front edge leads (stiffness: 620, damping: 49.8)
 *   and the trailing edge follows (stiffness: 380, damping: 39). The highlight draws out and its waist pinches,
 *   then settles into a pill again.
 * - Dynamic SVG Path & Sheen: Evaluated per frame without layout thrashing.
 * - Exact Letter Clipping: An illuminated text copy is clipped to the exact liquid path so letters turn
 *   pure white precisely as the liquid drop sweeps under them.
 * - Harmonized with PRECICAST Aurora Palette (#5230e0 -> #8aa2ff -> #d9ebff).
 */

const FRONT = { stiffness: 620, damping: 49.8 };
const BEHIND = { stiffness: 380, damping: 39 };
const WIDTH = { stiffness: 450, damping: 42.4 };

const REACH = 0.45;
const PINCH = 0.20;

const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
const n1 = (n) => Math.round(n * 100) / 100;

function half(capX, tipX, top, bottom, thin, side) {
  const cy = (top + bottom) / 2;
  const r = Math.min((bottom - top) / 2, Math.abs(tipX - capX));
  const start = capX + side * r;
  const pull = (tipX - start) * 0.56;
  const edge = (y, tipY) => `${n1(start + pull)} ${n1(y)} ${n1(tipX - pull)} ${n1(tipY)} ${n1(tipX)} ${n1(tipY)}`;
  const sweep = side === 1 ? 1 : 0;
  return {
    start: { x: n1(start), top: n1(cy - r), bottom: n1(cy + r) },
    r: n1(r),
    sweep,
    toTip: { top: edge(cy - r, cy - thin), bottom: edge(cy + r, cy + thin) },
    backTop: `${n1(tipX - pull)} ${n1(cy - thin)} ${n1(start + pull)} ${n1(cy - r)} ${n1(start)} ${n1(cy - r)}`,
    backBottom: `${n1(tipX - pull)} ${n1(cy + thin)} ${n1(start + pull)} ${n1(cy + r)} ${n1(start)} ${n1(cy + r)}`,
  };
}

export function liquidPath(left, right, rest, top, bottom) {
  const height = bottom - top;
  const width = right - left;
  const mid = (left + right) / 2;
  const drawn = clamp((width - rest) / (height * REACH || 1), 0, 1);
  const thin = (height / 2) * (1 - PINCH * drawn * (2 - drawn));
  const a = half(left, mid, top, bottom, thin, 1);
  const c = half(right, mid, top, bottom, thin, -1);
  return (
    `M${a.start.x} ${a.start.top}C${a.toTip.top}C${c.backTop}` +
    `A${c.r} ${c.r} 0 0 1 ${c.start.x} ${c.start.bottom}` +
    `C${c.toTip.bottom}C${a.backBottom}` +
    `A${a.r} ${a.r} 0 0 1 ${a.start.x} ${a.start.top}Z`
  );
}

export default function HairlineLiquidTabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  style = {},
}) {
  const [measured, setMeasured] = useState(false);
  const [hovered, setHovered] = useState(null);

  const rowRef = useRef(null);
  const pathRef = useRef(null);
  const sheenRef = useRef(null);
  const lightRef = useRef(null);
  const flowRef = useRef(null);
  
  const flowId = useId();
  const sheenId = useId();
  const springs = useRef(null);
  const motion = useRef({ top: 0, bottom: 0, heading: 1, target: 0, flowing: false, frontFrom: 0, tailFrom: 0, tailTo: 0 });
  const marks = useRef(new Map());

  const paint = useCallback(() => {
    const s = springs.current;
    if (!s) return;
    const m = motion.current;
    const rest = s.rest.get();
    const height = m.bottom - m.top;
    if (height <= 0) return;
    
    const most = rest + height * REACH;
    let left = s.left.get();
    let right = s.right.get();

    // Long jump surface tension rubber band limiting
    const over = right - left - most;
    if (over > 0) {
      const kept = rubberBand(over, height * 0.3);
      if (m.heading > 0) left = right - most - kept;
      else right = left + most + kept;
    }

    const d = liquidPath(left, right, rest, m.top, m.bottom);
    if (pathRef.current) pathRef.current.setAttribute('d', d);
    if (sheenRef.current) sheenRef.current.setAttribute('d', d);
    if (lightRef.current) lightRef.current.style.clipPath = `path("${d}")`;
  }, []);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return false;
    marks.current.clear();
    const els = row.querySelectorAll('[data-liquid-tab]');
    if (els.length === 0) return false;

    els.forEach((el) => {
      const tabId = el.getAttribute('data-liquid-tab');
      marks.current.set(tabId, { x: el.offsetLeft, w: el.offsetWidth });
      motion.current.top = el.offsetTop;
      motion.current.bottom = el.offsetTop + el.offsetHeight;
    });
    return true;
  }, []);

  const aim = useCallback((next, instant) => {
    const s = springs.current;
    const mark = next ? marks.current.get(next) : undefined;
    if (!s || !mark) return;
    const m = motion.current;
    const end = mark.x + mark.w;

    if (instant) {
      m.flowing = false;
      s.left.jump(mark.x);
      s.right.jump(end);
      s.rest.jump(mark.w);
      paint();
      return;
    }

    const heading = mark.x + mark.w / 2 >= (s.left.get() + s.right.get()) / 2 ? 1 : -1;
    m.heading = heading;
    m.target = heading > 0 ? end : mark.x;
    m.frontFrom = heading > 0 ? s.right.get() : s.left.get();
    m.tailFrom = heading > 0 ? s.left.get() : s.right.get();
    m.tailTo = heading > 0 ? mark.x : end;
    m.flowing = true;

    // Asymmetric lead/trail spring tuning
    (heading > 0 ? s.right : s.left).configure(FRONT);
    (heading > 0 ? s.left : s.right).configure(BEHIND);

    s.left.set(mark.x);
    s.right.set(end);
    s.rest.set(mark.w);
    paint();
  }, [paint]);

  // Initial measurement and window resize listener
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || !measure()) return;

    const start = activeTab ? marks.current.get(activeTab) : undefined;
    const s = {
      left: createSpring(start?.x ?? 0, FRONT, paint),
      right: createSpring(start ? start.x + start.w : 0, BEHIND, paint),
      rest: createSpring(start?.w ?? 0, WIDTH, paint),
    };
    springs.current = s;
    paint();
    setMeasured(true);

    const observer = new ResizeObserver(() => {
      measure();
      aim(activeTab, true);
    });
    observer.observe(row);

    return () => {
      observer.disconnect();
      s.left.stop();
      s.right.stop();
      s.rest.stop();
      springs.current = null;
    };
  }, [measure, aim, paint, activeTab, tabs.length]);

  // Smooth flight when active tab changes
  const prevTabRef = useRef(activeTab);
  useLayoutEffect(() => {
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;
    measure();
    aim(activeTab, false);
  }, [activeTab, aim, measure]);

  const onKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;

    if (next >= 0) {
      e.preventDefault();
      onTabChange(tabs[next].id);
    }
  };

  return (
    <div
      className={`hairline-liquid-tabs-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(2, 1, 8, 0.75)',
        padding: '0.22rem 0.32rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4)',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        ref={rowRef}
        role="tablist"
        aria-label="Navigation Tabs"
        onKeyDown={onKeyDown}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
        }}
      >
        {/* Layer 1: Dark / Muted copy of all tab labels */}
        <div
          aria-hidden="true"
          style={{
            gridArea: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.20rem',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isHovered = hovered === tab.id;
            return (
              <span
                key={tab.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.90rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  color: isHovered ? '#ffffff' : 'var(--text-muted)',
                  transition: `color 180ms ${EASE_OUT}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {Icon && <Icon size={15} style={{ opacity: 0.75 }} />}
                <span>{tab.label}</span>
              </span>
            );
          })}
        </div>

        {/* Layer 2: Liquid Drop SVG with Dynamic Surface Tension & Sheen */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
            opacity: measured ? 1 : 0,
            filter: 'drop-shadow(0 4px 16px rgba(110, 110, 248, 0.45))',
          }}
        >
          <defs>
            <linearGradient ref={flowRef} id={flowId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8aa2ff" stopOpacity="0.40" />
              <stop offset="60%" stopColor="#5230e0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1a0866" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path ref={pathRef} fill={`url(#${flowId})`} />
          <path ref={sheenRef} fill={`url(#${sheenId})`} />
        </svg>

        {/* Layer 3: Light illuminated copy of tab labels clipped exactly to the liquid drop outline */}
        <div
          ref={lightRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.20rem',
            pointerEvents: 'none',
            visibility: measured ? 'visible' : 'hidden',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <span
                key={tab.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.90rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  fontWeight: 650,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 8px rgba(138, 162, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.4)',
                }}
              >
                {Icon && <Icon size={15} style={{ opacity: 1 }} />}
                <span>{tab.label}</span>
              </span>
            );
          })}
        </div>

        {/* Layer 4: Interactive Transparent Tab Buttons for Focus & Clicks */}
        <div
          style={{
            gridArea: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.20rem',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-liquid-tab={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                onMouseEnter={() => setHovered(tab.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.90rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 650 : 500,
                  color: 'transparent', // Text is visually painted by Layer 1 & Layer 3
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                  transform: 'scale(1)',
                  transition: `transform 140ms ${EASE_OUT}`,
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Transparent placeholder sizing */}
                {Icon && <span style={{ width: '15px', height: '15px' }} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
