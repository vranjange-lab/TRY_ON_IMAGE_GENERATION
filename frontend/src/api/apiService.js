export const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Converts File, Blob, Data URL, or URL path into a File object for FormData upload.
 */
export async function imageToFile(imageInput, defaultFilename = "uploaded_image.png") {
  if (imageInput instanceof File) {
    return imageInput;
  }
  
  if (typeof imageInput === "string") {
    if (imageInput.startsWith("data:") || imageInput.startsWith("http") || imageInput.startsWith("/") || imageInput.startsWith("blob:")) {
      const response = await fetch(imageInput);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] || "png";
      const cleanExt = ext.split("+")[0];
      const filename = defaultFilename.replace(/\.[^/.]+$/, "") + "." + cleanExt;
      return new File([blob], filename, { type: blob.type });
    }
  }
  
  if (imageInput && typeof imageInput === "object" && imageInput.image) {
    return imageToFile(imageInput.image, defaultFilename);
  }
  
  throw new Error("Invalid image provided for upload.");
}

/**
 * Upload person image to backend.
 */
export async function uploadUserImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload/user-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "User image upload failed.");
  }

  return await response.json(); // returns { path: "..." }
}

/**
 * Upload saree image to backend.
 */
export async function uploadSareeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload/saree-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Saree image upload failed.");
  }

  return await response.json(); // returns { path: "..." }
}

/**
 * Trigger AI try-on generation pipeline.
 */
export async function generateTryOn(userImagePath, sareeImagePath) {
  const response = await fetch(`${API_BASE_URL}/api/v1/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_image_path: userImagePath,
      saree_image_path: sareeImagePath,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Virtual try-on generation request failed.");
  }

  return await response.json(); // returns { task_id, status, result_image_path }
}

/**
 * Query task result by task ID.
 */
export async function getGenerationResult(taskId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/result/${taskId}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch try-on result status.");
  }

  return await response.json(); // returns { task_id, status, result_image_path }
}

/**
 * Formats relative output image path to full static URL for display in frontend.
 */
export function getOutputImageUrl(resultImagePath) {
  if (!resultImagePath) return null;
  if (resultImagePath.startsWith("http://") || resultImagePath.startsWith("https://")) {
    return resultImagePath;
  }
  const cleanPath = resultImagePath.replace(/^\/+/, "");
  return `${API_BASE_URL}/static/${cleanPath}`;
}
