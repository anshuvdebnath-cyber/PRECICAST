// Hairline UI · number-roll · MIT License
// Copyright (c) 2026 Hairline UI · https://hairlineui.com/license#components

"use client";

import * as React from "react";

export interface NumberRollProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  format?: Intl.NumberFormatOptions;
  locales?: string | string[];
  prefix?: string;
  suffix?: string;
  from?: number;
  duration?: number;
  direction?: "up" | "down";
}

type Column = { key: string; char: string; digit: number | null };

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const SETS = 5;
const MIDDLE = 20;
const STRIP = Array.from({ length: SETS * 10 }, (_, i) => i % 10).join("\n");

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useReducedMotion = () =>
  React.useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);

const HYDRATION_LOCALE = "en-US";
const subscribeNothing = () => () => {};
const useHydrated = () =>
  React.useSyncExternalStore(subscribeNothing, () => true, () => false);

function columns(text: string): Column[] {
  const chars = [...text];
  const seen = new Map<string, number>();
  let place = 0;
  const out: Column[] = [];
  for (let i = chars.length - 1; i >= 0; i--) {
    const char = chars[i];
    if (/\d/.test(char)) {
      out.push({ key: `d${place++}`, char, digit: Number(char) });
    } else {
      const n = seen.get(char) ?? 0;
      seen.set(char, n + 1);
      out.push({ key: `s${char}${n}`, char, digit: null });
    }
  }
  return out.reverse();
}

const Digit = React.memo(function Digit({
  digit,
  trend,
  duration,
  reduced,
}: {
  digit: number;
  trend: number;
  duration: number;
  reduced: boolean;
}) {
  const posRef = React.useRef(MIDDLE + digit);
  const stripRef = React.useRef<HTMLSpanElement>(null);

  const place = React.useCallback(
    (pos: number, animate: boolean) => {
      const strip = stripRef.current;
      if (!strip) return;
      strip.style.transition = animate ? `transform ${duration}ms ${EASE}` : "none";
      strip.style.transform = `translateY(${(-pos * 100) / (SETS * 10)}%)`;
    },
    [duration],
  );

  React.useLayoutEffect(() => {
    const current = posRef.current;
    const showing = ((current % 10) + 10) % 10;
    if (showing === digit) return;
    if (reduced) {
      posRef.current = MIDDLE + digit;
      place(posRef.current, false);
      return;
    }
    const up = trend > 0 || (trend === 0 && digit > showing);
    let target = up ? current + ((digit - showing + 10) % 10) : current - ((showing - digit + 10) % 10);
    if (target < 10 || target > SETS * 10 - 11) {
      const shift = Math.round((target - MIDDLE) / 10) * 10;
      const strip = stripRef.current;
      if (strip?.offsetHeight) {
        let visual = current;
        try {
          visual = -new DOMMatrixReadOnly(getComputedStyle(strip).transform).m42 / (strip.offsetHeight / (SETS * 10));
        } catch {}
        strip.style.transition = "none";
        strip.style.transform = `translateY(${(-(visual - shift) * 100) / (SETS * 10)}%)`;
        void strip.offsetHeight;
      }
      target -= shift;
    }
    posRef.current = target;
    place(target, true);
  }, [digit, trend, reduced, place]);

  const settle = () => {
    posRef.current = MIDDLE + (((posRef.current % 10) + 10) % 10);
    place(posRef.current, false);
  };

  return (
    <span 
      className="relative inline-flex items-center justify-center overflow-hidden tabular-nums select-none"
      style={{
        height: '1.14em',
        width: '0.62em',
        verticalAlign: 'baseline',
        clipPath: 'inset(0)',
      }}
    >
      <span className="invisible select-none leading-none" aria-hidden="true">0</span>
      <span
        ref={stripRef}
        aria-hidden="true"
        onTransitionEnd={settle}
        className="absolute inset-x-0 top-0 block whitespace-pre text-center select-none"
        style={{
          lineHeight: '1.14em',
          transform: `translateY(${(-(MIDDLE + digit) * 100) / (SETS * 10)}%)`,
          willChange: 'transform',
        }}
      >
        {STRIP}
      </span>
    </span>
  );
});

export function NumberRoll({ 
  value, 
  format, 
  locales, 
  prefix = "", 
  suffix = "", 
  from, 
  duration = 700, 
  direction, 
  className = "", 
  ...props 
}: NumberRollProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(from !== undefined ? from : value);

  React.useEffect(() => {
    if (from !== undefined && from !== value) {
      const frame = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(frame);
    } else {
      setShown(value);
    }
  }, [value, from]);

  const hydrated = useHydrated();
  const locale = locales ?? (hydrated ? undefined : HYDRATION_LOCALE);
  const localeKey = String(locale);
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, format), [localeKey, format && JSON.stringify(format)]); // eslint-disable-line react-hooks/exhaustive-deps
  const text = `${prefix}${formatter.format(shown)}${suffix}`;
  const cols = React.useMemo(() => columns(text), [text]);

  const lastRef = React.useRef({ text, cols, shown, localeKey, moved: 0 });
  const prev = lastRef.current;
  const changed = prev.text !== text || prev.shown !== shown || prev.localeKey !== localeKey;

  const view = React.useMemo(() => {
    if (!changed) return prev;
    const nextView = {
      text,
      cols,
      shown,
      localeKey,
      moved: Math.sign((shown || 0) - (prev.shown || 0)),
    };
    lastRef.current = nextView;
    return nextView;
  }, [text, cols, shown, localeKey, changed, prev]);

  const still = reduced;
  const trend = direction === "up" ? 1 : direction === "down" ? -1 : (view.moved || 0);

  return (
    <span 
      className={`inline-flex items-baseline tabular-nums leading-none ${className}`} 
      style={{ verticalAlign: 'baseline', ...props.style }}
      {...props}
    >
      <span className="sr-only">{`${prefix}${formatter.format(value)}${suffix}`}</span>
      <span aria-hidden="true" className="inline-flex items-baseline whitespace-pre leading-none" style={{ verticalAlign: 'baseline' }}>
        {cols.map((c) => (
          <span 
            key={c.key}
            className="inline-flex items-baseline leading-none"
            style={{ verticalAlign: 'baseline' }}
          >
            {c.digit === null ? (
              <span 
                className="relative inline-flex items-center justify-center select-none tabular-nums"
                style={{ 
                  height: '1.14em',
                  verticalAlign: 'baseline',
                  padding: c.char === '.' || c.char === ',' ? '0 0.04em' : c.char === '%' ? '0 0.07em' : undefined,
                }}
              >
                <span className="leading-none">{c.char}</span>
              </span>
            ) : (
              <Digit 
                digit={c.digit} 
                trend={trend} 
                duration={duration} 
                reduced={still} 
              />
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

export default NumberRoll;
