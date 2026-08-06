import os
import time
from gradio_client import Client, handle_file

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

print("Connecting to 'yisol/IDM-VTON'...")
client = Client("yisol/IDM-VTON")

print("Submitting job...")
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

print("Job submitted. Polling job status...")
start_time = time.time()
while not job.done():
    print(f"[{int(time.time() - start_time)}s] Status: {job.status()}")
    time.sleep(5)

print(f"Final status: {job.status()}")
if job.outputs():
    result = job.result()
    print(f"--> SUCCESS RESULT: {result}")
