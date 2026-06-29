import os
import json
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from backend.services.logger import logger
from backend.ml.config import (
    RANDOM_STATE, MODEL_PATH, SCALER_PATH, METRICS_PATH,
    FEATURE_NAMES_PATH, METADATA_PATH, MODEL_DIR
)

def get_candidate_models() -> dict:
    """Returns candidate classification models as a dictionary."""
    return {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE),
        "KNN": KNeighborsClassifier(),
        "Decision Tree": DecisionTreeClassifier(random_state=RANDOM_STATE),
        "Random Forest": RandomForestClassifier(random_state=RANDOM_STATE),
        "SVM": SVC(probability=True, random_state=RANDOM_STATE)
    }

def train_candidate_models(models: dict, X_train, y_train) -> dict:
    """Fits candidate models on training data and returns them."""
    logger.info("Training candidate classification models...")
    for name, model in models.items():
        logger.info(f"Fitting model: {name}")
        model.fit(X_train, y_train)
    return models

def save_artifacts(model, scaler, feature_names: list, metrics: dict, metadata: dict):
    """Saves model and scaling artifacts, plus associated metadata/metrics JSONs."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save model and scaler
    logger.info(f"Saving model to: {MODEL_PATH}")
    joblib.dump(model, MODEL_PATH)
    
    logger.info(f"Saving scaler to: {SCALER_PATH}")
    joblib.dump(scaler, SCALER_PATH)
    
    # Save JSON files
    logger.info(f"Saving metrics to: {METRICS_PATH}")
    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=4)
        
    logger.info(f"Saving feature names to: {FEATURE_NAMES_PATH}")
    with open(FEATURE_NAMES_PATH, "w", encoding="utf-8") as f:
        json.dump(feature_names, f, indent=4)
        
    logger.info(f"Saving model metadata to: {METADATA_PATH}")
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)
        
    logger.info("All artifacts saved successfully!")
