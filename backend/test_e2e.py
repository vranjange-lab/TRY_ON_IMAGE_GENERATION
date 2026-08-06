import sys
import os
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_pipeline():
    print("1. Testing Health Endpoint...")
    health_res = client.get("/api/v1/health")
    print(f"Health Response status: {health_res.status_code}, data: {health_res.json()}")
    assert health_res.status_code == 200

    # Path to sample images
    user_img_path = BASE_DIR.parent / "IDM-VTON" / "gradio_demo" / "example" / "human" / "00034_00.jpg"
    saree_img_path = BASE_DIR.parent / "IDM-VTON" / "gradio_demo" / "example" / "cloth" / "04469_00.jpg"

    assert user_img_path.exists(), f"User test image missing at {user_img_path}"
    assert saree_img_path.exists(), f"Saree test image missing at {saree_img_path}"

    print("\n2. Testing Upload User Image endpoint (/api/v1/upload/user-image)...")
    with open(user_img_path, "rb") as f:
        up_user_res = client.post(
            "/api/v1/upload/user-image",
            files={"file": ("test_person.jpg", f, "image/jpeg")}
        )
    print(f"Upload User Image status: {up_user_res.status_code}")
    assert up_user_res.status_code == 201
    user_data = up_user_res.json()
    saved_user_path = user_data["path"]
    print(f"Uploaded User Path: {saved_user_path}")

    print("\n3. Testing Upload Saree Image endpoint (/api/v1/upload/saree-image)...")
    with open(saree_img_path, "rb") as f:
        up_saree_res = client.post(
            "/api/v1/upload/saree-image",
            files={"file": ("test_saree.jpg", f, "image/jpeg")}
        )
    print(f"Upload Saree Image status: {up_saree_res.status_code}")
    assert up_saree_res.status_code == 201
    saree_data = up_saree_res.json()
    saved_saree_path = saree_data["path"]
    print(f"Uploaded Saree Path: {saved_saree_path}")

    print("\n4. Testing Generate endpoint (/api/v1/generate)...")
    gen_res = client.post(
        "/api/v1/generate",
        json={
            "user_image_path": saved_user_path,
            "saree_image_path": saved_saree_path
        }
    )
    print(f"Generate Response status: {gen_res.status_code}")
    gen_data = gen_res.json()
    print(f"Generate Response data: {gen_data}")
    assert gen_res.status_code == 200
    assert gen_data["status"] == "completed"
    assert gen_data["result_image_path"] is not None
    print(f"\nSUCCESS! Result image path: {gen_data['result_image_path']}")

if __name__ == "__main__":
    test_full_pipeline()
