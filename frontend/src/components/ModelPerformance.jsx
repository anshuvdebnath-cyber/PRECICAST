import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShieldCheck, Target, BrainCircuit, TrendingDown, Check, X } from 'lucide-react';
import metrics from '../data/model_metrics.json';
import HairlineCard from './hairline/HairlineCard';
import HairlineBadge from './hairline/HairlineBadge';
import NumberRoll from './hairline/number-roll';
import TextMorph from './hairline/text-morph';

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
      {/* Top Banner KPI Cards with Hairline Glass & Official Number Rolls */}
      <div className="grid-4">
        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#34d399', marginBottom: '0.55rem' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Classification Accuracy</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.accuracy} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} suffix="%" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Evaluated on 1,039 forward unseen days (2024–2026)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#adc7ff', marginBottom: '0.55rem' }}>
            <Target size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>ROC-AUC Score</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#adc7ff', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.roc_auc} format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Discriminatory separation power (&gt;0.90 gold standard)
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a78bfa', marginBottom: '0.55rem' }}>
            <BrainCircuit size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Rain Detection Recall</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <NumberRoll value={classification_metrics.recall * 100} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix="%" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Successfully detects 8 out of every 10 real rain events
          </div>
        </HairlineCard>

        <HairlineCard variant="interactive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', marginBottom: '0.55rem' }}>
            <TrendingDown size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <TextMorph>Error Reduction</TextMorph>
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
            <NumberRoll value={-baseline_comparison.error_reduction_pct} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} suffix="%" />
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
            <TextMorph>Confusion Matrix (1,039 Forward Test Days)</TextMorph>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.5rem' }}>
            Evaluated strictly on unseen future timelines from Jan 1, 2024 to Feb 28, 2026.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                True Negatives (Dry Correct)
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', margin: '0.35rem 0' }}>
                <NumberRoll value={cm.true_negatives} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-silver)' }}>Correctly predicted dry days</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                False Positives (False Alarm)
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', margin: '0.35rem 0' }}>
                <NumberRoll value={cm.false_positives} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-silver)' }}>Predicted rain, but remained dry</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                False Negatives (Missed Rain)
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', margin: '0.35rem 0' }}>
                <NumberRoll value={cm.false_negatives} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-silver)' }}>Rained, but missed by classifier</span>
            </HairlineCard>

            <HairlineCard variant="inner" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                True Positives (Rain Correct)
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0' }}>
                <NumberRoll value={cm.true_positives} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-silver)' }}>Correctly detected rainfall days</span>
            </HairlineCard>
          </div>
        </HairlineCard>

        {/* ROC Curve Card */}
        <HairlineCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              <TextMorph>ROC Curve (AUC = 0.9126)</TextMorph>
            </h3>
            <HairlineBadge tone="rain" size="sm">Gold Standard</HairlineBadge>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.25rem' }}>
            True Positive Rate vs. False Positive Rate across all probability thresholds.
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={roc_curve_samples} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={11} label={{ value: 'False Positive Rate', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1]} label={{ value: 'True Positive Rate', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={glassTooltipStyle}
                  formatter={(val, name) => [val, name === 'tpr' ? 'True Positive Rate' : 'False Positive Rate']}
                />
                <Line type="monotone" dataKey="tpr" stroke="#8aa2ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </HairlineCard>
      </div>

      {/* Feature Importance Card */}
      <HairlineCard>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          <TextMorph>Atmospheric Feature Importance (Gini Gain)</TextMorph>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.5rem' }}>
          Ranking physical atmospheric drivers identified by the Gradient Boosted Decision Tree.
        </p>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart 
              data={top_feature_importance} 
              layout="vertical"
              margin={{ top: 5, right: 25, left: 140, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 0.35]} />
              <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={135} />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${(val * 100).toFixed(1)}%`, 'Relative Importance']}
              />
              <Bar dataKey="importance" fill="#5230e0" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </HairlineCard>
    </div>
  );
}
