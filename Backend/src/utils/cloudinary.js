import cloudinary from "../configs/cloudinary.js";

export const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "auto"
) => {
  try {
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );

    return result;

  } catch (error) {
    throw new Error(error.message);
  }
};