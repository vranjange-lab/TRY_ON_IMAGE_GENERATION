import os
import time
from gradio_client import Client, handle_file

candidate_spaces = [
    "yisol/IDM-VTON",
    "freddyaboulton/IDM-VTON",
    "Nymbo/IDM-VTON"
]

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

success = False
for space in candidate_spaces:
    print(f"\n--- Testing Space: {space} ---")
    try:
        client = Client(space)
        print(f"Connected to {space}. Submitting prediction...")
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
        print(f"--> SUCCESS from {space}: {result}")
        success = True
        break
    except Exception as e:
        print(f"--> FAILED from {space}: {type(e).__name__}: {str(e)}")

if not success:
    print("\nAll candidate spaces failed.")
