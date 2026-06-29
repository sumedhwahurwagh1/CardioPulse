import time
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router
from backend.api.exceptions import (
    HeartDiseaseException,
    heart_disease_exception_handler,
    generic_exception_handler
)
from backend.services.logger import logger

def create_app() -> FastAPI:
    app = FastAPI(
        title="Heart Disease Classification API",
        description="FastAPI service for patient risk estimation and clinical advice.",
        version="1.0"
    )
    
    app.state.startup_time = time.time()

    # CORS configuration
    env = os.getenv("ENV", "development")
    if env == "production":
        origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "")
        allowed_origins = [orig.strip() for orig in origins_str.split(",") if orig.strip()]
        if not allowed_origins:
            # Fallback local/production targets if env not specified
            allowed_origins = ["http://localhost:5173", "http://localhost:8080"]
            logger.warning(f"Production CORS fallback initialized: {allowed_origins}")
    else:
        allowed_origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(router)

    # Register centralized exception handlers
    app.add_exception_handler(HeartDiseaseException, heart_disease_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    logger.info("FastAPI application instance created successfully.")
    return app

app = create_app()
