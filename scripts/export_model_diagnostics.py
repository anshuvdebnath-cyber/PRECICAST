"""
Export real, reproducible model diagnostics for the frontend.

Every number written by this script is computed from:
  * data/processed/rainfall_engineered_features.csv  (ERA5-derived features)
  * models/xgb_rain_classifier.joblib                (trained Stage 1 model)
  * models/xgb_rain_regressor.joblib                 (trained Stage 2 model)

on the untouched chronological test window (dates >= 2024-01-01), exactly as in
scripts/train_rainfall_model.py. Nothing is hand-entered.

Output: frontend/src/data/model_diagnostics.json
"""
import csv
import json
import os

import joblib
import numpy as np

FEAT_CSV = os.path.join("data", "processed", "rainfall_engineered_features.csv")
RAW_CSV = os.path.join("data", "raw", "kolkata_weather_2010_2026.csv")
CLF_PATH = os.path.join("models", "xgb_rain_classifier.joblib")
REG_PATH = os.path.join("models", "xgb_rain_regressor.joblib")
OUT_JSON = os.path.join("frontend", "src", "data", "model_diagnostics.json")
SPLIT_DATE = "2024-01-01"

IGNORE = {"date", "tomorrow_date", "target_rain_tomorrow_binary", "target_rain_tomorrow_amount"}

with open(FEAT_CSV, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    feature_cols = [c for c in reader.fieldnames if c not in IGNORE]

dates = np.array([r["date"] for r in rows])
tomorrow = np.array([r["tomorrow_date"] for r in rows])
X = np.array([[float(r[c]) for c in feature_cols] for r in rows], dtype=np.float32)
y_bin = np.array([int(r["target_rain_tomorrow_binary"]) for r in rows])
y_amt = np.array([float(r["target_rain_tomorrow_amount"]) for r in rows])
p_today = np.array([float(r["precip_today"]) for r in rows])

test = dates >= SPLIT_DATE
Xt, yt, at, pt = X[test], y_bin[test], y_amt[test], p_today[test]
months = np.array([int(d.split("-")[1]) for d in tomorrow[test]])

clf = joblib.load(CLF_PATH)
reg = joblib.load(REG_PATH)
proba = clf.predict_proba(Xt)[:, 1]
pred = (proba >= 0.5).astype(int)
persist = (pt >= 2.5).astype(int)


def pct(x):
    return round(float(x) * 100, 1)


# 1. Detection by IMD intensity class of the *actual* next-day rainfall
tiers = [
    ("dry", "No Rain", "Below 2.5 mm (IMD non-rainy day)", at < 2.5, 0),
    ("light", "Light Rain", "2.5 to 15.5 mm", (at >= 2.5) & (at <= 15.5), 1),
    ("moderate", "Moderate Rain", "15.6 to 64.4 mm", (at > 15.5) & (at < 64.5), 1),
    ("heavy", "Heavy Rain", "64.5 mm and above", at >= 64.5, 1),
]
tier_out = []
for key, label, rng, mask, target in tiers:
    n = int(mask.sum())
    tier_out.append({
        "key": key,
        "label": label,
        "range": rng,
        "days": n,
        "model_pct": pct((pred[mask] == target).mean()) if n else None,
        "persistence_pct": pct((persist[mask] == target).mean()) if n else None,
    })

# 2. Accuracy by official IMD season (month of the forecast target day)
seasons = [
    ("winter", "Winter", "January to February", np.isin(months, [1, 2])),
    ("premonsoon", "Pre-Monsoon", "March to May", np.isin(months, [3, 4, 5])),
    ("monsoon", "Southwest Monsoon", "June to September", np.isin(months, [6, 7, 8, 9])),
    ("postmonsoon", "Post-Monsoon", "October to December", np.isin(months, [10, 11, 12])),
]
season_out = []
for key, label, rng, mask in seasons:
    n = int(mask.sum())
    season_out.append({
        "key": key,
        "label": label,
        "range": rng,
        "days": n,
        "model_pct": pct((pred[mask] == yt[mask]).mean()),
        "persistence_pct": pct((persist[mask] == yt[mask]).mean()),
    })

# 3. Operating thresholds: recall / precision / accuracy at each probability cut-off
thr_out = []
for t in [0.2, 0.35, 0.5, 0.65, 0.8]:
    p = (proba >= t).astype(int)
    tp = int(((p == 1) & (yt == 1)).sum())
    fp = int(((p == 1) & (yt == 0)).sum())
    fn = int(((p == 0) & (yt == 1)).sum())
    thr_out.append({
        "threshold": t,
        "recall_pct": pct(tp / (tp + fn)) if tp + fn else 0.0,
        "precision_pct": pct(tp / (tp + fp)) if tp + fp else 0.0,
        "accuracy_pct": pct((p == yt).mean()),
    })


# 4. Feature importance straight from the trained boosters
def booster_share(model, kind):
    score = model.get_booster().get_score(importance_type=kind)
    named = {}
    for k, v in score.items():
        name = feature_cols[int(k[1:])] if k.startswith("f") and k[1:].isdigit() else k
        named[name] = float(v)
    total = sum(named.values()) or 1.0
    return {k: v / total for k, v in named.items()}


clf_gain = booster_share(clf, "gain")
clf_weight = booster_share(clf, "weight")
reg_gain = booster_share(reg, "gain")
top = sorted(clf_gain, key=clf_gain.get, reverse=True)[:7]
importance_out = {
    "features": top,
    "classifier_gain_pct": [pct(clf_gain.get(f, 0)) for f in top],
    "classifier_split_pct": [pct(clf_weight.get(f, 0)) for f in top],
    "regressor_gain_pct": [pct(reg_gain.get(f, 0)) for f in top],
}

# 5. Correct climatological monthly means (only complete months are averaged)
with open(RAW_CSV, "r", encoding="utf-8") as f:
    raw = list(csv.DictReader(f))
month_totals = {}
for r in raw:
    ym = r["date"][:7]
    month_totals[ym] = month_totals.get(ym, 0.0) + float(r["precipitation_sum"])
last_date = raw[-1]["date"]
partial_month = last_date[:7]
names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
monthly = []
for m in range(1, 13):
    vals = [v for ym, v in month_totals.items() if int(ym[5:]) == m and ym != partial_month]
    monthly.append({"month": names[m - 1], "avg_rainfall_mm": round(sum(vals) / len(vals), 1), "years": len(vals)})


# 6. Verify the storm-event figures against the raw ERA5 rows
def day(d):
    r = next(x for x in raw if x["date"] == d)
    return {
        "date": d,
        "rainfall_mm": float(r["precipitation_sum"]),
        "min_pressure_hpa": float(r["surface_pressure_min"]),
        "max_wind_kmh": float(r["wind_speed_max"]),
    }


storms = [day("2020-05-20"), day("2019-11-09"), day("2021-09-20")]

payload = {
    "source": "Computed by scripts/export_model_diagnostics.py from the saved XGBoost models on the 2024-01-01 onward test window.",
    "test_days": int(test.sum()),
    "test_first_day": str(dates[test][0]),
    "test_last_target_day": str(tomorrow[test][-1]),
    "data_last_day": last_date,
    "overall": {
        "model_accuracy_pct": pct((pred == yt).mean()),
        "persistence_accuracy_pct": pct((persist == yt).mean()),
    },
    "tiers": tier_out,
    "seasons": season_out,
    "thresholds": thr_out,
    "importance": importance_out,
    "monthly_climatology": monthly,
    "storm_check": storms,
}

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

print(json.dumps(payload, indent=2))

