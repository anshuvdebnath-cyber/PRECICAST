import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShieldCheck, Target, BrainCircuit, TrendingDown } from 'lucide-react';
import metrics from '../data/model_metrics.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import HairlineNumberRoll from './hairline/HairlineNumberRoll';

export default function ModelPerformance() {
  const { classification_metrics, regression_metrics, baseline_comparison, top_feature_importance, roc_curve_samples } = metrics;
  const cm = classification_metrics.confusion_matrix;

  const glassTooltipStyle = {
    background: 'rgba(5, 4, 18, 0.90)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.45)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner KPI Cards with Hairline Glass & Number Rolls */}
      <div className="grid-4">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#34d399', marginBottom: '0.55rem' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Classification Accuracy
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <HairlineNumberRoll value={classification_metrics.accuracy} decimals={2} suffix="%" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Evaluated on 1,039 forward unseen days (2024–2026)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan-bright)', marginBottom: '0.55rem' }}>
            <Target size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ROC-AUC Score
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-cyan-bright)', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <HairlineNumberRoll value={classification_metrics.roc_auc} decimals={4} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Discriminatory separation power (&gt;0.90 gold standard)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a78bfa', marginBottom: '0.55rem' }}>
            <BrainCircuit size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Rain Detection Recall
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <HairlineNumberRoll value={classification_metrics.recall * 100} decimals={1} suffix="%" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Successfully detects 8 out of every 10 real rain events
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', marginBottom: '0.55rem' }}>
            <TrendingDown size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Error Reduction
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            -<HairlineNumberRoll value={baseline_comparison.error_reduction_pct} decimals={1} suffix="%" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            MAE reduction vs persistence baseline (4.01 vs 5.10 mm)
          </div>
        </HairlineCard>
      </div>

      {/* Row 2: Confusion Matrix & ROC Curve */}
      <div className="grid-2">
        {/* Confusion Matrix Card */}
        <HairlineCard>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Confusion Matrix (1,039 Forward Test Days)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.5rem' }}>
            Evaluated strictly on unseen future timelines from Jan 1, 2024 to Feb 28, 2026.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.15rem', textAlign: 'center' }}>
            <HairlineCard variant="inner">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                True Negatives (Dry Correct)
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399', margin: '0.35rem 0' }}>
                <HairlineNumberRoll value={cm.true_negatives} decimals={0} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Correctly predicted dry days</span>
            </HairlineCard>

            <HairlineCard variant="inner">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                False Positives (False Alarm)
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fca5a5', margin: '0.35rem 0' }}>
                <HairlineNumberRoll value={cm.false_positives} decimals={0} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Predicted rain, but remained dry</span>
            </HairlineCard>

            <HairlineCard variant="inner">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                False Negatives (Missed Rain)
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24', margin: '0.35rem 0' }}>
                <HairlineNumberRoll value={cm.false_negatives} decimals={0} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unpredicted isolated showers</span>
            </HairlineCard>

            <HairlineCard variant="inner">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                True Positives (Rain Correct)
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-cyan-bright)', margin: '0.35rem 0' }}>
                <HairlineNumberRoll value={cm.true_positives} decimals={0} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Successfully detected rain events</span>
            </HairlineCard>
          </div>
        </HairlineCard>

        {/* ROC Curve Card */}
        <HairlineCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              ROC Curve (AUC = {classification_metrics.roc_auc})
            </h3>
            <HairlineBadge tone="rain" dot="pulse">Gold Standard</HairlineBadge>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.25rem' }}>
            True Positive Rate vs. False Positive Rate across all probability thresholds.
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={roc_curve_samples} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={11} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={glassTooltipStyle} />
                <Line type="monotone" dataKey="tpr" stroke="#8aa2ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </HairlineCard>
      </div>

      {/* Row 3: Feature Importance Bar Chart */}
      <HairlineCard>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
          Key Physical Predictors (SHAP / XGBoost Gain Feature Importance)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.5rem' }}>
          Relative atmospheric contributions quantified across 100 boosted tree estimators.
        </p>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart 
              data={top_feature_importance} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 160, bottom: 5 }}
            >
              <defs>
                <linearGradient id="importanceAuroraGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5230e0" />
                  <stop offset="100%" stopColor="#8aa2ff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="%" />
              <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={11} width={150} />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${val}%`, 'Relative Tree Gain']}
              />
              <Bar dataKey="importance" fill="url(#importanceAuroraGrad)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </HairlineCard>
    </div>
  );
}
