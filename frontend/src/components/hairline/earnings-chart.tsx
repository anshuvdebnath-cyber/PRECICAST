// Hairline UI · earnings-chart · MIT License
// Copyright (c) 2026 Hairline UI · https://hairlineui.com/license#components

"use client";

import * as React from "react";
import { NumberRoll } from "./number-roll";
import { TextMorph } from "./text-morph";

export interface EarningsBar {
  key: string;
  label: string;
  value: number;
  title?: string;
}

export interface EarningsPeriod {
  id: string;
  label: string;
  bars: EarningsBar[];
  previous?: number;
  comparison?: string;
}

export interface EarningsChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  title?: string;
  periods: EarningsPeriod[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  format?: Intl.NumberFormatOptions;
  locales?: string | string[];
  highlight?: string;
  totalValue?: number;
  totalLabel?: string;
  suffix?: string;
}

type Column = EarningsBar & { left: number; width: number; height: number; index: number; leaving?: "start" | "end" };

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const THROW = "cubic-bezier(0.34,1.36,0.64,1)";
const GLIDE = "cubic-bezier(0.77,0,0.175,1)";
const MORPH = 560;
const PLOT = 240; // enlarged plot area
const HEADROOM = 32;
const LABELS = 28;
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
const DECIMAL: Intl.NumberFormatOptions = { maximumFractionDigits: 1 };

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useReducedMotion = () =>
  React.useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );

function niceMax(value: number) {
  if (value <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * step >= value) return m * step;
  return 10 * step;
}

function ColumnView({
  col,
  grown,
  delay,
  reduced,
  label,
  active,
  isHighlight,
}: {
  col: Column;
  grown: boolean;
  delay: number;
  reduced: boolean;
  label: boolean;
  active?: boolean;
  isHighlight?: boolean;
}) {
  const [born, setBorn] = React.useState(false);
  React.useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => (inner = requestAnimationFrame(() => setBorn(true))));
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);
  const up = grown && born && !col.leaving;
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 h-full"
      style={{
        left: `${col.left}%`,
        width: `${col.width}%`,
        opacity: col.leaving ? 0 : 1,
        transition: reduced ? "none" : `left ${MORPH}ms ${GLIDE}, width ${MORPH}ms ${GLIDE}, opacity ${col.leaving ? 240 : 360}ms ${EASE}`,
      }}
    >
      <div
        className="absolute bottom-[28px] left-1/2 w-[min(44px,74%)] -translate-x-1/2 rounded-t-[8px]"
        style={{
          height: up ? Math.max(6, col.height) : 0,
          background: isHighlight
            ? 'linear-gradient(180deg, #adc7ff 0%, #522ee6 100%)'
            : active
              ? 'linear-gradient(180deg, #d9ebff 0%, #6366f1 100%)'
              : 'linear-gradient(180deg, rgba(138, 162, 255, 0.90) 0%, rgba(82, 46, 230, 0.95) 100%)',
          boxShadow: isHighlight || active
            ? '0 0 24px rgba(110, 110, 248, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.85)'
            : '0 6px 18px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.85)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.35)',
          borderRight: '1px solid rgba(255, 255, 255, 0.35)',
          transition: reduced ? "none" : `height 640ms ${EASE} ${delay}ms, background 300ms ${EASE}`,
        }}
      />
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12.5px] leading-[20px] text-muted-foreground font-semibold"
        style={{ opacity: label ? 1 : 0, transition: reduced ? "none" : `opacity 300ms ${EASE}` }}
      >
        {col.label}
      </span>
    </div>
  );
}

export function EarningsChart({
  title = "Earnings",
  periods,
  value,
  defaultValue,
  onValueChange,
  format = DECIMAL,
  locales,
  highlight,
  totalValue,
  totalLabel,
  suffix = "",
  className = "",
  ...props
}: EarningsChartProps) {
  const reduced = useReducedMotion();
  const id = React.useId();
  const [own, setOwn] = React.useState(defaultValue ?? periods[0]?.id);
  const periodId = value ?? own;
  const period = periods.find((p) => p.id === periodId) ?? periods[0];
  const bars = period?.bars ?? [];
  const [plotH, setPlotH] = React.useState(PLOT);
  const total = bars.reduce((sum, b) => sum + b.value, 0);
  const max = niceMax(Math.max(0, ...bars.map((b) => b.value)));
  const slot = bars.length ? 100 / bars.length : 100;
  const layout: Column[] = bars.map((b, index) => ({ ...b, index, left: index * slot, width: slot, height: (b.value / max) * (plotH - HEADROOM) }));
  const hi = highlight ?? bars[bars.length - 1]?.key;

  const [visible, setVisible] = React.useState(true);
  const [active, setActive] = React.useState<number | null>(null);
  const [keyboard, setKeyboard] = React.useState(false);
  const [leaving, setLeaving] = React.useState<Column[]>([]);
  const [prev, setPrev] = React.useState(() => ({ id: periodId, bars, layout }));
  const [pill, setPill] = React.useState({ left: 0, width: 0, ready: false });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const plotRef = React.useRef<HTMLDivElement>(null);
  const barsRef = React.useRef<HTMLDivElement>(null);
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [width, setWidth] = React.useState(0);

  if (prev.id !== periodId) {
    const keys = new Set(bars.map((b) => b.key));
    const shared = prev.layout.filter((c) => keys.has(c.key)).map((c) => c.index);
    const firstShared = shared.length ? Math.min(...shared) : prev.layout.length;
    setLeaving(
      prev.layout
        .filter((c) => !keys.has(c.key))
        .map((c) => {
          const side = c.index < firstShared ? "start" : "end";
          return { ...c, leaving: side, left: side === "start" ? 0 : 100, width: 0, height: 0 };
        }),
    );
    setPrev({ id: periodId, bars, layout });
    setActive(null);
  } else if (prev.bars !== bars) {
    setPrev({ id: periodId, bars, layout });
  }

  React.useEffect(() => {
    if (!leaving.length) return;
    const timer = window.setTimeout(() => setLeaving([]), MORPH);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  React.useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () =>
      setPlotH((h) => {
        const next = el.offsetHeight - LABELS;
        return next > 0 && next !== h ? next : h;
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const measure = () => setWidth((w) => (w === el.offsetWidth ? w : el.offsetWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const every = width && bars.length ? Math.max(1, Math.ceil(30 / (width / bars.length))) : 1;

  React.useLayoutEffect(() => {
    const el = chipRefs.current[periods.findIndex((p) => p.id === periodId)];
    if (!el) return;
    setPill((p) => (p.left === el.offsetLeft && p.width === el.offsetWidth ? p : { left: el.offsetLeft, width: el.offsetWidth, ready: p.width > 0 }));
  }, [periodId, periods]);

  const choose = (next: string) => {
    if (next === periodId) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  const pointAt = (clientX: number) => {
    const r = barsRef.current?.getBoundingClientRect();
    if (!r || !bars.length) return null;
    return Math.min(bars.length - 1, Math.max(0, Math.floor(((clientX - r.left) / r.width) * bars.length)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!bars.length) return;
    const from =
      active ??
      Math.max(
        0,
        bars.findIndex((b) => b.key === hi),
      );
    const moves: Record<string, number> = { ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: bars.length - 1 };
    if (e.key === "Escape") return setActive(null);
    if (!(e.key in moves)) return;
    e.preventDefault();
    setKeyboard(true);
    setActive(Math.min(bars.length - 1, Math.max(0, active === null ? from : moves[e.key])));
  };

  const fmt = (n: number) => new Intl.NumberFormat(locales, format).format(n);
  const baseVal = totalValue ?? total;
  const change = period?.previous && totalValue ? (totalValue - period.previous) / period.previous : null;
  const [lastChange, setLastChange] = React.useState(change ?? 0);
  if (change !== null && change !== lastChange) setLastChange(change);
  const shownChange = change ?? lastChange;
  const up = shownChange >= 0;
  const comparable = periods.some((p) => p.previous);
  const shown = active !== null ? bars[active] : null;
  const col = active !== null ? layout[active] : null;
  const compact = { ...format, minimumFractionDigits: 0, maximumFractionDigits: 0 };

  return (
    <div ref={rootRef} className={`@container w-full rounded-[22px] bg-background shadow-[0_0_0_1px_var(--border)] ${className}`} {...props}>
      <div className="p-5 @md:p-8 [--gutter:58px] @md:[--gutter:72px] [--plot:300px] @md:[--plot:340px] pb-6">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] text-muted-foreground @md:text-[15px] font-semibold tracking-wide">{title}</p>
          <span className="text-[12px] text-sky-300 font-medium tracking-wide">Calibrated Multi-Tier Metric</span>
        </div>

        {/* Dedicated Mode Switch Bar with Generous Spacing and Padding */}
        <div className="my-5 @md:my-6 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="radiogroup" aria-label="Period" className="relative inline-flex items-center rounded-full bg-black/80 border border-white/20 p-1.5 gap-2 backdrop-blur-md shadow-lg flex-nowrap">
            <span
              aria-hidden="true"
              className="absolute inset-y-1.5 left-0 rounded-full bg-indigo-600/75 border border-indigo-400/80 shadow-[0_2px_14px_rgba(99,102,241,0.55)]"
              style={{
                width: pill.width,
                transform: `translateX(${pill.left}px)`,
                transition: pill.ready && !reduced ? `transform 460ms ${THROW}, width 380ms ${EASE}` : "none",
              }}
            />
            {periods.map((p, i) => {
              const selected = p.id === periodId;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(p.id)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                    e.preventDefault();
                    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + periods.length) % periods.length;
                    choose(periods[next].id);
                    chipRefs.current[next]?.focus();
                  }}
                  className={`cursor-pointer relative z-10 h-10 shrink-0 whitespace-nowrap rounded-full px-5 text-[13.5px] font-semibold @md:text-[14px] tabular-nums transition-all duration-300 ${FOCUS} ${
                    selected ? "text-white" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary KPI Header */}
        <div className="mt-3 flex items-center flex-wrap gap-3">
          <p className="text-[28px] font-bold leading-tight tracking-[-0.03em] @md:text-[34px] text-foreground font-heading">
            <NumberRoll value={visible ? baseVal : 0} format={format} locales={locales} suffix={suffix} duration={1000} />
          </p>
          {totalLabel && (
            <span className="text-[13px] text-muted-foreground font-medium">
              {totalLabel}
            </span>
          )}
        </div>

        {/* Comparison Callout */}
        {(comparable || period?.comparison) && (
          <p className="mt-1.5 flex items-center text-[12.5px] text-muted-foreground @md:text-[13.5px]">
            {change !== null && (
              <span className="min-w-0 pr-2">
                <span
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums transition-colors duration-300 ${
                    up ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className="size-3"
                    style={{ transform: up ? "none" : "rotate(180deg)", transition: reduced ? "none" : `transform 420ms ${THROW}` }}
                  >
                    <path
                      d="M6 9.5V2.5M2.8 5.6 6 2.5l3.2 3.1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <NumberRoll value={visible ? Math.abs(shownChange) : 0} format={{ style: "percent", maximumFractionDigits: 1 }} duration={800} />
                </span>
              </span>
            )}
            <span className="whitespace-nowrap font-medium text-slate-300">
              <TextMorph>{period?.comparison ?? " "}</TextMorph>
            </span>
          </p>
        )}

        {/* The Plot Area */}
        <div
          ref={plotRef}
          role="group"
          tabIndex={0}
          aria-label={`${title}, ${period?.label ?? ""}. Use the arrow keys to read each bar.`}
          onKeyDown={onKeyDown}
          onBlur={() => keyboard && (setActive(null), setKeyboard(false))}
          onPointerMove={(e) => {
            setKeyboard(false);
            setActive(pointAt(e.clientX));
          }}
          onPointerDown={(e) => setActive(pointAt(e.clientX))}
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          className={`relative mt-4 touch-pan-y @md:mt-5 select-none rounded-lg ${FOCUS}`}
          style={{ height: `calc(var(--plot) + ${LABELS}px)` }}
        >
          {/* The Scale */}
          {[1, 0.5, 0].map((f) => (
            <div key={f} aria-hidden="true" className="absolute right-0" style={{ left: 0, top: HEADROOM + (1 - f) * (plotH - HEADROOM) }}>
              <span
                className="absolute left-0 top-0 -translate-y-1/2 text-[11px] tabular-nums leading-none text-muted-foreground/80 font-medium"
                style={{ width: "calc(var(--gutter) - 8px)", textAlign: "right" }}
              >
                <NumberRoll value={visible ? max * f : 0} format={compact} locales={locales} suffix={suffix} duration={700} />
              </span>
              <div className="border-t border-border" style={{ marginLeft: "var(--gutter)" }} />
            </div>
          ))}

          <div ref={barsRef} className="absolute inset-y-0 right-0" style={{ left: "var(--gutter)" }}>
            {/* The hovered column highlight lane */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-[10px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
              style={{
                top: 2,
                height: plotH - 2,
                left: col ? `calc(${col.left}% + 2px)` : 0,
                width: col ? `calc(${col.width}% - 4px)` : 0,
                opacity: col ? 1 : 0,
                transition: reduced ? "none" : `left 380ms ${THROW}, width 380ms ${EASE}, opacity 200ms ${EASE}`,
              }}
            />

            {[...layout, ...leaving.filter((l) => !bars.some((b) => b.key === l.key))].map((c) => (
              <ColumnView
                key={c.key}
                col={c}
                grown={visible}
                delay={c.leaving ? 0 : Math.min(c.index, 12) * 28}
                label={!c.leaving && (bars.length - 1 - c.index) % every === 0}
                reduced={reduced}
                active={active !== null && bars[active]?.key === c.key}
                isHighlight={c.key === hi}
              />
            ))}

            {/* Readout Tooltip (Enlarged, Clear & Prominent) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[2px] flex h-[38px] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-slate-950/95 px-4 text-[13.5px] border border-indigo-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-xl"
              style={{
                left: col ? `clamp(120px, ${col.left + col.width / 2}%, calc(100% - 120px))` : "50%",
                opacity: shown ? 1 : 0,
                scale: shown ? "1" : "0.94",
                transition: reduced ? "none" : `left 380ms ${THROW}, opacity 200ms ${EASE}, scale 260ms ${EASE}`,
              }}
            >
              <span className="text-sky-200 font-medium">
                {shown ? (shown.title ?? shown.label) : " "}
              </span>
              <span className="text-slate-400 font-bold">&bull;</span>
              <span className="font-extrabold tabular-nums text-white text-[14px]">
                <NumberRoll value={shown?.value ?? 0} format={format} locales={locales} suffix={suffix} duration={600} /> Accuracy
              </span>
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {keyboard && shown ? `${shown.title ?? shown.label}: ${fmt(shown.value)}` : ""}
        </p>
      </div>
    </div>
  );
}

export default EarningsChart;
