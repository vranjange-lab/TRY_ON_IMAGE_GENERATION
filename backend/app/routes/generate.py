import uuid
import logging
from fastapi import APIRouter, status, HTTPException, BackgroundTasks
from app.schemas.generate import GenerateRequest, GenerateResponse, ResultResponse
from app.services.ai_service import ai_service
from app.services.storage_service import storage_service

logger = logging.getLogger("drapely.generate")
router = APIRouter(tags=["AI Generation & Orchestration"])

@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_tryon(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Receive user avatar and saree images to register a virtual try-on task.
    Executes FASHN AI Virtual Try-On via background task processing.
    """
    task_id = str(uuid.uuid4())
    logger.info(f"Registered try-on request for User Image: {request.user_image_path} and Saree Image: {request.saree_image_path}. Assigned Task ID: {task_id}")
    
    # Initialize task state as processing
    ai_service.tasks[task_id] = {
        "task_id": task_id,
        "status": "processing",
        "result_image_path": None,
        "error_message": None
    }
    
    # Queue background task execution
    background_tasks.add_task(
        ai_service.generate_tryon,
        request.user_image_path,
        request.saree_image_path,
        task_id
    )
    
    return GenerateResponse(
        task_id=task_id,
        status="registered",
        detail="Virtual try-on generation request registered."
    )

@router.get("/result/{id}", response_model=ResultResponse, status_code=status.HTTP_200_OK)
async def get_generation_result(id: str):
    """
    Retrieve the virtual try-on result state by task ID.
    Supports task polling from React frontend.
    """
    logger.info(f"Received result query for Task ID: {id}")
    task_info = ai_service.get_task_status(id)
    
    return ResultResponse(
        task_id=id,
        status=task_info.get("status", "processing"),
        result_image_path=task_info.get("result_image_path"),
        error_message=task_info.get("error_message")
    )

@router.delete("/cleanup", status_code=status.HTTP_200_OK)
async def cleanup_storage():
    """
    Purge all staged uploads, output renders, and temporary files from the system.
    """
    cleaned_items = storage_service.perform_cleanup()
    return {
        "status": "success",
        "detail": "Filesystem cleanup completed.",
        "purged_items": cleaned_items
    }
