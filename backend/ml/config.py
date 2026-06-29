import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "heart_disease_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Model and metadata paths
MODEL_PATH = os.path.join(MODEL_DIR, "heart_disease_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")
FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, "feature_names.json")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

# Features & target settings
TARGET_COL = "heart_disease"

FEATURE_COLS = [
    "age",
    "sex",
    "chest_pain_type",
    "resting_blood_pressure",
    "cholesterol",
    "fasting_blood_sugar",
    "resting_ecg",
    "max_heart_rate",
    "exercise_induced_angina",
    "st_depression",
    "st_slope",
    "num_major_vessels",
    "thalassemia"
]

# Random State and Train/Test Split config
RANDOM_STATE = int(os.getenv("RANDOM_STATE", "42"))
TEST_SIZE = float(os.getenv("TEST_SIZE", "0.2"))

# Categorical Feature Mapping (For prediction validation and labels)
CATEGORICAL_MAPPINGS = {
    "sex": {0: "Female", 1: "Male"},
    "chest_pain_type": {0: "Typical Angina", 1: "Atypical Angina", 2: "Non-Anginal Pain", 3: "Asymptomatic"},
    "fasting_blood_sugar": {0: "<=120mg/dl", 1: ">120mg/dl"},
    "resting_ecg": {0: "Normal", 1: "ST-T Wave Abnormality", 2: "Left Ventricular Hypertrophy"},
    "exercise_induced_angina": {0: "No", 1: "Yes"},
    "st_slope": {0: "Upsloping", 1: "Flat", 2: "Downsloping"},
    "thalassemia": {0: "Normal", 1: "Fixed Defect", 2: "Reversible Defect"}
}
