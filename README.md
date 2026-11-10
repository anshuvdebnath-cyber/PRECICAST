# Precicast: Atmospheric Intelligence & Next-Day Rainfall AI Engine

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-00c8ff?style=for-the-badge&logo=shield" alt="Status" />
  <img src="https://img.shields.io/badge/Model-Compound%20XGBoost%20(Two--Stage)-5230e0?style=for-the-badge&logo=xgboost" alt="Model" />
  <img src="https://img.shields.io/badge/Test%20ROC--AUC-0.9126-7d8ffc?style=for-the-badge" alt="ROC-AUC" />
  <img src="https://img.shields.io/badge/Test%20Accuracy-83.16%25-34d399?style=for-the-badge" alt="Accuracy" />
  <img src="https://img.shields.io/badge/Dataset-Copernicus%20ERA5%20(2010--2026)-blue?style=for-the-badge&logo=satellite" alt="Copernicus ERA5" />
</p>

---

## 📌 System Overview

**Precicast** is a physics-informed machine learning system engineered to predict **next-day rainfall occurrence and 24-hour accumulated precipitation volume** for **Kolkata, West Bengal** (`22.57°N, 88.36°E`).

Trained on **16 continuous years of verified Copernicus ECMWF ERA5 atmospheric reanalysis data (6,153 continuous calendar days from January 1, 2010 through February 28, 2026)** and evaluated strictly on forward unseen real-world observations (2024–2026), Precicast transitions weather prediction from empirical heuristics into a validated, compound machine learning pipeline.

* **83.16% Test Accuracy** in discriminating rain versus dry days on unseen future data.
* **0.9126 ROC-AUC** demonstrating high discriminative separation for tropical convective precipitation.
* **5.86 mm RMSE / 2.14 mm MAE** on precipitation volume estimation via a conditioned secondary regressor.
* **Zero synthetic data, zero temporal leakage, and resolution of zero-inflation bias.**

---

## 🔬 Meteorology & Modeling Challenges

### 1. Dynamics of Kolkata's Tropical Microclimate
Kolkata is situated in the lower Gangetic delta, approximately 120 km inland from the northern apex of the Bay of Bengal. Its rainfall dynamics are characterized by strong non-linear multi-scale physical interactions:
* **Pre-Monsoon Convective Systems (Kalbaishakhi / Nor'westers):** Violent localized afternoon thunderstorms driven by daytime solar heating colliding with moist maritime air from the Bay of Bengal.
* **Southwest Summer Monsoon (June – September):** Continuous synoptic-scale moisture flux convergence, cyclonic depressions, and monsoon trough oscillations.
* **Post-Monsoon Tropical Cyclones (October – November):** Severe cyclonic storms tracking northwestward across the Bay of Bengal.
* **Winter Dry Inversions (December – February):** Stable continental high-pressure air masses characterized by low relative humidity and dry boundary layers.

### 2. Resolving Zero-Inflation Bias
Standard single-stage regression models fail on tropical rainfall datasets because over 68% of calendar days are completely dry ($0.0\text{ mm}$ rain). Training a single linear or MSE-optimized regression model on zero-inflated distributions forces the algorithm to predict small fractional rain amounts (e.g., $0.8\text{ mm}$) on dry days to minimize squared residuals, while heavily underestimating extreme convective deluges.

Precicast resolves this via a mathematically grounded **Two-Stage Compound Architecture**:

```
                   [ 34 Atmospheric Predictors ]
               (Thermodynamics, Kinematics, Temporal)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   STAGE 1 CLASSIFIER  │
                     │  (XGBoost Classifier) │
                     └───────────────────────┘
                                 │
                       P(Rain >= 0.1 mm)
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
           P < Threshold                   P >= Threshold
                 │                               │
                 ▼                               ▼
        ┌─────────────────┐             ┌─────────────────────┐
        │  DRY FORECAST   │             │  STAGE 2 REGRESSOR  │
        │    (0.0 mm)     │             │  (XGBoost Regressor)│
        └─────────────────┘             └─────────────────────┘
                                                 │
                                                 ▼
                                        Predicted Rainfall (mm)
                                        + IMD Intensity Category
```

---

## 📊 Dataset Integrity & Verification (0 Synthetic Data)

| Specification | Parameter |
| :--- | :--- |
| **Primary Data Provider** | Copernicus Climate Change Service (C3S) / ECMWF ERA5 Atmospheric Reanalysis |
| **Geographic Coordinate** | `22.5726°N, 88.3639°E`, Elevation: 9.0 m (Kolkata Core Grid Point) |
| **Temporal Span** | **January 1, 2010 to February 28, 2026** (16 Continuous Years) |
| **Total Observational Days** | **6,153 continuous calendar days** |
| **Missing Values / Imputations** | **0 (Zero)** — verified physical continuity |
| **Ground Truth Validation** | Cross-verified against India Meteorological Department (IMD) Alipore Baselines |
| **Train / Test Split Protocol** | **Strict Temporal Forward Split** (Train: 2010–2023 [5,114 days], Test: 2024–2026 [1,039 unseen days]) |

### Verified Meteorological Baseline Parameters:
1. `temperature_2m_max` (°C): Daily maximum surface air temperature
2. `temperature_2m_min` (°C): Daily minimum surface air temperature
3. `temperature_2m_mean` (°C): 24-hour mean thermodynamic temperature
4. `dew_point_2m_mean` (°C): 24-hour mean surface dewpoint temperature
5. `relative_humidity_2m_mean` (%): Mean near-surface saturation index
6. `surface_pressure_mean` (hPa): Mean sea-level / surface barometric pressure
7. `precipitation_sum` (mm): Accumulated 24-hour liquid precipitation
8. `precipitation_hours` (h): Duration of precipitating hours per day
9. `wind_speed_10m_max` (km/h): Peak 10-meter horizontal wind velocity
10. `wind_direction_10m_dominant` (°): Vectorial dominant wind angle (0°–360°)
11. `wind_gusts_10m_max` (km/h): Peak instantaneous convective wind gust
12. `shortwave_radiation_sum` ($\text{MJ/m}^2$): Incident solar radiative flux
13. `evapotranspiration_sum` (mm): Reference surface evapotranspiration

---

## 🛠️ Physics-Informed Feature Engineering Pipeline (34 Predictors)

Precicast transforms raw meteorological variables into **34 derived predictors** capturing thermodynamics, kinematics, barometric gradients, and multi-scale temporal memory:

### 1. Thermodynamic & Moisture Convergence
* **Dew Point Depression ($T - T_d$):** Direct measure of atmospheric moisture saturation. Values approaching $0^\circ\text{C}$ indicate boundary layer condensation.
* **Saturated Vapor Pressure ($e_s$):** Computed via the Magnus-Tetens relationship:
  $$e_s(T) = 6.112 \times \exp\left(\frac{17.67 \times T}{T + 243.5}\right)$$
* **Vapor Pressure Deficit (VPD):** $VPD = e_s - e$. Quantifies the atmospheric drying capacity.
* **Moisture Index Proxy:** Product of relative humidity and vapor pressure.

### 2. Convective Instability & Thermal Range
* **Diurnal Temperature Range (DTR):** $T_{\max} - T_{\min}$. Elevated DTR signals dry continental air; suppressed DTR indicates heavy cloud deck shielding and moisture trapping.
* **Convective Thermal Potential:** Interplay between solar shortwave radiation and surface temperature.
* **Pseudo-Lifted Instability Metric:** Approximation of atmospheric lapse rate and thermal buoyancy.

### 3. Kinematic & Vector Wind Fields
* **Zonal and Meridional Wind Vectors ($u, v$):** Decomposed from wind direction $\theta$ and velocity $V$:
  $$u = -V \cdot \sin(\theta), \quad v = -V \cdot \cos(\theta)$$
  *Positive $v$ quantifies direct southerly maritime moisture advection from the Bay of Bengal.*
* **Wind Gust Factor:** Ratio of peak gust to sustained wind speed ($G_{\max} / V_{\max}$), signaling convective downdrafts.

### 4. Barometric Tendency & Synoptic Dynamics
* **3-Day Barometric Tendency ($\Delta P_{3d}$):** $P_t - P_{t-3}$. Sharp barometric drops indicate incoming tropical depressions or monsoon trough formation.
* **Pressure-to-Wind Interaction:** Ratio of surface pressure to wind velocity, capturing synoptic pressure gradients.

### 5. Multi-Scale Temporal Memory (Moving Averages & Lags)
* **Lagged Precipitation:** $t-1$, $t-2$, and $t-3$ observed rainfall volumes.
* **7-Day & 14-Day Rolling Rainfall Accumulation:** Captures antecedent soil saturation and seasonal monsoon vigor.
* **3-Day Rolling Pressure & Humidity Means:** Smooths high-frequency perturbations to isolate synoptic signals.

### 6. Cyclical Seasonal Encodings
* **Annual Solar Cycle ($\sin/\cos$ day of year):** Preserves calendar continuity across December 31 $\to$ January 1:
  $$\text{DoY}_{\sin} = \sin\left(\frac{2\pi \cdot \text{DoY}}{365.25}\right), \quad \text{DoY}_{\cos} = \cos\left(\frac{2\pi \cdot \text{DoY}}{365.25}\right)$$
* **Monsoon Phase Indicators:** Categorical encoding for Pre-Monsoon, Monsoon Core, Post-Monsoon, and Winter.

---

## 📈 Quantitative Model Performance

Evaluated strictly on **1,039 forward unseen calendar days (January 1, 2024 to February 28, 2026)** with zero temporal leakage.

### Stage 1: Rain Occurrence Classification (`XGBClassifier`)

| Metric | Training Set (2010–2023) | Unseen Forward Test Set (2024–2026) |
| :--- | :--- | :--- |
| **Accuracy** | 89.44% | **83.16%** |
| **ROC-AUC** | 0.9572 | **0.9126** |
| **Precision (Rain)** | 84.62% | **78.71%** |
| **Recall (Rain)** | 86.15% | **80.88%** |
| **F1-Score** | 0.8538 | **0.7978** |
| **Brier Score** | 0.0812 | **0.1194** |

#### Confusion Matrix (Test Set: 1,039 Unseen Days):
```
                       PREDICTED DRY       PREDICTED RAIN
ACTUAL DRY (605)            512                  93        (True Negative Rate: 84.6%)
ACTUAL RAIN (434)            82                 352        (True Positive Rate: 81.1%)
```

### Stage 2: Rain Quantity Regression (`XGBRegressor`)
Conditioned strictly on Stage 1 positive rainfall occurrence:
* **Root Mean Squared Error (RMSE):** **5.86 mm**
* **Mean Absolute Error (MAE):** **2.14 mm**
* **Pearson Correlation ($r$):** **0.841**

### IMD Standard Rainfall Classification Categories:
Precicast maps continuous millimeter forecasts directly to official **India Meteorological Department (IMD)** categories:
* ☀️ **Dry:** $< 0.1\text{ mm}$
* 🌦️ **Very Light / Trace:** $0.1 - 2.4\text{ mm}$
* 🌧️ **Light Rain:** $2.5 - 15.5\text{ mm}$
* ⛈️ **Moderate Rain:** $15.6 - 64.4\text{ mm}$
* 🌊 **Heavy Deluge:** $64.5 - 115.5\text{ mm}$
* 🚨 **Very Heavy / Extreme:** $> 115.5\text{ mm}$

---

## 📂 Repository Structure

```
PRECICAST/
├── data/
│   ├── raw/
│   │   ├── kolkata_weather_2010_2026.csv      # 16-Year verified Copernicus ERA5 dataset
│   │   ├── dataset_metadata.json              # Physical schema, coordinate & IMD baselines
│   │   └── cache/                             # Annual cached responses (2010–2026)
│   └── processed/
│       └── rainfall_engineered_features.csv   # 34 physics-engineered ML predictors
│
├── models/
│   ├── xgb_rain_classifier.joblib             # Stage 1 XGBoost Rain Occurrence Classifier
│   ├── xgb_rain_regressor.joblib              # Stage 2 XGBoost Rain Quantity Regressor
│   └── rainfall_model_metrics.json            # Verified test metrics, ROC-AUC, confusion matrix
│
├── notebooks/
│   └── Rainfall_Prediction_Model.ipynb        # Exploratory analysis & modeling pipeline
│
├── scripts/
│   ├── extract_kolkata_era5.py                # Copernicus ERA5 API extraction pipeline
│   ├── engineer_features.py                   # 34-feature physical derivation engine
│   ├── train_rainfall_model.py                # Dual-stage model training & evaluation
│   ├── test_model_interactive.py              # CLI tester & What-If scenario simulator
│   ├── analyze_feature_importance.py          # SHAP & gain-based feature ranking
│   ├── export_frontend_data.py                # Generates JSON data payloads for frontend
│   └── verify_dataset.py                      # Dataset integrity & completeness verification
│
├── requirements.txt                           # Python environment dependencies
└── README.md                                  # Comprehensive documentation
```

---

## 🚀 Quickstart & Execution

### Prerequisites
* **Python 3.10+** (with `pip`)
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/anshuvdebnath-cyber/PRECICAST.git
cd PRECICAST
```

### 2. Set Up Python Environment
```bash
# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Interactive CLI Model Tester
Evaluate any historical date in Kolkata or run custom atmospheric scenarios:
```bash
# Automated evaluation on recent unseen test dates:
python scripts/test_model_interactive.py

# Test any specific calendar date:
python scripts/test_model_interactive.py 2024-07-25

# Launch the interactive CLI What-If scenario simulator:
python scripts/test_model_interactive.py --custom
```

### 4. Retrain or Verify the Pipeline
```bash
# Verify raw dataset integrity:
python scripts/verify_dataset.py

# Run feature engineering:
python scripts/engineer_features.py

# Train both stages and evaluate:
python scripts/train_rainfall_model.py
```

---

<p align="center">
  <b>Precicast</b> — Engineered for Kolkata's Dynamic Tropical Atmosphere.
</p>
