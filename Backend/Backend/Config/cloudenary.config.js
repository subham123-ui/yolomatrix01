import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//! Upload file to Cloudinary
export const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "yolo-matrix",
        resource_type: "auto",
      },
      (error, result) => {
        //! Remove file from local storage
        fs.unlinkSync(filePath);

        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );
  });
};

//! Delete file from Cloudinary using public ID
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};
