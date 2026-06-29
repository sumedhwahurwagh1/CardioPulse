from fastapi import Request
from fastapi.responses import JSONResponse
from backend.services.logger import logger

class HeartDiseaseException(Exception):
    """Base exception for Heart Disease Classification System."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ModelNotLoadedException(HeartDiseaseException):
    """Raised when the model or scaler artifacts cannot be found or loaded."""
    def __init__(self, message: str = "Trained machine learning model is not loaded. Please run model training first."):
        super().__init__(message, status_code=503)

class PredictionException(HeartDiseaseException):
    """Raised when prediction computation fails."""
    def __init__(self, message: str):
        super().__init__(message, status_code=500)

async def heart_disease_exception_handler(request: Request, exc: HeartDiseaseException):
    logger.error(f"Custom HTTP exception occurred: {exc.message} (status: {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception occurred: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing the request."}
    )
