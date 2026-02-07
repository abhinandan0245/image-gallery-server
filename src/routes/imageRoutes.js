import express from "express";
import {
  uploadImage,
  getImages,
  deleteImage,
  editImage,
  likeUnlikeImage,
  getLikedImages
} from "../controllers/imageController.js";

import adminProtect from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 *  PUBLIC ROUTE
 * Website + Admin dono ke liye
 */
router.get("/", getImages);

/**
 * ❤️ USER ROUTES
 */
router.put("/:id/like", protect, likeUnlikeImage);
router.get("/liked/me", protect, getLikedImages);

/**
 * ADMIN ROUTES
 */
router.post("/", adminProtect, upload.single("image"), uploadImage);
router.put("/:id", adminProtect, editImage);
router.delete("/:id", adminProtect, deleteImage);

export default router;
