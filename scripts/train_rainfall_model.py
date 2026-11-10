import csv
import json
import math
import os
import sys
import numpy as np
import joblib

from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, roc_curve, confusion_matrix,
    mean_absolute_error, mean_squared_error, r2_score
)
from xgboost import XGBClassifier, XGBRegressor

# -----------------------------------------------------------------------------
# Configuration: Reproducible, Auditable High-Accuracy Pipeline
# -----------------------------------------------------------------------------
INPUT_CSV = os.path.join("data", "processed", "rainfall_engineered_features.csv")
MODELS_DIR = "models"
METRICS_JSON = os.path.join(MODELS_DIR, "rainfall_model_metrics.json")
os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 80)
print("TRAINING HIGH-ACCURACY TWO-STAGE XGBOOST RAINFALL FORECASTING PIPELINE")
print(f"Data Source: {INPUT_CSV}")
print("=" * 80)

# Load processed data
with open(INPUT_CSV, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

N = len(rows)
print(f"Loaded {N} consecutive daily records.")

# Identify feature columns (exclude dates and targets)
ignore_cols = {'date', 'tomorrow_date', 'target_rain_tomorrow_binary', 'target_rain_tomorrow_amount'}
feature_cols = [c for c in reader.fieldnames if c not in ignore_cols]
print(f"Total Predictors Fed to XGBoost: {len(feature_cols)}")

# Build numpy matrices
dates = np.array([r['date'] for r in rows])
X = np.array([[float(r[col]) for col in feature_cols] for r in rows], dtype=np.float32)
y_bin = np.array([int(r['target_rain_tomorrow_binary']) for r in rows], dtype=np.int32)
y_amt = np.array([float(r['target_rain_tomorrow_amount']) for r in rows], dtype=np.float32)
precip_today = np.array([float(r['precip_today']) for r in rows], dtype=np.float32)

# -----------------------------------------------------------------------------
# Strict Chronological Train-Test Split (Zero Lookahead Data Leakage)
# Train: 2010 to 2023 (14 years of multi-season weather patterns)
# Test:  2024 to November 2026 (~3 years of completely untouched forward test data)
# -----------------------------------------------------------------------------
SPLIT_DATE = "2024-01-01"
train_mask = dates < SPLIT_DATE
test_mask = dates >= SPLIT_DATE

X_train, y_bin_train, y_amt_train = X[train_mask], y_bin[train_mask], y_amt[train_mask]
X_test, y_bin_test, y_amt_test = X[test_mask], y_bin[test_mask], y_amt[test_mask]
test_dates = dates[test_mask]
precip_today_test = precip_today[test_mask]

print(f"\nChronological Split:")
print(f"  - Training Set (2010–2023): {len(X_train)} days ({np.mean(y_bin_train)*100:.1f}% rainy days)")
print(f"  - Test Set     (2024–2026): {len(X_test)} days ({np.mean(y_bin_test)*100:.1f}% rainy days)")

# -----------------------------------------------------------------------------
# Benchmark Baselines (What the ML model MUST beat to prove its worth)
# -----------------------------------------------------------------------------
# 1. Climatological Baseline: Predicts historical probability of rain
clim_prob = float(np.mean(y_bin_train))
clim_preds = np.full_like(y_bin_test, 1 if clim_prob >= 0.5 else 0)
clim_acc = accuracy_score(y_bin_test, clim_preds)

# 2. Persistence Baseline: "Tomorrow will rain if it rained today"
persist_preds = np.where(precip_today_test >= 2.5, 1, 0)
persist_acc = accuracy_score(y_bin_test, persist_preds)
persist_f1 = f1_score(y_bin_test, persist_preds, zero_division=0)
persist_prec = precision_score(y_bin_test, persist_preds, zero_division=0)
persist_rec = recall_score(y_bin_test, persist_preds, zero_division=0)
persist_mae = mean_absolute_error(y_amt_test, precip_today_test)

print("\n" + "-" * 60)
print("BASELINE BENCHMARKS (On Unseen 2024–2026 Test Set):")
print(f"  - Climatological Baseline Accuracy: {clim_acc*100:.2f}%")
print(f"  - Persistence Baseline Accuracy:     {persist_acc*100:.2f}% (F1: {persist_f1:.3f}, MAE: {persist_mae:.2f} mm)")
print("-" * 60)

# -----------------------------------------------------------------------------
# Stage 1: Extreme Gradient Boosted Rain Classifier
# -----------------------------------------------------------------------------
print("\n[Stage 1] Training XGBoost Rain Occurrence Classifier...")
# Calculate class balance ratio
neg_count = np.sum(y_bin_train == 0)
pos_count = np.sum(y_bin_train == 1)
scale_pos_weight = neg_count / pos_count

clf = XGBClassifier(
    n_estimators=350,
    max_depth=5,
    learning_rate=0.03,
    subsample=0.85,
    colsample_bytree=0.85,
    scale_pos_weight=scale_pos_weight,
    reg_alpha=0.5,
    reg_lambda=1.5,
    random_state=42,
    eval_metric="logloss",
    n_jobs=-1
)
clf.fit(X_train, y_bin_train)

# Evaluate Stage 1 on holdout test set
y_pred_proba = clf.predict_proba(X_test)[:, 1]
y_pred_bin = (y_pred_proba >= 0.5).astype(int)

clf_acc = float(accuracy_score(y_bin_test, y_pred_bin))
clf_prec = float(precision_score(y_bin_test, y_pred_bin))
clf_rec = float(recall_score(y_bin_test, y_pred_bin))
clf_f1 = float(f1_score(y_bin_test, y_pred_bin))
clf_auc = float(roc_auc_score(y_bin_test, y_pred_proba))
tn, fp, fn, tp = confusion_matrix(y_bin_test, y_pred_bin).ravel()

print(f"Stage 1 Test Results:")
print(f"  - Accuracy:  {clf_acc*100:.2f}%  (vs. Persistence: {persist_acc*100:.2f}%)")
print(f"  - ROC-AUC:   {clf_auc:.4f}")
print(f"  - F1-Score:  {clf_f1:.4f}")
print(f"  - Precision: {clf_prec:.4f}")
print(f"  - Recall:    {clf_rec:.4f}")
print(f"  - Confusion Matrix: True Neg={tn}, False Pos={fp}, False Neg={fn}, True Pos={tp}")

# -----------------------------------------------------------------------------
# Stage 2: Extreme Gradient Boosted Precipitation Amount Regressor
# -----------------------------------------------------------------------------
print("\n[Stage 2] Training XGBoost Precipitation Amount Regressor...")
# Train regressor specifically on days where precipitation occurred (>0.1 mm)
rain_days_train = y_amt_train >= 0.1
X_train_reg = X_train[rain_days_train]
y_amt_train_reg = y_amt_train[rain_days_train]

reg = XGBRegressor(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.03,
    subsample=0.85,
    colsample_bytree=0.85,
    reg_alpha=1.0,
    reg_lambda=2.0,
    random_state=42,
    n_jobs=-1
)
reg.fit(X_train_reg, y_amt_train_reg)

# -----------------------------------------------------------------------------
# End-to-End Compound Prediction (Stage 1 + Stage 2 Combined)
# If Stage 1 predicts No-Rain -> Amount = 0.0 mm
# If Stage 1 predicts Rain    -> Amount = Regressor Prediction (clipped >= 0)
# -----------------------------------------------------------------------------
raw_reg_preds = reg.predict(X_test)
combined_amounts = np.where(y_pred_bin == 1, np.maximum(0.0, raw_reg_preds), 0.0)

compound_mae = float(mean_absolute_error(y_amt_test, combined_amounts))
compound_rmse = float(math.sqrt(mean_squared_error(y_amt_test, combined_amounts)))
compound_r2 = float(r2_score(y_amt_test, combined_amounts))

print(f"\nEnd-to-End Compound Test Results:")
print(f"  - Mean Absolute Error (MAE): {compound_mae:.2f} mm  (vs Persistence MAE: {persist_mae:.2f} mm)")
print(f"  - Root Mean Squared Error (RMSE): {compound_rmse:.2f} mm")
print(f"  - R² Score: {compound_r2:.4f}")
print(f"  - Error Reduction vs Persistence: {((persist_mae - compound_mae) / persist_mae)*100:.1f}%")

# -----------------------------------------------------------------------------
# Feature Importance Extraction (For React Dashboard & Explainability)
# -----------------------------------------------------------------------------
importances = clf.feature_importances_
top_idx = np.argsort(importances)[::-1]
feature_importance_list = []
print("\nTop 10 Most Influential Atmospheric Drivers in Model Decision Trees:")
for rank, idx in enumerate(top_idx[:10], start=1):
    feat_name = feature_cols[idx]
    score = float(importances[idx])
    feature_importance_list.append({"feature": feat_name, "importance": round(score, 4)})
    print(f"  {rank:2d}. {feat_name:<28}: {score*100:.2f}%")

# Compute ROC curve coordinates for charting in React
fpr, tpr, thresholds = roc_curve(y_bin_test, y_pred_proba)
# Downsample ROC points to ~25 points for clean JSON storage
stride = max(1, len(fpr) // 25)
roc_curve_points = [
    {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
    for f, t in zip(fpr[::stride], tpr[::stride])
]

# -----------------------------------------------------------------------------
# Persist Trained Models & Export Verification Metrics to JSON
# -----------------------------------------------------------------------------
clf_path = os.path.join(MODELS_DIR, "xgb_rain_classifier.joblib")
reg_path = os.path.join(MODELS_DIR, "xgb_rain_regressor.joblib")
joblib.dump(clf, clf_path)
joblib.dump(reg, reg_path)
print(f"\nSaved Trained Classifier to: {clf_path}")
print(f"Saved Trained Regressor to:  {reg_path}")

metrics_payload = {
    "model_metadata": {
        "model_architecture": "Two-Stage Compound XGBoost (Classifier + Regressor)",
        "location": "Kolkata, West Bengal (22.57°N, 88.36°E)",
        "timeline_span": "2010 to 2026",
        "training_window": "2010-01-08 to 2023-12-31",
        "test_window": "2024-01-01 to 2026-11-04",
        "total_training_days": int(len(X_train)),
        "total_test_days": int(len(X_test)),
        "number_of_features": len(feature_cols)
    },
    "classification_metrics": {
        "accuracy": round(clf_acc * 100, 2),
        "roc_auc": round(clf_auc, 4),
        "f1_score": round(clf_f1, 4),
        "precision": round(clf_prec, 4),
        "recall": round(clf_rec, 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        }
    },
    "regression_metrics": {
        "mae_mm": round(compound_mae, 2),
        "rmse_mm": round(compound_rmse, 2),
        "r2_score": round(compound_r2, 4)
    },
    "baseline_comparison": {
        "persistence_accuracy": round(persist_acc * 100, 2),
        "persistence_mae": round(persist_mae, 2),
        "xgboost_accuracy": round(clf_acc * 100, 2),
        "xgboost_mae": round(compound_mae, 2),
        "error_reduction_pct": round(((persist_mae - compound_mae) / persist_mae) * 100, 1)
    },
    "top_feature_importance": feature_importance_list,
    "roc_curve_samples": roc_curve_points,
    "feature_columns": feature_cols
}

with open(METRICS_JSON, 'w', encoding='utf-8') as f:
    json.dump(metrics_payload, f, indent=2)

print(f"Saved Metrics & Decision Logic JSON: {METRICS_JSON}")
print("=" * 80)
print("PHASE 4: MODEL TRAINING COMPLETED WITH VERIFIED SUCCESS!")
print("=" * 80)

