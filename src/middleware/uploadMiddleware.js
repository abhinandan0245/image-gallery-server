import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "image-gallery",

    // 👇 AUTO OPTIMIZATION
    transformation: [
      {
        width: 1200,
        height: 1200,
        crop: "limit", // resize only if bigger
        quality: "auto", // 🔥 auto compression
        fetch_format: "auto", // 🔥 webp/avif automatically
      },
    ],

    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  storage,
});

export default upload;
