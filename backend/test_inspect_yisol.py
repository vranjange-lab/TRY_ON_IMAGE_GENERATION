import os
import sys
import traceback
from gradio_client import Client, handle_file

print("==================================================")
print("INSPECTING GRADIO SPACE: yisol/IDM-VTON")
print("==================================================")

try:
    client = Client("yisol/IDM-VTON")
    print("\n--- API Info ---")
    try:
        client.view_api()
    except Exception as e:
        print(f"view_api error: {e}")

    person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
    saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

    print(f"\nUser Image: {person_path} (exists: {os.path.exists(person_path)})")
    print(f"Saree Image: {saree_path} (exists: {os.path.exists(saree_path)})")

    print("\nSubmitting job via client.submit()...")
    job = client.submit(
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

    print(f"Job status: {job.status()}")
    
    print("\nWaiting for job.result()...")
    try:
        res = job.result()
        print("\n=== 3. Value returned by job.result() ===")
        print(res)
    except Exception as exc:
        print("\n=== 1. FULL BACKEND TERMINAL LOGS & TRACEBACK ===")
        print("\n=== 2. FULL PYTHON TRACEBACK ===")
        traceback.print_exc()

        print("\n=== 3. Value returned by job.result() ===")
        print(f"Exception raised instead of result: {exc}")

        print("\n=== 4. Exact Exception Message ===")
        print(f"Exception type: {type(exc).__name__}")
        print(f"Exception args: {exc.args}")
        print(f"Exception str: {str(exc)}")

        if hasattr(exc, "result"):
            print("\n=== 5. HTTP response / result dict from Gradio Space ===")
            print(f"exc.result: {getattr(exc, 'result')}")

except Exception as outer_exc:
    print(f"Outer exception: {outer_exc}")
    traceback.print_exc()
