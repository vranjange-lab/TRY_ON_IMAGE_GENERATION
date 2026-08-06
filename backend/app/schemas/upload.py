from pydantic import BaseModel

class UploadResponse(BaseModel):
    filename: str
    path: str
    size: int
    content_type: str
    detail: str = "File uploaded successfully."
