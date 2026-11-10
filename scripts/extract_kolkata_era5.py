import urllib.request
import json
import csv
import math
import os
import sys
import time
from datetime import datetime

# -----------------------------------------------------------------------------
# Configuration: Verified Coordinates & Target Timeline for Kolkata
# -----------------------------------------------------------------------------
LATITUDE = 22.57   # Kolkata central latitude
LONGITUDE = 88.36  # Kolkata central longitude
START_YEAR = 2010
END_YEAR = 2026

CACHE_DIR = os.path.join("data", "raw", "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

OUTPUT_CSV = os.path.join("data", "raw", "kolkata_weather_2010_2026.csv")
METADATA_JSON = os.path.join("data", "raw", "dataset_metadata.json")

print("=" * 70)
print("EXTRACTING VERIFIED COPERNICUS ERA5 ATMOSPHERIC DATA FOR KOLKATA")
print(f"Coordinates: Lat {LATITUDE}°N, Lon {LONGITUDE}°E")
print(f"Timeline: {START_YEAR} to {END_YEAR}")
print(f"Cache Directory: {CACHE_DIR} (Year-by-Year Resumable Cache)")
print("=" * 70)

all_daily_rows = []

for year in range(START_YEAR, END_YEAR + 1):
    cache_file = os.path.join(CACHE_DIR, f"era5_{year}.json")
    
    # 1. If year is already downloaded and cached, load from disk immediately
    if os.path.exists(cache_file):
        print(f"Year {year}: Loaded from local verified cache.")
        with open(cache_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        # 2. Fetch from Open-Meteo API with rate-limit respect and retry backoff
        start_date = f"{year}-01-01"
        end_date = "2026-11-05" if year == 2026 else f"{year}-12-31"

        url = (
            "https://archive-api.open-meteo.com/v1/archive?"
            f"latitude={LATITUDE}&longitude={LONGITUDE}"
            f"&start_date={start_date}&end_date={end_date}"
            "&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,"
            "surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation"
            "&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,"
            "precipitation_sum,rain_sum,precipitation_hours,"
            "wind_speed_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum"
            "&timezone=Asia/Kolkata"
        )

        max_retries = 3
        data = None
        for attempt in range(1, max_retries + 1):
            try:
                print(f"Fetching Year {year} ({start_date} to {end_date})...", end=" ", flush=True)
                t0 = time.time()
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (EVS Research Data Pipeline)'})
                with urllib.request.urlopen(req, timeout=45) as resp:
                    data = json.loads(resp.read().decode())
                elapsed = time.time() - t0
                print(f"Done in {elapsed:.2f}s.")
                # Save to cache so we never re-request this year
                with open(cache_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f)
                # Polite pause to strictly adhere to API rate limits (avoid HTTP 429)
                time.sleep(3)
                break
            except urllib.error.HTTPError as e:
                if e.code == 429:
                    wait_sec = 15 * attempt
                    print(f"\n[Rate Limit Pause] Server requested cooldown (HTTP 429). Waiting {wait_sec}s before retry...", flush=True)
                    time.sleep(wait_sec)
                else:
                    print(f"\nHTTP Error {e.code}: {e}", file=sys.stderr)
                    if attempt == max_retries: sys.exit(1)
            except Exception as e:
                print(f"\nNetwork Error: {e}. Retrying in 5s...", file=sys.stderr)
                time.sleep(5)
                if attempt == max_retries: sys.exit(1)

        if not data:
            print(f"Failed to fetch year {year} after {max_retries} retries.", file=sys.stderr)
            sys.exit(1)

    daily = data.get('daily', {})
    hourly = data.get('hourly', {})
    num_days = len(daily.get('time', []))

    # Map hourly records by date (24 readings per day)
    hourly_by_date = {}
    h_times = hourly.get('time', [])
    h_temp = hourly.get('temperature_2m', [])
    h_rh = hourly.get('relative_humidity_2m', [])
    h_dew = hourly.get('dew_point_2m', [])
    h_press = hourly.get('surface_pressure', [])
    h_cloud = hourly.get('cloud_cover', [])
    h_ws = hourly.get('wind_speed_10m', [])
    h_wd = hourly.get('wind_direction_10m', [])

    for i, t_str in enumerate(h_times):
        d_str = t_str.split('T')[0]
        if d_str not in hourly_by_date:
            hourly_by_date[d_str] = {
                'temp': [], 'rh': [], 'dew': [], 'press': [],
                'cloud': [], 'ws': [], 'wd': []
            }
        if h_temp[i] is not None: hourly_by_date[d_str]['temp'].append(h_temp[i])
        if h_rh[i] is not None: hourly_by_date[d_str]['rh'].append(h_rh[i])
        if h_dew[i] is not None: hourly_by_date[d_str]['dew'].append(h_dew[i])
        if h_press[i] is not None: hourly_by_date[d_str]['press'].append(h_press[i])
        if h_cloud[i] is not None: hourly_by_date[d_str]['cloud'].append(h_cloud[i])
        if h_ws[i] is not None: hourly_by_date[d_str]['ws'].append(h_ws[i])
        if h_wd[i] is not None: hourly_by_date[d_str]['wd'].append(h_wd[i])

    # Assemble comprehensive daily rows
    for i in range(num_days):
        d_str = daily['time'][i]
        h_data = hourly_by_date.get(d_str, {})

        press_vals = h_data.get('press', [])
        press_mean = round(sum(press_vals) / len(press_vals), 2) if press_vals else None
        press_min = round(min(press_vals), 2) if press_vals else None
        press_max = round(max(press_vals), 2) if press_vals else None

        rh_vals = h_data.get('rh', [])
        rh_mean = round(sum(rh_vals) / len(rh_vals), 2) if rh_vals else None
        rh_max = round(max(rh_vals), 2) if rh_vals else None
        rh_min = round(min(rh_vals), 2) if rh_vals else None

        dew_vals = h_data.get('dew', [])
        dew_mean = round(sum(dew_vals) / len(dew_vals), 2) if dew_vals else None

        cloud_vals = h_data.get('cloud', [])
        cloud_mean = round(sum(cloud_vals) / len(cloud_vals), 2) if cloud_vals else None

        # Wind vectors (u = east-west, v = north-south)
        ws_vals = h_data.get('ws', [])
        wd_vals = h_data.get('wd', [])
        if ws_vals and wd_vals:
            u_components = []
            v_components = []
            for ws, wd in zip(ws_vals, wd_vals):
                rad = math.radians(wd)
                u_components.append(-ws * math.sin(rad))
                v_components.append(-ws * math.cos(rad))
            wind_u_mean = round(sum(u_components) / len(u_components), 2)
            wind_v_mean = round(sum(v_components) / len(v_components), 2)
        else:
            wind_u_mean = None
            wind_v_mean = None

        t_mean = daily['temperature_2m_mean'][i]
        t_max = daily['temperature_2m_max'][i]
        t_min = daily['temperature_2m_min'][i]

        precip = daily['precipitation_sum'][i] if daily['precipitation_sum'][i] is not None else 0.0
        precip = round(precip, 2)
        precip_hours = daily['precipitation_hours'][i] if daily['precipitation_hours'][i] is not None else 0.0

        dew_point_depression = round(t_mean - dew_mean, 2) if (t_mean is not None and dew_mean is not None) else None
        rain_imd_day = 1 if precip >= 2.5 else 0

        row = {
            'date': d_str,
            'temp_max': t_max,
            'temp_min': t_min,
            'temp_mean': t_mean,
            'temp_range': round(t_max - t_min, 2) if (t_max is not None and t_min is not None) else None,
            'humidity_mean': rh_mean,
            'humidity_max': rh_max,
            'humidity_min': rh_min,
            'dew_point_mean': dew_mean,
            'dew_point_depression': dew_point_depression,
            'surface_pressure_mean': press_mean,
            'surface_pressure_min': press_min,
            'surface_pressure_max': press_max,
            'cloud_cover_mean': cloud_mean,
            'wind_speed_max': daily['wind_speed_10m_max'][i],
            'wind_direction_dominant': daily['wind_direction_10m_dominant'][i],
            'wind_u_mean': wind_u_mean,
            'wind_v_mean': wind_v_mean,
            'solar_radiation_sum': daily['shortwave_radiation_sum'][i],
            'precipitation_hours': precip_hours,
            'precipitation_sum': precip,
            'rain_imd_day': rain_imd_day
        }
        all_daily_rows.append(row)

# -----------------------------------------------------------------------------
# Save to CSV
# -----------------------------------------------------------------------------
fieldnames = list(all_daily_rows[0].keys())
with open(OUTPUT_CSV, mode='w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_daily_rows)

print("\n" + "=" * 70)
print(f"SUCCESSFULLY SAVED DATASET: {OUTPUT_CSV}")
print(f"Total Daily Observations: {len(all_daily_rows)}")
print(f"Date Span: {all_daily_rows[0]['date']} to {all_daily_rows[-1]['date']}")

# Save Metadata
metadata = {
    "dataset_name": "Kolkata Atmospheric & Precipitation Daily Reanalysis",
    "primary_source": "Copernicus Climate Change Service (C3S) / ECMWF ERA5",
    "service_provider": "Open-Meteo Historical Weather API (https://open-meteo.com)",
    "coordinates": {"latitude": LATITUDE, "longitude": LONGITUDE, "city": "Kolkata", "state": "West Bengal", "country": "India"},
    "temporal_range": {"start_date": all_daily_rows[0]['date'], "end_date": all_daily_rows[-1]['date'], "total_days": len(all_daily_rows)},
    "extraction_timestamp": datetime.now().isoformat(),
    "rain_criteria": {
        "rain_imd_day": "Precipitation >= 2.5 mm (Standard India Meteorological Department definition of an official Rainy Day)",
        "light_rain": "0.1 to 15.5 mm",
        "moderate_rain": "15.6 to 64.4 mm",
        "heavy_rain": ">= 64.5 mm"
    },
    "features_extracted": fieldnames
}

with open(METADATA_JSON, 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2)

print(f"Metadata Documentation saved to: {METADATA_JSON}")
print("=" * 70)
