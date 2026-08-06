import os
import sys
import time
import json
import urllib.request

# Use real person and saree images from workspace
user_img_path = os.path.abspath("uploads/user_images/00034_00.jpg")
if not os.path.exists(user_img_path):
    user_img_path = os.path.abspath("uploads/user_images/istockphoto-1633543792-612x612.jpg")

saree_img_path = os.path.abspath("uploads/saree_images/KPR-Aayna-40100-Black-2.jpg")
if not os.path.exists(saree_img_path):
    # Fallback to any saree image file found in uploads/saree_images
    saree_dir = os.path.abspath("uploads/saree_images")
    for f in os.listdir(saree_dir):
        if f.lower().endswith((".jpg", ".png", ".jpeg")) and os.path.getsize(os.path.join(saree_dir, f)) > 1000:
            saree_img_path = os.path.join(saree_dir, f)
            break

def upload_file(url, filepath):
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    with open(filepath, "rb") as f:
        file_bytes = f.read()
    
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{os.path.basename(filepath)}"\r\n'
        "Content-Type: image/jpeg\r\n\r\n"
    ).encode("utf-8") + file_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")
    
    headers = {"Content-Type": f"multipart/form-data; boundary={boundary}"}
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

print("=== STEP 1: Uploading Real Person Image ===")
print(f"Source file: {user_img_path}")
user_res = upload_file("http://127.0.0.1:8000/api/v1/upload/user-image", user_img_path)
saved_user_path = user_res["path"]
print(f"Uploaded Person Image saved to: {saved_user_path}")

print("\n=== STEP 2: Uploading Real Saree Image ===")
print(f"Source file: {saree_img_path}")
saree_res = upload_file("http://127.0.0.1:8000/api/v1/upload/saree-image", saree_img_path)
saved_saree_path = saree_res["path"]
print(f"Uploaded Saree Image saved to: {saved_saree_path}")

print("\n=== STEP 3: Triggering AI Try-On Generation ===")
gen_payload = json.dumps({
    "user_image_path": saved_user_path,
    "saree_image_path": saved_saree_path
}).encode("utf-8")

gen_req = urllib.request.Request(
    "http://127.0.0.1:8000/api/v1/generate",
    data=gen_payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)
with urllib.request.urlopen(gen_req) as resp:
    status_code = resp.status
    gen_res = json.loads(resp.read().decode("utf-8"))

task_id = gen_res["task_id"]
print(f"Generation Endpoint Response Status: {status_code} Accepted")
print(f"Task ID: {task_id}")

print("\n=== STEP 4: Polling Background Task Status ===")
poll_url = f"http://127.0.0.1:8000/api/v1/result/{task_id}"

attempts = 0
max_attempts = 300  # 15 minutes max
final_res = None

while attempts < max_attempts:
    time.sleep(3)
    req_poll = urllib.request.Request(poll_url, method="GET")
    with urllib.request.urlopen(req_poll) as resp:
        poll_data = json.loads(resp.read().decode("utf-8"))
    
    current_status = poll_data.get("status")
    print(f"[{attempts * 3}s] Task Status: {current_status}")
    
    if current_status == "completed":
        final_res = poll_data
        break
    elif current_status == "failed":
        print(f"\nTask failed: {poll_data.get('error_message')}")
        sys.exit(1)
        
    attempts += 1

if final_res and final_res.get("result_image_path"):
    out_path = final_res["result_image_path"]
    print("\n==========================================")
    print("SUCCESS: PIPELINE COMPLETED SUCCESSFULLY!")
    print(f"Generated Try-On Result Image Path: {out_path}")
    print("==========================================")
else:
    print("\nPipeline timed out or failed to produce output image.")
