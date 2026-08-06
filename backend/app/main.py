import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.logging_config import setup_logging
from app.errors import register_error_handlers
from app.middlewares.logging_middleware import RequestLoggingMiddleware

# Routers
from app.routes.health import router as health_router
from app.routes.upload import router as upload_router
from app.routes.generate import router as generate_router

# Setup Logging
logger = setup_logging()

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Production-ready FastAPI backend for Drapely AI Virtual Saree Try-On. Handles file uploads and schedules IDM-VTON model runs.",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # 1. Setup CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Register Request Logging Middleware
    app.add_middleware(RequestLoggingMiddleware)

    # 3. Register Custom Exception Handlers
    register_error_handlers(app)

    # 4. Create required directories on startup
    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting Drapely AI Backend...")
        directories = [settings.UPLOAD_DIR, settings.OUTPUT_DIR, settings.TEMP_DIR]
        for directory in directories:
            if not directory.exists():
                logger.info(f"Creating storage directory: {directory}")
                directory.mkdir(parents=True, exist_ok=True)
                
        # Create subdirectories for image types
        (settings.UPLOAD_DIR / "user_images").mkdir(exist_ok=True)
        (settings.UPLOAD_DIR / "saree_images").mkdir(exist_ok=True)
        logger.info("Storage directories initialized successfully.")

    # 5. Include API Routers
    app.include_router(health_router, prefix=settings.API_V1_STR)
    app.include_router(upload_router, prefix=settings.API_V1_STR)
    app.include_router(generate_router, prefix=settings.API_V1_STR)

    # Optional: Mount uploads and outputs for static file serving in development
    # (Lets frontend access files directly if needed)
    app.mount("/static/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")
    app.mount("/static/outputs", StaticFiles(directory=str(settings.OUTPUT_DIR)), name="outputs")

    logger.info("FastAPI Application fully loaded.")
    return app

app = create_app()
