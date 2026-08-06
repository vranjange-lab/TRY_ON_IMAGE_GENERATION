import os
from gradio_client import Client, handle_file

token = os.getenv("HF_TOKEN")
print("Connecting to Kwai-Kolors/Kolors-Virtual-Try-On...")
c = Client("Kwai-Kolors/Kolors-Virtual-Try-On", token=token)

print("\nViewing API:")
c.view_api()

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

print("\nSubmitting test prediction...")
res = c.predict(
    person_img=handle_file(person_path),
    garment_img=handle_file(saree_path),
    seed=0,
    randomize_seed=True,
    api_name="/tryof"
)

print(f"\nResult from Kolors: {res}")
