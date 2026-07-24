import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a buffer (from multer memoryStorage) to Cloudinary.
 * resource_type: "auto" lets Cloudinary handle images AND raw files
 * (PDFs, docs) under the same function.
 */
export const uploadBufferToCloudinary = (buffer, { folder, filename }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteFromCloudinary = (publicId, resourceType = "auto") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
