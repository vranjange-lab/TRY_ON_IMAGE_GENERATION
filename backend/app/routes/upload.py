from fastapi import APIRouter, UploadFile, File, status
from app.schemas.upload import UploadResponse
from app.services.storage_service import storage_service

router = APIRouter(prefix="/upload", tags=["Upload System"])

@router.post("/user-image", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_user_image(file: UploadFile = File(...)):
    """
    Upload a user photo for virtual try-on.
    Enforces format validation (PNG, JPG, JPEG) and size limit (Max 10MB).
    """
    # 1. Validate file
    size = storage_service.validate_file(file)
    
    # 2. Save file to disk in user_images folder
    saved_path = storage_service.save_file(file, "user_images")
    
    return UploadResponse(
        filename=file.filename or "unknown",
        path=saved_path,
        size=size,
        content_type=file.content_type or "application/octet-stream",
        detail="User image uploaded and validated successfully."
    )

@router.post("/saree-image", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_saree_image(file: UploadFile = File(...)):
    """
    Upload a saree flat lay or crop photo for virtual try-on.
    Enforces format validation (PNG, JPG, JPEG) and size limit (Max 10MB).
    """
    # 1. Validate file
    size = storage_service.validate_file(file)
    
    # 2. Save file to disk in saree_images folder
    saved_path = storage_service.save_file(file, "saree_images")
    
    return UploadResponse(
        filename=file.filename or "unknown",
        path=saved_path,
        size=size,
        content_type=file.content_type or "application/octet-stream",
        detail="Saree image uploaded and validated successfully."
    )
