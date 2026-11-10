import urllib.request
import json
import sys

# Test what daily variables Open-Meteo supports directly
daily_vars = [
    "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
    "apparent_temperature_max", "apparent_temperature_min", "apparent_temperature_mean",
    "precipitation_sum", "rain_sum", "precipitation_hours",
    "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant",
    "shortwave_radiation_sum", "et0_fao_evapotranspiration"
]

url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=22.57&longitude=88.36"
    "&start_date=2026-10-01&end_date=2026-10-02"
    f"&daily={','.join(daily_vars)}"
    "&timezone=Asia/Kolkata"
)

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as response:
        data = json.loads(response.read().decode())
        print("Supported daily variables:", list(data.get('daily', {}).keys()))
except Exception as e:
    print(f"Error: {e}")

