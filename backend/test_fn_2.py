import os
from gradio_client import Client, handle_file

token = os.getenv("HF_TOKEN")
print("Connecting to Kwai-Kolors/Kolors-Virtual-Try-On...")
c = Client("Kwai-Kolors/Kolors-Virtual-Try-On", token=token)

person_path = os.path.abspath("uploads/user_images/00034_00.jpg")
saree_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")

print("Predicting via fn_index=2...")
res = c.predict(
    handle_file(person_path),
    handle_file(saree_path),
    0,
    True,
    fn_index=2
)

print(f"\nSUCCESS from Kolors (fn_index=2): {res}")
