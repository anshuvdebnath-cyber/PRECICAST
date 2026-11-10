// Hairline UI · stage-bars · MIT License
// Copyright (c) 2026 Hairline UI · https://hairlineui.com/license#components

"use client";

import * as React from "react";
import { NumberRoll } from "./number-roll";
import { TextMorph } from "./text-morph";

/* ─────────────────────────────────────────────────────────
 * STAGE BARS: an atmospheric decision hierarchy you can read at a glance
 *
 *   arrive    the first time it's on screen the bars grow from
 *             the left one after another and every count and
 *             share rolls up from zero
 *   period    Engine switch: the pill is thrown to the choice,
 *             every bar eases to its new width and every figure rolls
 *   focus     point at a stage and the others dim
 * ───────────────────────────────────────────────────────── */

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

  return (
    <div ref={rootRef} className={`@container w-full rounded-[22px] bg-background shadow-[0_0_0_1px_var(--border)] ${className}`} {...props}>
      <div className="p-4 @md:p-5 [--gutter:30px] @md:[--gutter:40px]">
        {/* Title and Segmented Switch */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p className="text-[12px] text-muted-foreground @md:text-[13px] font-medium">{title}</p>
          {periods.length > 1 && (
            <div role="radiogroup" aria-label="Engine Model Stage" className="relative -my-1 inline-flex shrink-0 rounded-full bg-muted p-1 gap-1">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-0 rounded-full bg-background shadow-[0_0_0_1px_var(--border)]"
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
                    className={`cursor-pointer relative h-7 whitespace-nowrap rounded-full px-3 text-[12px] font-medium @md:h-8 @md:px-4 @md:text-[13px] transition-colors duration-300 ${FOCUS} ${
                      selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-[24px] font-bold leading-tight tracking-[-0.03em] @md:text-[28px] text-foreground">
            <NumberRoll value={visible ? 100 : 0} suffix="%" duration={1000} />
          </p>
          <span className="text-[12px] text-muted-foreground font-normal">
            Total Atmospheric Information Content (Gini Split Gain Partitioned)
          </span>
        </div>

        {/* Feature Stages List */}
        <ol className="mt-4 @md:mt-6 space-y-3" onPointerLeave={() => setFocused(null)}>
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
                    className="flex h-5 items-center gap-1.5 pl-1 text-[11px] tabular-nums text-muted-foreground transition-opacity duration-300 mb-1"
                    style={{ opacity: dim && focused !== i - 1 ? 0.35 : 0.85 }}
                  >
                    <svg viewBox="0 0 12 12" className="size-3 text-sky-400" aria-hidden="true">
                      <path d="M6 2.5v7M3 6.6 6 9.5l3-2.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sky-300">
                      <NumberRoll value={visible ? Math.round(step * 100) : 0} suffix="%" duration={800} />
                    </span>
                    <span>relative factor weight vs previous layer</span>
                  </div>
                )}
                <div 
                  onPointerEnter={() => setFocused(i)} 
                  className={`transition-all duration-300 p-2.5 rounded-xl ${dim ? "opacity-35" : "bg-white/[0.02]"}`}
                  style={{
                    border: focused === i ? '1px solid rgba(138, 162, 255, 0.35)' : '1px solid transparent',
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3 text-[13px] @md:text-[14px]">
                    <span className="truncate text-foreground font-medium">
                      {s.label}
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                      <span className="font-semibold text-foreground">
                        <NumberRoll value={visible ? v : 0} format={format} locales={locales} suffix=" pts" duration={900} />
                      </span>
                      <span className="w-14 text-right text-[12px] font-semibold text-sky-300">
                        <NumberRoll value={visible ? share : 0} format={{ style: "percent", maximumFractionDigits: share < 0.1 ? 1 : 0 }} duration={900} />
                      </span>
                    </span>
                  </div>
                  <div className="relative mt-2 h-4 rounded-full bg-black/40 overflow-hidden border border-white/[0.08]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${visible ? Math.max(0.8, share * 100) : 0}%`,
                        background: i === 0 
                          ? 'linear-gradient(90deg, #522ee6 0%, #8aa2ff 100%)' 
                          : 'linear-gradient(90deg, #3730a3 0%, #7a8efc 100%)',
                        boxShadow: '0 0 14px rgba(110, 110, 248, 0.45)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.55)',
                        transition: reduced ? "none" : `width 820ms ${EASE} ${visible ? i * 90 : 0}ms`,
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <table className="sr-only">
          <caption>
            {title}, {period?.label}: Feature importance weights
          </caption>
          <thead>
            <tr>
              <th scope="col">Atmospheric Feature</th>
              <th scope="col">Gini Score</th>
              <th scope="col">Relative Weight</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, i) => (
              <tr key={s.id} id={`${id}-${s.id}`}>
                <th scope="row">{s.label}</th>
                <td>{fmt(values[i] ?? 0)}</td>
                <td>{Math.round(((values[i] ?? 0) / first) * 1000) / 10}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StageBars;
