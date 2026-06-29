import os
import json
import pandas as pd
import numpy as np
from backend.services.logger import logger
from backend.ml.config import (
    FEATURE_COLS, MODEL_PATH, SCALER_PATH, METRICS_PATH,
    METADATA_PATH, FEATURE_NAMES_PATH
)
from backend.ml.predictor import load_model_and_scaler, predict_raw

class PredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads model and scaler, logging errors if not ready yet."""
        try:
            self.model, self.scaler = load_model_and_scaler()
            logger.info("Successfully loaded ML model and scaler artifacts.")
        except Exception as e:
            logger.warning(
                f"Could not load model artifacts on service initialization ({str(e)}). "
                "Ensure training has been completed."
            )

    def is_model_loaded(self) -> bool:
        """Returns True if model and scaler are loaded and ready."""
        if self.model is None or self.scaler is None:
            # Try reloading in case it was trained in the background
            try:
                self._load_artifacts()
            except Exception:
                pass
        return self.model is not None and self.scaler is not None

    def predict_patient(self, patient_data: dict) -> dict:
        """Executes full prediction pipeline for a single patient's details.
        
        Args:
            patient_data: Dictionary containing key-value pairs matching feature columns.
            
        Returns:
            Dictionary containing prediction status, probabilities, risk level, and health advice.
        """
        if not self.is_model_loaded():
            raise RuntimeError("Machine learning model is not loaded. Please run model training first.")

        # Ensure all required features are present
        missing_features = [col for col in FEATURE_COLS if col not in patient_data]
        if missing_features:
            raise ValueError(f"Patient details missing required attributes: {missing_features}")

        # Format input data in correct column order
        vals = [float(patient_data[col]) for col in FEATURE_COLS]
        input_df = pd.DataFrame([vals], columns=FEATURE_COLS)
        
        # Predict using predictor utility
        prediction_arr, probabilities_arr = predict_raw(self.model, self.scaler, input_df)
        
        prediction = int(prediction_arr[0])
        probabilities = probabilities_arr[0].tolist()
        
        # Risk level determination
        risk_probability = probabilities[1] * 100
        if risk_probability < 30.0:
            risk_level = "Low"
        elif risk_probability < 70.0:
            risk_level = "Medium"
        else:
            risk_level = "High"

        # Formulate health advice
        if prediction == 1:
            advice = [
                "Consult a cardiologist.",
                "Maintain a healthy diet.",
                "Exercise regularly.",
                "Monitor blood pressure and cholesterol."
            ]
            status = "Heart Disease Detected"
        else:
            advice = [
                "Continue a healthy lifestyle."
            ]
            status = "No Heart Disease"

        result = {
            "prediction": prediction,
            "status": status,
            "probability_disease": probabilities[1],
            "probability_no_disease": probabilities[0],
            "risk_level": risk_level,
            "advice": advice
        }
        
        logger.info(f"Generated prediction result: {result}")
        return result

    def get_model_info(self) -> dict:
        """Loads and returns model metrics, feature names, and metadata from JSONs."""
        info = {
            "model_loaded": self.is_model_loaded(),
            "metrics": {},
            "features": FEATURE_COLS,
            "metadata": {}
        }
        
        if os.path.exists(METRICS_PATH):
            try:
                with open(METRICS_PATH, "r", encoding="utf-8") as f:
                    info["metrics"] = json.load(f)
            except Exception as e:
                logger.error(f"Error reading metrics JSON: {str(e)}")

        if os.path.exists(METADATA_PATH):
            try:
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    info["metadata"] = json.load(f)
            except Exception as e:
                logger.error(f"Error reading metadata JSON: {str(e)}")

        if os.path.exists(FEATURE_NAMES_PATH):
            try:
                with open(FEATURE_NAMES_PATH, "r", encoding="utf-8") as f:
                    info["features"] = json.load(f)
            except Exception as e:
                logger.error(f"Error reading feature names JSON: {str(e)}")
                
        return info

# Singleton instance of PredictionService to share loaded model state
prediction_service = PredictionService()
