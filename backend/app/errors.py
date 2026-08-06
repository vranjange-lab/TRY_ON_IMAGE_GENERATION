import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger("drapely.errors")

# Custom Exceptions
class InvalidFileError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class LimitExceededError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class GenerationError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

# Exception Registration Function
def register_error_handlers(app: FastAPI):
    
    @app.exception_handler(InvalidFileError)
    async def invalid_file_exception_handler(request: Request, exc: InvalidFileError):
        logger.warning(f"Invalid file uploaded on {request.url.path}: {exc.message}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": exc.message, "error_type": "invalid_file_format"}
        )

    @app.exception_handler(LimitExceededError)
    async def limit_exceeded_exception_handler(request: Request, exc: LimitExceededError):
        logger.warning(f"File limit exceeded on {request.url.path}: {exc.message}")
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={"detail": exc.message, "error_type": "file_size_limit_exceeded"}
        )

    @app.exception_handler(GenerationError)
    async def generation_exception_handler(request: Request, exc: GenerationError):
        logger.error(f"Generation error on {request.url.path}: {exc.message}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": exc.message, "error_type": "tryon_generation_failure"}
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors(), "error_type": "request_validation_failed"}
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error on {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An unexpected server error occurred.", "error_type": "internal_server_error"}
        )
