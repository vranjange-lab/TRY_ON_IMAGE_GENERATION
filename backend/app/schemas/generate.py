from pydantic import BaseModel
from typing import Optional

class GenerateRequest(BaseModel):
    user_image_path: str
    saree_image_path: str

class GenerateResponse(BaseModel):
    task_id: str
    status: str
    detail: str = "Try-on generation request registered."

class ResultResponse(BaseModel):
    task_id: str
    status: str
    result_image_path: Optional[str] = None
    error_message: Optional[str] = None
