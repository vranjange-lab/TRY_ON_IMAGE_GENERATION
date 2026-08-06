import os
import sys
import time
import uuid
import logging
import shutil
import urllib.request
from pathlib import Path

from app.config import settings
from app.errors import GenerationError

logger = logging.getLogger("drapely.ai_service")

BASE_DIR = Path(__file__).resolve().parents[3]

def resolve_file_path(path_str: str) -> Path:
    """
    Resolves input file paths whether given as absolute, relative to project root,
    or relative to backend directory.
    """
    if not path_str:
        raise GenerationError("File path string cannot be empty.")
        
    p = Path(path_str)
    if p.is_absolute() and p.exists():
        return p
    
    candidates = [
        BASE_DIR / path_str,
        settings.UPLOAD_DIR.parent / path_str,
        Path.cwd() / path_str,
        settings.UPLOAD_DIR / path_str,
        settings.UPLOAD_DIR / "user_images" / Path(path_str).name,
        settings.UPLOAD_DIR / "saree_images" / Path(path_str).name,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()
            
    return p.resolve()


class AIService:
    def __init__(self):
        self.tasks = {}

    def generate_tryon(self, user_image_path: str, saree_image_path: str, task_id: str = None) -> dict:
        """
        Executes virtual try-on using Gradio Client connected to yisol/IDM-VTON HuggingFace space.
        Matches FitMirror architecture.
        """
        if not task_id:
            task_id = str(uuid.uuid4())

        logger.info(f"[{task_id}] Gradio IDM-VTON try-on generation initiated.")
        self.tasks[task_id] = {
            "task_id": task_id,
            "status": "processing",
            "result_image_path": None,
            "error_message": None
        }

        try:
            # 1. Resolve absolute file paths
            abs_user_path = resolve_file_path(user_image_path)
            abs_saree_path = resolve_file_path(saree_image_path)

            logger.info(f"[{task_id}] User Image: {abs_user_path}")
            logger.info(f"[{task_id}] Saree Image: {abs_saree_path}")

            if not abs_user_path.exists():
                raise GenerationError(f"User image file not found: {abs_user_path}")
            if not abs_saree_path.exists():
                raise GenerationError(f"Saree image file not found: {abs_saree_path}")

            # 2. Connect to Gradio client for yisol/IDM-VTON space
            from gradio_client import Client, handle_file

            hf_token = os.getenv("HF_TOKEN")
            logger.info(f"[{task_id}] Connecting to Gradio space 'yisol/IDM-VTON' (HF_TOKEN set: {bool(hf_token)})...")
            client = Client("yisol/IDM-VTON", token=hf_token)

            max_retries = 5
            result = None
            last_exception = None

            for attempt in range(1, max_retries + 1):
                try:
                    logger.info(f"[{task_id}] Executing predict on Gradio /tryon endpoint (Attempt {attempt}/{max_retries})...")
                    result = client.predict(
                        {
                            "background": handle_file(str(abs_user_path)),
                            "layers": [],
                            "composite": None
                        },
                        handle_file(str(abs_saree_path)),
                        "a clothing item from an e-commerce platform",
                        True,
                        True,
                        40,
                        42,
                        api_name="/tryon"
                    )
                    logger.info(f"[{task_id}] Gradio API prediction returned successfully on attempt {attempt}: {result}")
                    break
                except Exception as exc:
                    last_exception = exc
                    err_str = str(exc)
                    if "AcceleratorError" in err_str and attempt < max_retries:
                        logger.warning(f"[{task_id}] Received transient ZeroGPU 'AcceleratorError' on attempt {attempt}. Retrying in 5 seconds...")
                        time.sleep(5)
                    else:
                        raise exc

            # 3. Locate output generated image filepath or URL from prediction result
            generated_file_path = None

            if isinstance(result, (tuple, list)) and len(result) > 0:
                item = result[0]
                if isinstance(item, str):
                    generated_file_path = item
                elif isinstance(item, dict):
                    generated_file_path = item.get("path") or item.get("url")
            elif isinstance(result, str):
                generated_file_path = result
            elif isinstance(result, dict):
                generated_file_path = result.get("path") or result.get("url")

            if not generated_file_path:
                raise GenerationError(f"Gradio IDM-VTON prediction finished but output image file path or URL was not found in result: {result}")

            # 4. Save output image into backend/outputs/
            settings.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

            if isinstance(generated_file_path, str) and (generated_file_path.startswith("http://") or generated_file_path.startswith("https://")):
                filename = f"generated_{task_id}.png"
                final_path = settings.OUTPUT_DIR / filename
                urllib.request.urlretrieve(generated_file_path, str(final_path))
            else:
                gen_path = Path(generated_file_path)
                if not gen_path.exists():
                    raise GenerationError(f"Gradio IDM-VTON prediction finished but output image file does not exist on disk: {gen_path}")

                filename = f"generated_{task_id}{gen_path.suffix or '.png'}"
                final_path = settings.OUTPUT_DIR / filename
                shutil.copy(gen_path, final_path)

            logger.info(f"[{task_id}] Saved generated try-on output image to: {final_path}")

            relative_path = f"outputs/{filename}"
            result_data = {
                "task_id": task_id,
                "status": "completed",
                "result_image_path": relative_path,
                "absolute_image_path": str(final_path),
                "error_message": None,
                "detail": "Virtual try-on generated successfully via Gradio IDM-VTON."
            }

            self.tasks[task_id].update(result_data)
            return result_data

        except Exception as exc:
            error_msg = str(exc)
            logger.error(f"[{task_id}] Gradio IDM-VTON Generation Error: {error_msg}", exc_info=True)
            self.tasks[task_id]["status"] = "failed"
            self.tasks[task_id]["error_message"] = f"Gradio IDM-VTON Generation Error: {error_msg}"
            return self.tasks[task_id]

    def get_task_status(self, task_id: str) -> dict:
        """
        Retrieves current task state for frontend result polling.
        """
        return self.tasks.get(task_id, {
            "task_id": task_id,
            "status": "not_found",
            "result_image_path": None,
            "error_message": f"Task ID '{task_id}' not found."
        })


ai_service = AIService()