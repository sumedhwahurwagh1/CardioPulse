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
        title="CardioPulse API",
        description="AI-powered Heart Disease Classification API",
        version="1.0.0",
        contact={
            "name": "Sumedh Sanjay Wahurwagh",
            "email": "sumedhwahurwagh1@gmail.com",
            "url": "https://github.com/sumedhwahurwagh1"
        },
        license_info={
            "name": "© 2026 Sumedh Sanjay Wahurwagh. All Rights Reserved.",
            "url": "https://github.com/sumedhwahurwagh1/CardioPulse/blob/main/LICENSE"
        }
    )
    
    app.state.startup_time = time.time()

    # CORS configuration
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cardio-pulse.vercel.app"
    ]
    
    # Append additional origins from env if available
    origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "")
    if origins_str:
        extra_origins = [orig.strip() for orig in origins_str.split(",") if orig.strip()]
        allowed_origins.extend(extra_origins)
        
    logger.info(f"CORS allowed origins configured: {allowed_origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_origin_regex=r"https://.*\.vercel\.app",
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
