// Hairline UI · stage-bars · MIT License
// Copyright (c) 2026 Hairline UI · https://hairlineui.com/license#components

"use client";

import * as React from "react";
import { NumberRoll } from "./number-roll";
import { TextMorph } from "./text-morph";
import { Info } from "lucide-react";

export interface Stage {
  id: string;
  label: string;
}

export interface StagePeriod {
  id: string;
  label: string;
  values: number[];
}

export interface StageBarsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  title?: string;
  stages: Stage[];
  periods: StagePeriod[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  format?: Intl.NumberFormatOptions;
  locales?: string | string[];
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const THROW = "cubic-bezier(0.34,1.36,0.64,1)";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

// Atmospheric Mechanism Descriptions for Enlarged Detail Inspection
const FEATURE_EXPLANATIONS: Record<string, { role: string; physics: string }> = {
  rain_today_flag: {
    role: "Atmospheric Memory (Persistence Driver)",
    physics: "Binary flag indicating whether rainfall occurred today. Governs 66.6% of initial tree branch splits due to synoptic air mass persistence over the Gangetic delta."
  },
  precip_today: {
    role: "Antecedent Column Moisture",
    physics: "Observed 24-hour rainfall depth (mm). Dictates ground saturation and near-surface relative humidity recharging boundary layer convective moisture."
  },
  rain_streak_days: {
    role: "Convective Storm Continuity",
    physics: "Number of consecutive rainy days. Distinguishes fleeting isolated thundershowers from multi-day sustained monsoon depression surges."
  },
  is_monsoon_core: {
    role: "Southwest Monsoon Seasonal Window",
    physics: "Seasonal forcing window (June 10 to Sept 30). Accounts for 74% of Kolkata's annual precipitation budget driven by Bay of Bengal maritime troughs."
  },
  dew_point_depression: {
    role: "Boundary Layer Vapor Saturation",
    physics: "Temperature minus dew point (T - Td). A depression < 2.0°C indicates immediate condensation capacity and low cloud base ceiling."
  },
  cloud_cover_mean: {
    role: "Solar Radiative Deck Shielding",
    physics: "Mean daytime cloud fraction. Prevents radiative surface heat dissipation while signaling deep cumulonimbus deck formation."
  },
  surface_pressure_min: {
    role: "Cyclonic Trough Depth",
    physics: "Minimum daily barometric pressure. Drops below 1,004 hPa indicate active tropical depressions originating over the Bay of Bengal."
  }
};

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

export function StageBars({
  title = "Atmospheric Feature Cascade",
  stages,
  periods,
  value,
  defaultValue,
  onValueChange,
  format,
  locales,
  className = "",
  ...props
}: StageBarsProps) {
  const reduced = useReducedMotion();
  const id = React.useId();
  const [own, setOwn] = React.useState(defaultValue ?? periods[0]?.id);
  const periodId = value ?? own;
  const period = periods.find((p) => p.id === periodId) ?? periods[0];
  const values = period?.values ?? [];
  const first = values[0] || 1;

  const [visible, setVisible] = React.useState(true);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [pill, setPill] = React.useState({ left: 0, width: 0, ready: false });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

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
    const el = chipRefs.current[periods.findIndex((p) => p.id === periodId)];
    if (!el) return;
    setPill((p) => (p.left === el.offsetLeft && p.width === el.offsetWidth ? p : { left: el.offsetLeft, width: el.offsetWidth, ready: p.width > 0 }));
  }, [periodId, periods]);

  const choose = (next: string) => {
    if (next === periodId) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  const fmt = (v: number) => new Intl.NumberFormat(locales, format).format(v);
  const activeFeature = focused !== null ? stages[focused] : null;
  const activeExpl = activeFeature ? (FEATURE_EXPLANATIONS[activeFeature.id] ?? null) : null;

  return (
    <div ref={rootRef} className={`@container w-full rounded-[22px] bg-background shadow-[0_0_0_1px_var(--border)] ${className}`} {...props}>
      <div className="p-4 @md:p-6 [--gutter:30px] @md:[--gutter:40px]">
        {/* Title and Segmented Switch */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-2">
          <p className="text-[13px] text-muted-foreground @md:text-[14px] font-semibold">{title}</p>
          {periods.length > 1 && (
            <div role="radiogroup" aria-label="Engine Model Stage" className="relative -my-1 inline-flex shrink-0 rounded-full bg-black/60 border border-white/10 p-1 gap-1">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-0 rounded-full bg-indigo-600/50 border border-indigo-400/50 shadow-sm"
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
                    className={`cursor-pointer relative h-7.5 whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-medium @md:h-8 @md:px-4 @md:text-[13px] transition-colors duration-300 ${FOCUS} ${
                      selected ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Header Metric */}
        <div className="mt-2 flex items-baseline flex-wrap gap-2.5">
          <p className="text-[26px] font-bold leading-tight tracking-[-0.03em] @md:text-[32px] text-foreground">
            <NumberRoll value={visible ? 100 : 0} suffix="%" duration={1000} />
          </p>
          <span className="text-[13px] text-muted-foreground font-medium">
            Total Model Decision Gain (Gini Split Importance Partitioned Across 34 Features)
          </span>
        </div>

        {/* Feature Stages List */}
        <ol className="mt-5 space-y-3.5" onPointerLeave={() => setFocused(null)}>
          {stages.map((s, i) => {
            const v = values[i] ?? 0;
            const share = v / first;
            const step = i > 0 && values[i - 1] ? v / values[i - 1] : 1;
            const dim = focused !== null && focused !== i;

            return (
              <li key={s.id} className="relative">
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="flex h-5 items-center gap-1.5 pl-1.5 text-[11.5px] tabular-nums text-muted-foreground transition-opacity duration-300 mb-1"
                    style={{ opacity: dim && focused !== i - 1 ? 0.35 : 0.85 }}
                  >
                    <svg viewBox="0 0 12 12" className="size-3 text-sky-400" aria-hidden="true">
                      <path d="M6 2.5v7M3 6.6 6 9.5l3-2.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sky-300 font-semibold">
                      <NumberRoll value={visible ? Math.round(step * 100) : 0} suffix="%" duration={800} />
                    </span>
                    <span>relative weight vs previous layer</span>
                  </div>
                )}
                <div 
                  onPointerEnter={() => setFocused(i)} 
                  className={`transition-all duration-300 p-3 rounded-xl cursor-pointer ${
                    focused === i ? "bg-white/[0.06] border border-white/20 shadow-lg scale-[1.008]" : dim ? "opacity-35 bg-transparent border border-transparent" : "bg-white/[0.02] border border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3 text-[14px] @md:text-[15px]">
                    <span className="truncate text-foreground font-semibold">
                      {s.label}
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                      <span className="font-bold text-foreground text-[14px] @md:text-[15px]">
                        <NumberRoll value={visible ? v : 0} format={format} locales={locales} suffix=" pts" duration={900} />
                      </span>
                      <span className="w-16 text-right text-[13px] @md:text-[14px] font-bold text-sky-300">
                        <NumberRoll value={visible ? share : 0} format={{ style: "percent", maximumFractionDigits: share < 0.1 ? 1 : 0 }} duration={900} />
                      </span>
                    </span>
                  </div>
                  <div className="relative mt-2.5 h-4.5 rounded-full bg-black/50 overflow-hidden border border-white/[0.12]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${visible ? Math.max(1, share * 100) : 0}%`,
                        background: i === 0 
                          ? 'linear-gradient(90deg, #522ee6 0%, #8aa2ff 100%)' 
                          : 'linear-gradient(90deg, #3730a3 0%, #7a8efc 100%)',
                        boxShadow: '0 0 16px rgba(110, 110, 248, 0.55)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.65)',
                        transition: reduced ? "none" : `width 820ms ${EASE} ${visible ? i * 90 : 0}ms`,
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Enlarged Interactive Feature Detail Card (Appears on Hover) */}
        {activeFeature && activeExpl && (
          <div 
            className="mt-5 p-4 rounded-xl bg-indigo-950/40 border border-indigo-400/30 backdrop-blur-md transition-all duration-300 shadow-xl"
            style={{ animation: 'fluidTabSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="flex items-center gap-2 text-sky-300 mb-1">
              <Info size={16} />
              <span className="text-[12px] font-bold uppercase tracking-wider">Meteorological Interpretation</span>
            </div>
            <h4 className="text-[16px] font-bold text-white mb-1">
              {activeFeature.label}
            </h4>
            <div className="text-[13.5px] font-medium text-indigo-200 mb-1">
              Role: <span className="text-white font-semibold">{activeExpl.role}</span>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {activeExpl.physics}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StageBars;
