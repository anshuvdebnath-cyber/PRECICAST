import csv
import math
import os
import sys
from datetime import datetime

# -----------------------------------------------------------------------------
# Principal ML Engineering: Physics-Informed Feature Engineering Pipeline
# Target: Kolkata Next-Day Rainfall Prediction (t + 1)
# Standards: WMO (World Meteorological Organization) & IMD (India Met Dept)
# -----------------------------------------------------------------------------

INPUT_CSV = os.path.join("data", "raw", "kolkata_weather_2010_2026.csv")
OUTPUT_CSV = os.path.join("data", "processed", "rainfall_engineered_features.csv")
os.makedirs(os.path.join("data", "processed"), exist_ok=True)

print("=" * 75)
print("SENIOR ML PIPELINE: COMPUTING ATMOSPHERIC PHYSICS & TEMPORAL FEATURES")
print(f"Input Raw Data:  {INPUT_CSV}")
print(f"Output Features: {OUTPUT_CSV}")
print("=" * 75)

with open(INPUT_CSV, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    raw_rows = list(reader)

N = len(raw_rows)
print(f"Loaded {N} consecutive historical daily records.")

# Helper: parse float safely
def parse_f(val, default=0.0):
    try:
        return float(val) if val not in (None, "") else default
    except:
        return default

# Tetens formula for Saturation Vapor Pressure in kPa
def calc_es(temp_c):
    return 0.61078 * math.exp((17.27 * temp_c) / (temp_c + 237.3))

engineered_rows = []

# Pre-extract arrays for rolling window calculations
dates = [r['date'] for r in raw_rows]
precip = [parse_f(r['precipitation_sum']) for r in raw_rows]
pressures = [parse_f(r['surface_pressure_mean']) for r in raw_rows]
rh = [parse_f(r['humidity_mean']) for r in raw_rows]
temps = [parse_f(r['temp_mean']) for r in raw_rows]

# Running streak of consecutive rain days
rain_streaks = []
cur_streak = 0
for p in precip:
    if p >= 2.5: # IMD Rainy Day threshold
        cur_streak += 1
    else:
        cur_streak = 0
    rain_streaks.append(cur_streak)

# We need at least 7 days of historical lag (warmup = 7)
# And the very last day (t = N - 1) has no tomorrow in dataset, reserved for live forecasting
for t in range(7, N - 1):
    r = raw_rows[t]
    dt = datetime.strptime(dates[t], "%Y-%m-%d")
    doy = dt.timetuple().tm_yday
    dow = dt.weekday()

    t_mean = parse_f(r['temp_mean'])
    t_max = parse_f(r['temp_max'])
    t_min = parse_f(r['temp_min'])
    t_range = t_max - t_min  # Diurnal Temperature Range (DTR)

    rh_mean = parse_f(r['humidity_mean'])
    dew_mean = parse_f(r['dew_point_mean'])
    dew_dep = t_mean - dew_mean  # Dew point depression (saturation deficit)

    # 1. Thermodynamics: Vapor Pressure Deficit (VPD in kPa)
    es = calc_es(t_mean)
    ea = calc_es(dew_mean)
    vpd = max(0.0, round(es - ea, 3))

    # 2. Barometric Dynamics: Pressure Tendencies (troughs & cyclonic drops)
    p_curr = pressures[t]
    delta_p_24h = round(p_curr - pressures[t - 1], 2)
    delta_p_48h = round(p_curr - pressures[t - 2], 2)

    # 30-day rolling pressure baseline anomaly
    start_30 = max(0, t - 30)
    p_30_mean = sum(pressures[start_30:t]) / (t - start_30)
    pressure_anomaly = round(p_curr - p_30_mean, 2)

    # 3. Kinematics: Moisture Advection Vector from Bay of Bengal
    v_wind = parse_f(r['wind_v_mean'])  # Positive = Southerly wind (blowing from ocean to land)
    u_wind = parse_f(r['wind_u_mean'])  # Positive = Westerly wind
    moisture_flux_proxy = round(v_wind * (rh_mean / 100.0), 3)

    # 4. Precipitation Memory & Autoregressive Features
    p_today = precip[t]
    p_lag1 = precip[t - 1]
    p_lag2 = precip[t - 2]
    p_lag3 = precip[t - 3]
    p_lag7 = precip[t - 7]

    p_roll_3d = round(sum(precip[t-2:t+1]), 2)
    p_roll_7d = round(sum(precip[t-6:t+1]), 2)
    rain_streak = rain_streaks[t]

    # Binary persistence flags
    rain_today_flag = 1 if p_today >= 2.5 else 0
    rain_lag1_flag = 1 if p_lag1 >= 2.5 else 0

    # 5. Seasonal Oscillations (Smooth cyclic harmonic encodings)
    sin_doy = round(math.sin(2 * math.pi * doy / 365.25), 4)
    cos_doy = round(math.cos(2 * math.pi * doy / 365.25), 4)

    # Monsoon core window indicator (Kolkata Southwest Monsoon: June 10 to Sept 30)
    is_monsoon_core = 1 if (6 <= dt.month <= 9) else 0

    # 6. TARGET VARIABLES: Next-Day Ground Truth (t + 1)
    tomorrow_precip = precip[t + 1]
    # IMD Definition: A Rainy Day is daily precipitation >= 2.5 mm
    target_rain_tomorrow_binary = 1 if tomorrow_precip >= 2.5 else 0
    # Continuous precipitation for regression stage
    target_rain_tomorrow_amount = tomorrow_precip

    row = {
        'date': dates[t],
        'tomorrow_date': dates[t + 1],
        
        # Primary Atmospheric Predictors (Today t)
        'temp_mean': t_mean,
        'temp_max': t_max,
        'temp_min': t_min,
        'diurnal_temp_range': round(t_range, 2),
        'humidity_mean': rh_mean,
        'humidity_max': parse_f(r['humidity_max']),
        'dew_point_mean': dew_mean,
        'dew_point_depression': round(dew_dep, 2),
        'vapor_pressure_deficit': vpd,
        'surface_pressure_mean': p_curr,
        'surface_pressure_min': parse_f(r['surface_pressure_min']),
        'delta_pressure_24h': delta_p_24h,
        'delta_pressure_48h': delta_p_48h,
        'pressure_anomaly_30d': pressure_anomaly,
        'cloud_cover_mean': parse_f(r['cloud_cover_mean']),
        'wind_speed_max': parse_f(r['wind_speed_max']),
        'wind_u_mean': u_wind,
        'wind_v_mean': v_wind,
        'moisture_flux_proxy': moisture_flux_proxy,
        'solar_radiation_sum': parse_f(r['solar_radiation_sum']),
        
        # Precipitation History & Memory
        'precip_today': p_today,
        'precip_lag1': p_lag1,
        'precip_lag2': p_lag2,
        'precip_lag3': p_lag3,
        'precip_lag7': p_lag7,
        'precip_cum_3d': p_roll_3d,
        'precip_cum_7d': p_roll_7d,
        'rain_streak_days': rain_streak,
        'rain_today_flag': rain_today_flag,
        'rain_lag1_flag': rain_lag1_flag,
        
        # Temporal & Cyclic Features
        'month': dt.month,
        'sin_doy': sin_doy,
        'cos_doy': cos_doy,
        'is_monsoon_core': is_monsoon_core,

        # TARGETS (What the model will learn to predict)
        'target_rain_tomorrow_binary': target_rain_tomorrow_binary,
        'target_rain_tomorrow_amount': target_rain_tomorrow_amount
    }
    engineered_rows.append(row)

# Write to Processed CSV
fieldnames = list(engineered_rows[0].keys())
with open(OUTPUT_CSV, mode='w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(engineered_rows)

print("\n" + "=" * 75)
print(f"SUCCESS: Feature Engineering Complete!")
print(f"Saved Processed Matrix: {OUTPUT_CSV}")
print(f"Total Usable Training/Evaluation Days: {len(engineered_rows)}")
print(f"Total Engineered Features: {len(fieldnames) - 4} predictors + 2 targets + 2 dates")
print(f"Date Span: {engineered_rows[0]['date']} to {engineered_rows[-1]['date']}")
print("=" * 75)

