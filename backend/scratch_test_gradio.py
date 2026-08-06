import os
import shutil
from pathlib import Path
from gradio_client import Client, handle_file

print("Initializing Gradio Client for 'yisol/IDM-VTON'...")
client = Client("yisol/IDM-VTON")

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

print(f"Person image: {person_path}")
print(f"Saree image: {saree_path}")

print("Sending request to Gradio /tryon endpoint...")
result = client.predict(
    dict={
        "background": handle_file(person_path),
        "layers": [],
        "composite": None
    },
    garm_img=handle_file(saree_path),
    garment_des="a clothing item from an e-commerce platform",
    is_checked=True,
    is_checked_crop=True,
    denoise_steps=30,
    seed=42,
    api_name="/tryon"
)

print(f"Gradio result: {result}")
