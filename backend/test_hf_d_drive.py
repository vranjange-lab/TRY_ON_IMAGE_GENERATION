import os
import sys
import shutil
from pathlib import Path
import torch

# Redirect HF Cache to D:\hf_cache before importing diffusers/transformers
if os.path.exists("D:\\"):
    os.environ["HF_HOME"] = "D:\\hf_cache"
    os.makedirs("D:\\hf_cache", exist_ok=True)
    d_free = shutil.disk_usage("D:\\").free / (1024**3)
    print(f"[TEST] Redirected HF_HOME to D:\\hf_cache (Free space: {d_free:.2f} GB)")

BASE_DIR = Path(__file__).resolve().parents[1]
IDM_DIR = BASE_DIR / "IDM-VTON"
for p in [str(IDM_DIR), str(IDM_DIR / "gradio_demo"), str(IDM_DIR / "preprocess")]:
    if p not in sys.path:
        sys.path.insert(0, p)

from diffusers import AutoencoderKL, DDPMScheduler
from transformers import AutoTokenizer, CLIPImageProcessor, CLIPVisionModelWithProjection, CLIPTextModelWithProjection, CLIPTextModel
from src.unet_hacked_tryon import UNet2DConditionModel
from src.unet_hacked_garmnet import UNet2DConditionModel as UNet2DConditionModel_ref

model_id = "yisol/IDM-VTON"
print(f"Testing model loading for '{model_id}' on D: drive...")

subfolders = [
    ("scheduler", DDPMScheduler, {}),
    ("vae", AutoencoderKL, {"torch_dtype": torch.float16}),
    ("tokenizer", AutoTokenizer, {"use_fast": False}),
    ("tokenizer_2", AutoTokenizer, {"use_fast": False}),
    ("text_encoder", CLIPTextModel, {"torch_dtype": torch.float16}),
    ("text_encoder_2", CLIPTextModelWithProjection, {"torch_dtype": torch.float16}),
    ("unet", UNet2DConditionModel, {"torch_dtype": torch.float16}),
    ("image_encoder", CLIPVisionModelWithProjection, {"torch_dtype": torch.float16}),
    ("unet_encoder", UNet2DConditionModel_ref, {"torch_dtype": torch.float16}),
]

for sub, cls, kwargs in subfolders:
    try:
        print(f"Loading subfolder '{sub}'...")
        obj = cls.from_pretrained(model_id, subfolder=sub, **kwargs)
        print(f"  --> SUCCESS: '{sub}' loaded.")
    except Exception as e:
        print(f"  --> FAILED: '{sub}': {type(e).__name__}: {str(e)}")
