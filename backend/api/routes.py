import os
import time
from fastapi import APIRouter, HTTPException, Request
from backend.api.schemas import PatientData, PredictionResponse, ModelInfoResponse
from backend.api.exceptions import ModelNotLoadedException, PredictionException
from backend.services.prediction_service import prediction_service
from backend.services.logger import logger

router = APIRouter()

@router.get(
    "/",
    summary="Welcome & Service Status",
    description="Returns welcome messages and checks whether classification models are loaded in active memory."
)
def get_root():
    logger.info("Handling root endpoint request")
    return {
        "title": "Heart Disease Classification API",
        "description": "A production-ready machine learning API to predict likelihood of heart disease.",
        "status": "online",
        "model_loaded": prediction_service.is_model_loaded()
    }

@router.get(
    "/health",
    summary="Enhanced Service Health Check",
    description="Returns health status parameters including active API version, uptime (seconds), deployment environment, and model state."
)
def get_health(request: Request):
    logger.info("Handling health check endpoint request")
    model_loaded = prediction_service.is_model_loaded()
    status = "healthy" if model_loaded else "degraded"
    
    # Calculate uptime using registered startup timestamp
    startup_time = getattr(request.app.state, "startup_time", time.time())
    uptime_seconds = time.time() - startup_time
    env = os.getenv("ENV", "development")
    
    return {
        "status": status,
        "version": "1.0",
        "model_loaded": model_loaded,
        "uptime_seconds": round(uptime_seconds, 2),
        "environment": env
    }

@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Active Model Specifications",
    description="Returns performance evaluation metrics (accuracy, precision, etc.), expected feature lists, and metadata of the selected classifier model."
)
def get_model_info():
    logger.info("Handling model-info endpoint request")
    if not prediction_service.is_model_loaded():
        raise ModelNotLoadedException()
        
    try:
        model_info = prediction_service.get_model_info()
        return model_info
    except Exception as e:
        logger.error(f"Error fetching model info: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load model information.")

@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Coronary Risk Assessment Prediction",
    description="Accepts 13 clinical features for a patient, executes scaling transformations, estimates coronary risk probability via best-performing ML model, and returns risk stratifications and health recommendations."
)
def post_predict(patient: PatientData):
    logger.info(f"Handling prediction request for age {patient.age}")
    if not prediction_service.is_model_loaded():
        raise ModelNotLoadedException()
        
    try:
        patient_dict = patient.dict()
        prediction_result = prediction_service.predict_patient(patient_dict)
        return prediction_result
    except ValueError as val_err:
        logger.warning(f"Validation error during prediction: {str(val_err)}")
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        logger.error(f"Prediction failed: {str(exc)}", exc_info=True)
        raise PredictionException(f"Failed to generate prediction: {str(exc)}")
