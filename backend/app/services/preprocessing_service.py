import os
import sys
import uuid
import json
import logging
import shutil
import urllib.request
from pathlib import Path
import torch
import numpy as np
from PIL import Image

logger = logging.getLogger("drapely.preprocessing")

# Absolute path resolution for IDM-VTON codebase
BASE_DIR = Path(__file__).resolve().parents[3]
IDM_DIR = BASE_DIR / "IDM-VTON"

# Ensure IDM-VTON paths are registered in sys.path
for path_str in [str(IDM_DIR), str(IDM_DIR / "gradio_demo"), str(IDM_DIR / "preprocess")]:
    if path_str not in sys.path:
        sys.path.insert(0, path_str)

from app.errors import GenerationError, InvalidFileError
from app.config import settings

CHECKPOINTS = {
    IDM_DIR / "ckpt" / "humanparsing" / "parsing_atr.onnx": "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/ckpt/humanparsing/parsing_atr.onnx",
    IDM_DIR / "ckpt" / "humanparsing" / "parsing_lip.onnx": "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/ckpt/humanparsing/parsing_lip.onnx",
    IDM_DIR / "ckpt" / "densepose" / "model_final_162be9.pkl": "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/ckpt/densepose/model_final_162be9.pkl",
    IDM_DIR / "ckpt" / "openpose" / "ckpts" / "body_pose_model.pth": "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/ckpt/openpose/ckpts/body_pose_model.pth"
}

def ensure_checkpoints():
    """
    Verifies that all required AI preprocessing checkpoints exist.
    If a checkpoint file is missing or is a placeholder text file (<1KB), downloads it.
    """
    for path, url in CHECKPOINTS.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.stat().st_size < 1000:
            logger.info(f"Checkpoint file '{path.name}' missing or placeholder. Downloading from Hugging Face...")
            try:
                urllib.request.urlretrieve(url, str(path))
                logger.info(f"Downloaded '{path.name}' successfully (Size: {path.stat().st_size} bytes).")
            except Exception as e:
                logger.error(f"Failed to download checkpoint '{path.name}': {str(e)}")
                raise GenerationError(f"Required checkpoint '{path.name}' is missing and download failed: {str(e)}")

def resolve_file_path(path_str: str) -> Path:
    """
    Resolves input file paths whether given as absolute, relative to project root,
    or relative to backend directory.
    """
    p = Path(path_str)
    if p.is_absolute() and p.exists():
        return p
    
    candidates = [
        BASE_DIR / path_str,
        settings.UPLOAD_DIR.parent / path_str,
        Path.cwd() / path_str,
        settings.UPLOAD_DIR / path_str,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()
            
    return p.resolve()

class PreprocessingService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PreprocessingService, cls).__new__(cls)
            cls._instance._models_loaded = False
            cls._instance.parsing_model = None
            cls._instance.openpose_model = None
            cls._instance.densepose_args = None
        return cls._instance

    def load_models(self):
        """
        Load preprocessing AI models once during startup and retain them in GPU memory.
        """
        if self._models_loaded:
            return
        
        logger.info("Initializing and loading AI Preprocessing Models (Human Parsing, OpenPose, DensePose)...")
        try:
            # Ensure ONNX and PyTorch checkpoints are present
            ensure_checkpoints()

            if not torch.cuda.is_available():
                torch.cuda.set_device = lambda dev: None

            gpu_id = 0 if torch.cuda.is_available() else 0
            
            # 1. Initialize Human Parsing ONNX model
            from preprocess.humanparsing.run_parsing import Parsing
            self.parsing_model = Parsing(gpu_id)
            
            # 2. Initialize OpenPose detector
            from preprocess.openpose.run_openpose import OpenPose
            self.openpose_model = OpenPose(gpu_id)
            
            # 3. Initialize DensePose arguments and Predictor
            import apply_net
            self.apply_net = apply_net
            self.densepose_args = apply_net.create_argument_parser().parse_args((
                'show',
                str(IDM_DIR / 'configs' / 'densepose_rcnn_R_50_FPN_s1x.yaml'),
                str(IDM_DIR / 'ckpt' / 'densepose' / 'model_final_162be9.pkl'),
                'dp_segm',
                '-v',
                '--opts',
                'MODEL.DEVICE',
                'cuda' if torch.cuda.is_available() else 'cpu'
            ))
            
            self._models_loaded = True
            logger.info("AI Preprocessing Models loaded successfully into memory.")
        except Exception as exc:
            logger.error(f"Failed to load AI preprocessing models: {str(exc)}", exc_info=True)
            raise GenerationError(f"Failed to initialize AI preprocessing models: {str(exc)}")

    def process_pair(self, user_image_path: str, saree_image_path: str, pair_id: str) -> Path:
        """
        Processes person and saree images and automatically creates complete VITON-HD test structure:
        
        test/
            image/
            cloth/
            image-densepose/
            agnostic-mask/
            test_pairs.txt
            vitonhd_test_tagged.json
        """
        if not self._models_loaded:
            self.load_models()

        user_p = resolve_file_path(user_image_path)
        saree_p = resolve_file_path(saree_image_path)

        if not user_p.exists():
            raise InvalidFileError(f"Uploaded person image file not found at: {user_image_path}")
        if not saree_p.exists():
            raise InvalidFileError(f"Uploaded saree image file not found at: {saree_image_path}")

        logger.info(f"[{pair_id}] Preprocessing started for user image '{user_p.name}' and saree image '{saree_p.name}'")

        # Unique file naming scheme using pair_id UUID
        im_filename = f"{pair_id}.jpg"
        c_filename = f"{pair_id}.jpg"
        mask_filename = f"{pair_id}_mask.png"

        # Create temporary task folder: settings.TEMP_DIR / pair_id / "test"
        task_temp_dir = settings.TEMP_DIR / pair_id
        test_dir = task_temp_dir / "test"

        img_dir = test_dir / "image"
        cloth_dir = test_dir / "cloth"
        densepose_dir = test_dir / "image-densepose"
        mask_dir = test_dir / "agnostic-mask"

        for d in [img_dir, cloth_dir, densepose_dir, mask_dir]:
            d.mkdir(parents=True, exist_ok=True)

        try:
            # Step 1: Read and validate input images
            try:
                person_img_orig = Image.open(user_p).convert("RGB")
                saree_img_orig = Image.open(saree_p).convert("RGB")
            except Exception as e:
                logger.error(f"[{pair_id}] Image decoding error: {str(e)}")
                raise InvalidFileError(f"Failed to decode uploaded image files: {str(e)}")

            # Standardize resolution for VITON-HD pipeline (768x1024)
            person_img_768 = person_img_orig.resize((768, 1024), Image.Resampling.LANCZOS)
            saree_img_768 = saree_img_orig.resize((768, 1024), Image.Resampling.LANCZOS)

            person_img_768.save(img_dir / im_filename, quality=95)
            saree_img_768.save(cloth_dir / c_filename, quality=95)

            person_img_384 = person_img_orig.resize((384, 512), Image.Resampling.LANCZOS)

            # Step 2: Run Human Parsing
            logger.info(f"[{pair_id}] Running Human Parsing...")
            with torch.no_grad():
                try:
                    model_parse, _ = self.parsing_model(person_img_384)
                except Exception as e:
                    logger.error(f"[{pair_id}] Human Parsing error: {str(e)}", exc_info=True)
                    raise GenerationError(f"Human Parsing step failed: {str(e)}")
            logger.info(f"[{pair_id}] Human Parsing finished")

            # Step 3: Run OpenPose Detection
            logger.info(f"[{pair_id}] Running OpenPose Detection...")
            with torch.no_grad():
                try:
                    keypoints = self.openpose_model(person_img_384)
                except Exception as e:
                    logger.error(f"[{pair_id}] OpenPose detection error: {str(e)}", exc_info=True)
                    raise GenerationError(f"OpenPose keypoint detection failed: {str(e)}")
            logger.info(f"[{pair_id}] OpenPose finished")

            # Step 4: Run DensePose Surface Estimation
            logger.info(f"[{pair_id}] Running DensePose...")
            with torch.no_grad():
                try:
                    from detectron2.data.detection_utils import convert_PIL_to_numpy, _apply_exif_orientation
                    person_bgr = _apply_exif_orientation(person_img_384)
                    person_bgr_np = convert_PIL_to_numpy(person_bgr, format="BGR")

                    pose_img_np = self.densepose_args.func(self.densepose_args, person_bgr_np)
                    pose_img_rgb = pose_img_np[:, :, ::-1]
                    pose_img = Image.fromarray(pose_img_rgb).resize((768, 1024), Image.Resampling.LANCZOS)
                    pose_img.save(densepose_dir / im_filename, quality=95)
                except Exception as e:
                    logger.error(f"[{pair_id}] DensePose error: {str(e)}", exc_info=True)
                    raise GenerationError(f"DensePose surface estimation failed: {str(e)}")
            logger.info(f"[{pair_id}] DensePose finished")

            # Step 5: Generate Agnostic Mask
            logger.info(f"[{pair_id}] Generating Agnostic Mask...")
            try:
                from utils_mask import get_mask_location
                mask, _ = get_mask_location('hd', 'upper_body', model_parse, keypoints)
                mask = mask.resize((768, 1024), Image.Resampling.LANCZOS)
                mask.save(mask_dir / mask_filename)
            except Exception as e:
                logger.error(f"[{pair_id}] Agnostic Mask generation error: {str(e)}", exc_info=True)
                raise GenerationError(f"Agnostic mask generation failed: {str(e)}")
            logger.info(f"[{pair_id}] Agnostic Mask finished")

            # Step 6: Write test_pairs.txt and vitonhd_test_tagged.json
            logger.info(f"[{pair_id}] Generating VITON-HD metadata files...")
            try:
                pairs_file = test_dir / "test_pairs.txt"
                with open(pairs_file, "w", encoding="utf-8") as f:
                    f.write(f"{im_filename} {c_filename}\n")

                tagged_json = test_dir / "vitonhd_test_tagged.json"
                json_data = {
                    im_filename: [
                        {
                            "tag_info": [
                                {"tag_name": "item", "tag_category": "saree"},
                                {"tag_name": "neckLine", "tag_category": "round"},
                                {"tag_name": "sleeveLength", "tag_category": "sleeveless"}
                            ]
                        }
                    ]
                }
                with open(tagged_json, "w", encoding="utf-8") as f:
                    json.dump(json_data, f, indent=2)
            except Exception as e:
                logger.error(f"[{pair_id}] Metadata generation error: {str(e)}", exc_info=True)
                raise GenerationError(f"Dataset metadata generation failed: {str(e)}")
            logger.info(f"[{pair_id}] Dataset created")

            logger.info(f"[{pair_id}] VITON-HD preprocessing completed successfully at: {task_temp_dir}")
            return task_temp_dir

        except (InvalidFileError, GenerationError):
            raise
        except Exception as exc:
            logger.error(f"[{pair_id}] Unexpected error during preprocessing pipeline: {str(exc)}", exc_info=True)
            raise GenerationError(f"Preprocessing pipeline failed: {str(exc)}")

preprocessing_service = PreprocessingService()
