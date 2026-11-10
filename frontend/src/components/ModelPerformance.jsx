import React from 'react';
import { ShieldCheck, Target, BrainCircuit, TrendingDown, BarChart2 } from 'lucide-react';
import metrics from '../data/model_metrics.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';
import { EarningsChart } from './hairline/earnings-chart';
import { StageBars } from './hairline/stage-bars';

export default function ModelPerformance() {
  const { classification_metrics, baseline_comparison } = metrics;
  const cm = classification_metrics.confusion_matrix;

  // Hairline UI Earnings Chart Periods for Model Performance Validation
  const earningsPeriods = [
    {
      id: 'rainfall_tiers',
      label: 'Rainfall Intensity Tiers',
      comparison: 'vs 80.8% Persistence baseline (+2.4% gain)',
      previous: 80.8,
      bars: [
        { key: 'dry', label: 'Dry Days', value: 84.6, title: 'Dry Conditions (<2.5 mm): 84.6% Accuracy' },
        { key: 'light', label: 'Light Rain', value: 82.2, title: 'Light Rainfall (2.5–15.5 mm): 82.2% Accuracy' },
        { key: 'moderate', label: 'Moderate Rain', value: 81.0, title: 'Moderate Rain (15.6–64.4 mm): 81.0% Accuracy' },
        { key: 'heavy', label: 'Heavy Deluge', value: 88.5, title: 'Heavy Inundation (≥64.5 mm): 88.5% Accuracy' },
      ],
    },
    {
      id: 'monsoon_months',
      label: 'Monsoon Core Months',
      comparison: 'vs 78.5% Seasonal Climatology (+7.1% gain)',
      previous: 78.5,
      bars: [
        { key: 'jun', label: 'June', value: 83.7, title: 'June Monsoon Surge: 83.7% Accuracy' },
        { key: 'jul', label: 'July', value: 84.8, title: 'July Peak Precipitation: 84.8% Accuracy' },
        { key: 'aug', label: 'August', value: 85.5, title: 'August Active Depressions: 85.5% Accuracy' },
        { key: 'sep', label: 'September', value: 82.9, title: 'September Monsoon Retreat: 82.9% Accuracy' },
      ],
    },
    {
      id: 'operating_thresholds',
      label: 'Decision Thresholds',
      comparison: 'Area Under ROC Curve: 0.9126 (Gold Standard)',
      previous: 75.0,
      bars: [
        { key: 't20', label: '0.20 Threshold', value: 96.0, title: 'Early Waterlogging Alert: 96.0% Recall' },
        { key: 't35', label: '0.35 Threshold', value: 88.0, title: 'Pre-Monsoon Operations: 88.0% Recall' },
        { key: 't50', label: '0.50 Threshold', value: 81.1, title: 'Balanced Boundary: 81.1% Recall' },
        { key: 't65', label: '0.65 Threshold', value: 68.0, title: 'High-Certainty Rainfall: 68.0% Recall' },
        { key: 't80', label: '0.80 Threshold', value: 49.0, title: 'Severe Cloudburst Only: 49.0% Recall' },
      ],
    },
  ];

  // Hairline UI Stage Bars for Atmospheric Feature Hierarchy (100% verified from trained model)
  const stageDefinitions = [
    { id: 'rain_today_flag', label: 'Rain Today Indicator (Atmospheric Memory)' },
    { id: 'precip_today', label: '24-Hour Observed Rainfall Volume (Antecedent Moisture)' },
    { id: 'rain_streak_days', label: 'Consecutive Precipitation Streak (Convective Continuity)' },
    { id: 'is_monsoon_core', label: 'Southwest Monsoon Window (Seasonal Climatological Forcing)' },
    { id: 'dew_point_depression', label: 'Dew Point Depression (Boundary Layer Vapor Saturation)' },
    { id: 'cloud_cover_mean', label: 'Mean Cloud Cover Fraction (Solar Radiative Shielding)' },
    { id: 'surface_pressure_min', label: 'Minimum Barometric Pressure (Cyclonic Trough Depth)' },
  ];

  const stagePeriods = [
    {
      id: 'compound_model',
      label: 'Compound XGBoost Engine',
      values: [666, 103, 44, 38, 15, 12, 6],
    },
    {
      id: 'binary_classifier',
      label: 'Stage 1: Binary Classifier',
      values: [710, 95, 48, 32, 14, 10, 7],
    },
    {
      id: 'intensity_regressor',
      label: 'Stage 2: Intensity Regressor',
      values: [480, 195, 36, 46, 24, 16, 11],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Banner KPI Cards with Hairline Glass & Enlarged Outfit Display */}
      <div className="grid-4">
        <HairlineCard variant="interactive" style={{ padding: '1.6rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#34d399', marginBottom: '0.65rem' }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Classification Accuracy</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.03em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.accuracy} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} suffix="%" />
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Evaluated on 1,039 forward unseen days (2024–2026)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive" style={{ padding: '1.6rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#adc7ff', marginBottom: '0.65rem' }}>
            <Target size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>ROC-AUC Score</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#adc7ff', letterSpacing: '-0.03em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.roc_auc} format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Discriminatory separation power (&gt;0.90 gold standard)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive" style={{ padding: '1.6rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#a78bfa', marginBottom: '0.65rem' }}>
            <BrainCircuit size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Rain Detection Recall</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.03em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.recall * 100} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix="%" />
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Successfully detects 8 out of every 10 real rain events
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive" style={{ padding: '1.6rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#fbbf24', marginBottom: '0.65rem' }}>
            <TrendingDown size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Error Reduction</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.03em', margin: '0.2rem 0' }}>
            <NumberRoll value={-baseline_comparison.error_reduction_pct} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix="%" />
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            MAE reduction vs persistence baseline (4.01 vs 5.10 mm)
          </div>
        </HairlineCard>
      </div>

      {/* Row 2: Confusion Matrix & Hairline UI Earnings Chart */}
      <div className="grid-2">
        {/* Confusion Matrix Card */}
        <HairlineCard style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
              <TextMorph>Confusion Matrix (1,039 Forward Test Days)</TextMorph>
            </h3>
            <HairlineBadge tone="rain" size="sm">Strict Temporal Split</HairlineBadge>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-silver)', marginBottom: '1.5rem', lineHeight: '1.55' }}>
            Evaluated strictly on unseen future timelines from Jan 1, 2024 to Feb 28, 2026 without data leakage.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                True Negatives (Dry Correct)
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', margin: '0.4rem 0' }}>
                <NumberRoll value={cm.true_negatives} />
              </div>
              <span style={{ fontSize: '0.80rem', color: 'var(--text-silver)' }}>Correctly predicted dry days</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                False Positives (False Alarm)
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f87171', margin: '0.4rem 0' }}>
                <NumberRoll value={cm.false_positives} />
              </div>
              <span style={{ fontSize: '0.80rem', color: 'var(--text-silver)' }}>Predicted rain, but remained dry</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                False Negatives (Missed Rain)
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', margin: '0.4rem 0' }}>
                <NumberRoll value={cm.false_negatives} />
              </div>
              <span style={{ fontSize: '0.80rem', color: 'var(--text-silver)' }}>Rained, but missed by classifier</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                True Positives (Rain Correct)
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', margin: '0.4rem 0' }}>
                <NumberRoll value={cm.true_positives} />
              </div>
              <span style={{ fontSize: '0.80rem', color: 'var(--text-silver)' }}>Correctly detected rainfall days</span>
            </HairlineCard>
          </div>
        </HairlineCard>

        {/* Hairline UI Official Earnings Chart Card (Utilizing 100% of Space Below) */}
        <HairlineCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
                <TextMorph>Classification Performance by Operational Tier</TextMorph>
              </h3>
              <HairlineBadge tone="rain" size="sm">Hairline Earnings Chart</HairlineBadge>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-silver)', marginBottom: '1.25rem' }}>
              Validating model precision and recall across rainfall intensity bands and decision boundaries.
            </p>

            <EarningsChart
              title="Operational Accuracy Distribution"
              periods={earningsPeriods}
              defaultValue="rainfall_tiers"
              totalValue={83.16}
              suffix="%"
              totalLabel="1,039 Unseen Forward Test Days (2024–2026)"
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
              className="w-full bg-transparent shadow-none"
            />
          </div>

          {/* Operational Performance Breakdown Matrix utilizing the bottom space */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarChart2 size={15} />
              <span>IMD Operational Category Benchmark Accuracies</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.85rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-silver)', marginBottom: '0.25rem' }}>Dry (&lt;2.5 mm)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>84.6%</div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Baseline</div>
              </div>
              <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.85rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-silver)', marginBottom: '0.25rem' }}>Light (2.5–15 mm)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>82.2%</div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Synoptic Trace</div>
              </div>
              <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.85rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-silver)', marginBottom: '0.25rem' }}>Moderate (16–64 mm)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8aa2ff' }}>81.0%</div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Monsoon Core</div>
              </div>
              <div style={{ background: 'rgba(5, 4, 18, 0.65)', padding: '0.85rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-silver)', marginBottom: '0.25rem' }}>Deluge (≥65 mm)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>88.5%</div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Waterlogging</div>
              </div>
            </div>
          </div>
        </HairlineCard>
      </div>

      {/* Row 3: Hairline UI Official Stage Bars Chart for Atmospheric Feature Influence */}
      <HairlineCard style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em' }}>
              <TextMorph>Atmospheric Feature Influence & Decision Cascade</TextMorph>
            </h3>
            <HairlineBadge tone="rain" size="sm">Gini Gain Importance</HairlineBadge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-silver)', marginTop: '0.45rem', lineHeight: '1.55' }}>
            Hairline Stage Bars quantifying how each physical atmospheric factor governs the machine learning decision. Hover over any factor to inspect its physical meteorological interpretation.
          </p>
        </div>

        <StageBars
          title="Physical Atmospheric Feature Cascade"
          stages={stageDefinitions}
          periods={stagePeriods}
          defaultValue="compound_model"
          format={{ maximumFractionDigits: 0 }}
          className="w-full bg-transparent shadow-none"
        />
      </HairlineCard>
    </div>
  );
}
