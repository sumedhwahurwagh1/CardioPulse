import os
import joblib
import numpy as np
from backend.services.logger import logger
from backend.ml.config import MODEL_PATH, SCALER_PATH

def load_model_and_scaler() -> tuple:
    """Loads and returns the trained model and scaler from saved files."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler file not found at: {SCALER_PATH}")
        
    logger.info("Loading model and scaler artifacts...")
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

def predict_raw(model, scaler, input_features: np.ndarray) -> tuple:
    """Scales the input features and performs prediction and probability evaluation.
    
    Args:
        model: Trained classifier.
        scaler: Fitted StandardScaler.
        input_features: 2D numpy array of shape (n_samples, n_features).
        
    Returns:
        prediction: 1D array of class predictions (0 or 1).
        probabilities: 2D array of class probabilities.
    """
    logger.info("Running raw model prediction")
    scaled_features = scaler.transform(input_features)
    
    prediction = model.predict(scaled_features)
    
    if hasattr(model, 'predict_proba'):
        probabilities = model.predict_proba(scaled_features)
    else:
        # Fallback if model doesn't support predict_proba
        # (Although candidate SVM has probability=True, and LogisticRegression/KNN/RandomForest support it)
        logger.warning(f"Model type {type(model).__name__} does not support probability estimation natively.")
        # generate mock probabilities based on predictions
        probabilities = np.array([[1.0 - float(p), float(p)] for p in prediction])
        
    return prediction, probabilities
