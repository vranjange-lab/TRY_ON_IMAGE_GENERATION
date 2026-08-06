import os
from pathlib import Path
from dotenv import load_dotenv

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "Drapely AI Backend"
    API_V1_STR: str = "/api/v1"
    
    # Hugging Face token
    HF_TOKEN: str = os.getenv("HF_TOKEN")
    
    # Storage settings
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    OUTPUT_DIR: Path = BASE_DIR / "outputs"
    TEMP_DIR: Path = BASE_DIR / "temp"
    
    # File limits
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB in bytes
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg"}
    
    # CORS Origins
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]

settings = Settings()

