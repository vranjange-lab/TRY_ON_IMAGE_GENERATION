from fastapi import APIRouter, status
from datetime import datetime

router = APIRouter(tags=["Health"])

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Get backend status and current server time.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "Drapely AI Virtual Try-On API"
    }
