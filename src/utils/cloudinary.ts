export const uploadToCloudinary = async (file: File): Promise<string> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

  // First try uploading via backend API endpoint (Express + Cloudinary service)
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data?.success && data?.data?.url) {
      return data.data.url;
    }
  } catch (backendError) {
    console.warn("Backend upload failed, attempting direct Cloudinary fallback...", backendError);
  }

  // Fallback to direct client-side Cloudinary upload
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error(data.error?.message || "Failed to upload image file");
  }
};
