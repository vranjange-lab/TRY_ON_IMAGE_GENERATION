import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("drapely.requests")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request start
        client_host = request.client.host if request.client else "unknown"
        logger.info(f"Incoming: {request.method} {request.url.path} from {client_host}")
        
        try:
            response = await call_next(request)
            
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Outgoing: {request.method} {request.url.path} - "
                f"Status {response.status_code} - Duration: {process_time:.2f}ms"
            )
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Failed request: {request.method} {request.url.path} - "
                f"Duration: {process_time:.2f}ms - Exception: {str(exc)}"
            )
            raise exc
