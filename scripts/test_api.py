import urllib.request
import json
import sys

# Test query for Kolkata coordinates to verify supported parameters on Copernicus ERA5
test_url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=22.57&longitude=88.36"
    "&start_date=2026-10-01&end_date=2026-10-05"
    "&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,"
    "precipitation_sum,rain_sum,precipitation_hours,"
    "wind_speed_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum"
    "&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,"
    "surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m"
    "&timezone=Asia/Kolkata"
)

try:
    req = urllib.request.Request(test_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as response:
        data = json.loads(response.read().decode())
        print("SUCCESS! API responded.")
        print("Daily keys:", list(data.get('daily', {}).keys()))
        print("Hourly keys:", list(data.get('hourly', {}).keys()))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

