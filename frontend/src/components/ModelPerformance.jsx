import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShieldCheck, Target, BrainCircuit, TrendingDown } from 'lucide-react';
import metrics from '../data/model_metrics.json';

export default function ModelPerformance() {
  const { classification_metrics, regression_metrics, baseline_comparison, top_feature_importance, roc_curve_samples } = metrics;
  const cm = classification_metrics.confusion_matrix;

  const glassTooltipStyle = {
    background: 'rgba(0, 3, 10, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.35)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
    color: '#ffffff'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner KPI Cards with 0.7 Glossiness */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#34d399', marginBottom: '0.45rem' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Classification Accuracy</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#34d399' }}>{classification_metrics.accuracy}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tested on 1,039 unseen days (2024–2026)</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#00c8ff', marginBottom: '0.45rem' }}>
            <Target size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROC-AUC Score</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#00c8ff' }}>{classification_metrics.roc_auc}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discriminatory separation power (&gt;0.90 gold standard)</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a78bfa', marginBottom: '0.45rem' }}>
            <BrainCircuit size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rain Recall (Detection)</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#a78bfa' }}>{(classification_metrics.recall * 100).toFixed(1)}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Catches 8 out of every 10 real rain events</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', marginBottom: '0.45rem' }}>
            <TrendingDown size={18} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error Reduction</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24' }}>-{baseline_comparison.error_reduction_pct}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lower error than persistence baseline (4.01 vs 5.10 mm)</div>
        </div>
      </div>

      {/* Row 2: Confusion Matrix & ROC Curve */}
      <div className="grid-2">
        {/* Confusion Matrix Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
            Confusion Matrix (1,039 Forward Test Days)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1.4rem' }}>
            Evaluated strictly on unseen future timelines from Jan 1, 2024 to Nov 4, 2026.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.15rem', textAlign: 'center' }}>
            <div className="glass-inner-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>True Negatives (Dry Correct)</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '0.35rem 0' }}>{cm.true_negatives}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Correctly predicted dry days</span>
            </div>

            <div className="glass-inner-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>False Positives (False Alarm)</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fca5a5', margin: '0.35rem 0' }}>{cm.false_positives}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Predicted rain, but remained dry</span>
            </div>

            <div className="glass-inner-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>False Negatives (Missed Rain)</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', margin: '0.35rem 0' }}>{cm.false_negatives}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unpredicted isolated showers</span>
            </div>

            <div className="glass-inner-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>True Positives (Rain Correct)</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00c8ff', margin: '0.35rem 0' }}>{cm.true_positives}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Successfully detected rain events</span>
            </div>
          </div>
        </div>

        {/* ROC Curve Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>ROC Curve (Area = {classification_metrics.roc_auc})</h3>
            <span className="badge badge-rain">Gold Standard</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-silver)', marginBottom: '1rem' }}>
            True Positive Rate vs. False Positive Rate across all probability thresholds.
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={roc_curve_samples} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={11} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={glassTooltipStyle} />
                <Line type="monotone" dataKey="tpr" stroke="#00c8ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Feature Importance Bar Chart */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
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
                <linearGradient id="importanceGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#002db3" />
                  <stop offset="100%" stopColor="#00c8ff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="%" />
              <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={11} width={150} />
              <Tooltip 
                contentStyle={glassTooltipStyle}
                formatter={(val) => [`${val}%`, 'Relative Tree Gain']}
              />
              <Bar dataKey="importance" fill="url(#importanceGrad)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
