import csv
import json
import os
from collections import defaultdict

RAW_CSV = os.path.join("data", "raw", "kolkata_weather_2010_2026.csv")
FEAT_CSV = os.path.join("data", "processed", "rainfall_engineered_features.csv")
METRICS_JSON = os.path.join("models", "rainfall_model_metrics.json")
OUT_DIR = os.path.join("frontend", "src", "data")
os.makedirs(OUT_DIR, exist_ok=True)

print("Exporting data assets to frontend/src/data/...")

# 1. Copy metrics
with open(METRICS_JSON, 'r', encoding='utf-8') as f:
    metrics = json.load(f)
with open(os.path.join(OUT_DIR, "model_metrics.json"), 'w', encoding='utf-8') as f:
    json.dump(metrics, f, indent=2)

# 2. Historical Trends (Annual & Monthly)
with open(RAW_CSV, 'r', encoding='utf-8') as f:
    raw_rows = list(csv.DictReader(f))

annual_rain = defaultdict(float)
annual_rainy_days = defaultdict(int)
annual_extreme_days = defaultdict(int)
monthly_rain_totals = defaultdict(float)
monthly_counts = defaultdict(int)

for r in raw_rows:
    dt = r['date']
    year = dt.split('-')[0]
    month = dt.split('-')[1]
    p = float(r['precipitation_sum'])
    
    annual_rain[year] += p
    if p >= 2.5:
        annual_rainy_days[year] += 1
    if p >= 64.5:
        annual_extreme_days[year] += 1
        
    monthly_rain_totals[month] += p
    monthly_counts[month] += 1

month_names = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
}

annual_data = []
for y in sorted(annual_rain.keys()):
    annual_data.append({
        "year": y,
        "rainfall_mm": round(annual_rain[y], 1),
        "imd_normal_mm": 1650.0,
        "rainy_days": annual_rainy_days[y],
        "extreme_days": annual_extreme_days[y]
    })

monthly_data = []
for m in sorted(monthly_rain_totals.keys()):
    avg_m = monthly_rain_totals[m] / (monthly_counts[m] / 30.0) if monthly_counts[m] > 0 else 0
    # Average total monthly rainfall in mm
    avg_total_month = monthly_rain_totals[m] / len(annual_rain)
    monthly_data.append({
        "month": month_names[m],
        "avg_rainfall_mm": round(avg_total_month, 1),
        "is_monsoon": m in {"06", "07", "08", "09"}
    })

historical_payload = {
    "annual_trends": annual_data,
    "monthly_averages": monthly_data,
    "historical_cyclones": [
        {
            "name": "Super Cyclone Amphan",
            "date": "2020-05-20",
            "rainfall_mm": 99.1,
            "min_pressure_hpa": 964.5,
            "max_wind_kmh": 68.9,
            "description": "Category 5 equivalent super cyclone landfall over Gangetic delta. Lowest barometric pressure recorded in decades."
        },
        {
            "name": "Very Severe Cyclone Bulbul",
            "date": "2019-11-09",
            "rainfall_mm": 89.3,
            "min_pressure_hpa": 1002.0,
            "max_wind_kmh": 37.7,
            "description": "Severe post-monsoon cyclonic inundation paralyzing southern Kolkata and coastal 24 Parganas."
        },
        {
            "name": "Extreme Monsoon Waterlogging",
            "date": "2021-09-20",
            "rainfall_mm": 58.8,
            "min_pressure_hpa": 1000.7,
            "max_wind_kmh": 14.4,
            "description": "Heavy localized monsoon downpour triggering widespread urban waterlogging across Central Avenue and Ballygunge."
        }
    ]
}

with open(os.path.join(OUT_DIR, "historical_trends.json"), 'w', encoding='utf-8') as f:
    json.dump(historical_payload, f, indent=2)

# 3. Recent 45 days of observations
recent_rows = raw_rows[-45:]
recent_payload = []
for r in recent_rows:
    p = float(r['precipitation_sum'])
    recent_payload.append({
        "date": r['date'],
        "temp_mean": float(r['temp_mean']),
        "temp_max": float(r['temp_max']),
        "temp_min": float(r['temp_min']),
        "humidity_mean": float(r['humidity_mean']),
        "surface_pressure_mean": float(r['surface_pressure_mean']),
        "cloud_cover_mean": float(r['cloud_cover_mean']),
        "wind_speed_max": float(r['wind_speed_max']),
        "precipitation_sum": p,
        "is_rainy_day": p >= 2.5
    })

with open(os.path.join(OUT_DIR, "recent_observations.json"), 'w', encoding='utf-8') as f:
    json.dump(recent_payload, f, indent=2)

print("Export complete! Files created in frontend/src/data/:")
print("  - model_metrics.json")
print("  - historical_trends.json")
print("  - recent_observations.json")

