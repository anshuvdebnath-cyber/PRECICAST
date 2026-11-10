import os
import sys
import json
import joblib
import numpy as np
import csv

# -----------------------------------------------------------------------------
# Interactive Model Tester for Next-Day Kolkata Rainfall Prediction
# -----------------------------------------------------------------------------
MODELS_DIR = "models"
CLF_PATH = os.path.join(MODELS_DIR, "xgb_rain_classifier.joblib")
REG_PATH = os.path.join(MODELS_DIR, "xgb_rain_regressor.joblib")
DATA_CSV = os.path.join("data", "processed", "rainfall_engineered_features.csv")

if not os.path.exists(CLF_PATH) or not os.path.exists(REG_PATH):
    print("Error: Trained model files not found in models/ directory.", file=sys.stderr)
    sys.exit(1)

# Load trained models
clf = joblib.load(CLF_PATH)
reg = joblib.load(REG_PATH)

# Load dataset for testing
with open(DATA_CSV, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

ignore = {'date', 'tomorrow_date', 'target_rain_tomorrow_binary', 'target_rain_tomorrow_amount'}
feature_cols = [c for c in reader.fieldnames if c not in ignore]
date_to_row = {r['date']: r for r in rows}

def predict_single_row(row_dict):
    x_vec = np.array([[float(row_dict[c]) for c in feature_cols]], dtype=np.float32)
    prob_rain = float(clf.predict_proba(x_vec)[0, 1])
    is_rain = 1 if prob_rain >= 0.5 else 0
    
    if is_rain == 1:
        raw_amt = float(reg.predict(x_vec)[0])
        pred_amount = max(0.1, round(raw_amt, 1))
    else:
        pred_amount = 0.0

    # IMD category
    if pred_amount < 0.1:
        cat = "☀️ Dry / No Rain"
    elif pred_amount <= 2.4:
        cat = "🌦️ Very Light / Trace Rain"
    elif pred_amount <= 15.5:
        cat = "🌧️ Light Rain"
    elif pred_amount <= 64.4:
        cat = "🌧️🌧️ Moderate Rain"
    else:
        cat = "⚠️ HEAVY DOWNPOUR (Waterlogging Hazard!)"

    return prob_rain, is_rain, pred_amount, cat

def run_date_test(target_date):
    if target_date not in date_to_row:
        print(f"Date '{target_date}' not found in dataset. Please enter a date between 2010-01-08 and 2026-11-04.")
        return

    r = date_to_row[target_date]
    prob, is_rain, pred_amt, cat = predict_single_row(r)
    
    actual_bin = int(r['target_rain_tomorrow_binary'])
    actual_amt = float(r['target_rain_tomorrow_amount'])
    tomorrow_date = r['tomorrow_date']
    
    is_match = (is_rain == actual_bin)
    status_icon = "✅ CORRECT PREDICTION!" if is_match else "❌ MISMATCH"

    print("\n" + "=" * 65)
    print(f"WEATHER SITUATION ON: {target_date}")
    print(f"  • Today's Rainfall:        {r['precip_today']} mm")
    print(f"  • Today's Mean Temp:       {r['temp_mean']} °C (Max: {r['temp_max']} °C, Min: {r['temp_min']} °C)")
    print(f"  • Mean Relative Humidity:  {r['humidity_mean']} %")
    print(f"  • Surface Pressure:        {r['surface_pressure_mean']} hPa (24h ΔP: {r['delta_pressure_24h']} hPa)")
    print(f"  • Mean Cloud Cover:        {r['cloud_cover_mean']} %")
    print(f"  • Moisture Wind (v-vector):{r['wind_v_mean']} km/h (from Bay of Bengal)")
    print("-" * 65)
    print(f"MODEL FORECAST FOR TOMORROW ({tomorrow_date}):")
    print(f"  • Rain Probability:        {prob*100:.1f} %")
    print(f"  • Status Prediction:       {cat}")
    print(f"  • Estimated Rainfall:      {pred_amt:.1f} mm")
    print("-" * 65)
    print(f"GROUND TRUTH REALITY (What actually happened on {tomorrow_date}):")
    print(f"  • Actual Rainfall:         {actual_amt:.1f} mm")
    print(f"  • Actual IMD Status:       {'🌧️ Rainy Day (>=2.5 mm)' if actual_bin == 1 else '☀️ Dry Day (<2.5 mm)'}")
    print(f"  • EVALUATION VERDICT:      {status_icon}")
    print("=" * 65 + "\n")

def run_custom_simulation():
    print("\n" + "=" * 65)
    print("INTERACTIVE WHAT-IF WEATHER SIMULATOR")
    print("Enter custom weather values for Kolkata:")
    print("=" * 65)
    try:
        humidity = float(input("Enter Relative Humidity (e.g. 40 to 95 %): ") or 85.0)
        pressure = float(input("Enter Surface Pressure in hPa (e.g. 995 to 1018): ") or 998.0)
        cloud = float(input("Enter Cloud Cover (e.g. 0 to 100 %): ") or 90.0)
        precip_today = float(input("Enter Today's Rain in mm (e.g. 0.0 or 15.0): ") or 10.0)
        temp = float(input("Enter Mean Temperature in °C (e.g. 28.0): ") or 28.0)
    except Exception as e:
        print("Invalid input, using sample values.")
        humidity, pressure, cloud, precip_today, temp = 85.0, 998.0, 90.0, 10.0, 28.0

    # Build representative row using median values as baseline
    sample_row = dict(rows[len(rows)//2])
    sample_row['humidity_mean'] = humidity
    sample_row['humidity_max'] = min(100.0, humidity + 8.0)
    sample_row['surface_pressure_mean'] = pressure
    sample_row['surface_pressure_min'] = pressure - 2.0
    sample_row['cloud_cover_mean'] = cloud
    sample_row['precip_today'] = precip_today
    sample_row['rain_today_flag'] = 1 if precip_today >= 2.5 else 0
    sample_row['temp_mean'] = temp
    sample_row['dew_point_mean'] = temp - (100 - humidity) / 5.0
    sample_row['dew_point_depression'] = (100 - humidity) / 5.0

    prob, is_rain, pred_amt, cat = predict_single_row(sample_row)

    print("\n" + "-" * 65)
    print("MODEL SIMULATION RESULT:")
    print(f"  • Simulated Rain Probability: {prob*100:.1f} %")
    print(f"  • Forecast Category:          {cat}")
    print(f"  • Estimated Rainfall Amount:  {pred_amt:.1f} mm")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1].strip()
        if arg == "--custom":
            run_custom_simulation()
        else:
            run_date_test(arg)
    else:
        print("\n" + "#" * 65)
        print("AUTOMATED TEST SUITE ON UNSEEN RECENT 2024 DATES")
        print("#" * 65)
        test_scenarios = [
            ("2024-01-15", "Dry Winter Day (Clear skies, low humidity)"),
            ("2024-07-25", "Peak Active Monsoon Day (Heavy clouds, south winds)"),
            ("2024-08-18", "Monsoon Transition Day"),
            ("2024-10-12", "Post-Monsoon Autumn Day")
        ]
        for dt, desc in test_scenarios:
            print(f">>> Scenario: {desc}")
            run_date_test(dt)

        print("\nHOW YOU CAN TEST IT YOURSELF:")
        print("1. Test ANY historical date in Kolkata:")
        print("     python scripts/test_model_interactive.py 2024-07-02")
        print("2. Run the interactive What-If Simulator:")
        print("     python scripts/test_model_interactive.py --custom\n")
