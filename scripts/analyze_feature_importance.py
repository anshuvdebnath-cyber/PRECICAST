import csv
import math
import os

CSV_PATH = os.path.join("data", "processed", "rainfall_engineered_features.csv")

with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

N = len(rows)
target_binary = [float(r['target_rain_tomorrow_binary']) for r in rows]
target_amount = [float(r['target_rain_tomorrow_amount']) for r in rows]

# Exclude dates and targets from predictors
ignore_cols = {'date', 'tomorrow_date', 'target_rain_tomorrow_binary', 'target_rain_tomorrow_amount'}
feature_cols = [c for c in reader.fieldnames if c not in ignore_cols]

def calc_corr(x_vals, y_vals):
    n = len(x_vals)
    mean_x = sum(x_vals) / n
    mean_y = sum(y_vals) / n
    num = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals))
    den_x = sum((x - mean_x) ** 2 for x in x_vals)
    den_y = sum((y - mean_y) ** 2 for y in y_vals)
    if den_x == 0 or den_y == 0:
        return 0.0
    return num / math.sqrt(den_x * den_y)

correlations = []
for col in feature_cols:
    vals = [float(r[col]) for r in rows]
    r_bin = calc_corr(vals, target_binary)
    r_amt = calc_corr(vals, target_amount)
    correlations.append((col, r_bin, r_amt))

# Sort by absolute correlation with rain tomorrow
correlations.sort(key=lambda item: abs(item[1]), reverse=True)

print("=" * 80)
print("FEATURE IMPACT AUDIT: PEARSON CORRELATION WITH TOMORROW'S RAIN")
print(f"Sample Size: {N} days | Evaluated Predictors: {len(feature_cols)}")
print("=" * 80)
print(f"{'Feature Name':<30} | {'Corr (Rain Tomorrow Yes/No)':<30} | {'Corr (Rain Amount mm)'}")
print("-" * 80)

for col, r_bin, r_amt in correlations:
    sign = "+" if r_bin > 0 else "-"
    strength = "*** (Strong)" if abs(r_bin) >= 0.3 else "** (Moderate)" if abs(r_bin) >= 0.15 else "* (Weak)"
    print(f"{col:<30} | {r_bin:+.4f} {strength:<15} | {r_amt:+.4f}")

print("=" * 80)

