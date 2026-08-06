import os
import shutil
import logging
from pathlib import Path
from fastapi import UploadFile
from app.config import settings
from app.errors import InvalidFileError, LimitExceededError

logger = logging.getLogger("drapely.storage")

class StorageService:
    @staticmethod
    def validate_file(file: UploadFile):
        # 1. Validate Extension
        filename = file.filename or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise InvalidFileError(
                f"Unsupported file format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
            
        # 2. Validate Size (Must check by reading chunk or spool file)
        # Note: file.file is a SpooledTemporaryFile. We can seek to end to verify length.
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0)  # Reset pointer to start for reading later
        
        if size > settings.MAX_UPLOAD_SIZE:
            max_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
            size_mb = size / (1024 * 1024)
            raise LimitExceededError(
                f"File size exceeds limit of {max_mb:.0f}MB. Uploaded: {size_mb:.2f}MB"
            )
        
        return size

    @staticmethod
    def save_file(file: UploadFile, subfolder: str) -> str:
        # Get target directory
        target_dir = settings.UPLOAD_DIR / subfolder
        os.makedirs(target_dir, exist_ok=True)
        
        # Save file with original name (sanitized)
        filename = os.path.basename(file.filename or "uploaded_file")
        # Ensure unique name to prevent overwriting
        name_part, ext_part = os.path.splitext(filename)
        counter = 1
        unique_filename = filename
        while (target_dir / unique_filename).exists():
            unique_filename = f"{name_part}_{counter}{ext_part}"
            counter += 1
            
        target_path = target_dir / unique_filename
        
        logger.info(f"Saving uploaded file to: {target_path}")
        try:
            with open(target_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as exc:
            logger.error(f"Failed to write file to disk: {str(exc)}", exc_info=True)
            raise IOError("Could not save the uploaded file to disk.")
            
        return str(target_path)

    @staticmethod
    def perform_cleanup() -> dict:
        logger.info("Starting cleanup of storage directories...")
        cleaned = {"uploads": 0, "outputs": 0, "temp": 0}
        
        # Helper to purge folder contents
        def purge_directory(directory_path: Path) -> int:
            count = 0
            if not directory_path.exists():
                return count
            for item in directory_path.iterdir():
                try:
                    if item.is_file() or item.is_symlink():
                        item.unlink()
                        count += 1
                    elif item.is_dir():
                        shutil.rmtree(item)
                        count += 1
                except Exception as exc:
                    logger.error(f"Error deleting item {item}: {str(exc)}")
            return count

        # Purge temporary files
        cleaned["temp"] = purge_directory(settings.TEMP_DIR)
        
        # Purge uploads subfolders
        if settings.UPLOAD_DIR.exists():
            for sub in settings.UPLOAD_DIR.iterdir():
                if sub.is_dir():
                    cleaned["uploads"] += purge_directory(sub)
        
        # Purge outputs folder
        cleaned["outputs"] = purge_directory(settings.OUTPUT_DIR)
        
        logger.info(f"Cleanup finished. Purged items: {cleaned}")
        return cleaned

storage_service = StorageService()
