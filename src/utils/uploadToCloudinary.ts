export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult | null> => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary config missing");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url || !data.public_id) {
      console.error("Cloudinary response missing expected fields:", data);
      return null;
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};