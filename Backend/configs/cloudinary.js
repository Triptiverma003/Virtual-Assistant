import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOncloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    console.log("Uploading file to Cloudinary:", filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "assistants", // optional: keep uploads organized
    });

    console.log("Cloudinary upload result:", uploadResult);

    // Remove temp file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url; // ✅ Return the URL only
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Clean up temp file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    

    // Return null or throw depending on your handling strategy
    return null;
  }
};

export default uploadOncloudinary;
