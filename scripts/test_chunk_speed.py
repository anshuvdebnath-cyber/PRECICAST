import urllib.request
import json
import time

url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=22.57&longitude=88.36"
    "&start_date=2023-01-01&end_date=2023-12-31"
    "&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation"
    "&daily=precipitation_sum,rain_sum,temperature_2m_max,temperature_2m_min,temperature_2m_mean,wind_speed_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum"
    "&timezone=Asia/Kolkata"
)

start = time.time()
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=30) as response:
    data = json.loads(response.read().decode())
    elapsed = time.time() - start
    print(f"Downloaded 1 full year (hourly + daily) in {elapsed:.2f} seconds.")
    print("Hourly count:", len(data['hourly']['time']))
    print("Daily count:", len(data['daily']['time']))

