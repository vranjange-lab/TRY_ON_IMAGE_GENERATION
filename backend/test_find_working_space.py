import os
import sys
import traceback
from gradio_client import Client, handle_file

spaces_to_test = [
    "Kwai-Kolors/Kolors-Virtual-Try-On",
    "zhengchong/CatVTON",
    "levihsu/OOTDiffusion",
    "yisol/IDM-VTON"
]

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

print(f"Person image: {person_path}")
print(f"Saree image: {saree_path}")

for space_id in spaces_to_test:
    print(f"\n==================================================")
    print(f"TESTING SPACE: {space_id}")
    print(f"==================================================")
    try:
        c = Client(space_id)
        print("Connected successfully. API Info:")
        try:
            c.view_api()
        except Exception as ve:
            print(f"view_api error: {ve}")

        print("\nSubmitting test prediction...")
        if "Kolors" in space_id:
            # Kwai-Kolors/Kolors-Virtual-Try-On API
            res = c.predict(
                person_img=handle_file(person_path),
                garment_img=handle_file(saree_path),
                seed=0,
                randomize_seed=True,
                api_name="/tryof"
            )
        elif "CatVTON" in space_id:
            res = c.predict(
                person_img=handle_file(person_path),
                garment_img=handle_file(saree_path),
                api_name="/submit"
            )
        elif "OOTDiffusion" in space_id:
            res = c.predict(
                vton_img=handle_file(person_path),
                garm_img=handle_file(saree_path),
                category="upper_body",
                n_samples=1,
                n_steps=20,
                image_scale=2.0,
                seed=-1,
                api_name="/process_hd"
            )
        else:
            # IDM-VTON
            res = c.predict(
                dict={
                    "background": handle_file(person_path),
                    "layers": [],
                    "composite": None
                },
                garm_img=handle_file(saree_path),
                garment_des="a clothing item",
                is_checked=True,
                is_checked_crop=True,
                denoise_steps=30,
                seed=42,
                api_name="/tryon"
            )

        print(f"\n>>> SUCCESS from {space_id}! <<<")
        print(f"Result: {res}")
        break

    except Exception as e:
        print(f"\n>>> FAILED from {space_id} <<<")
        print(f"Exception Type: {type(e).__name__}")
        print(f"Exception Message: {e}")
        if hasattr(e, "result"):
            print(f"Exception Result: {getattr(e, 'result')}")
