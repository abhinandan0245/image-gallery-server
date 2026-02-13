// import express from "express";
// import { adminLogin } from "../controllers/adminController.js";

// const router = express.Router();

// router.post("/login", adminLogin);

// export default router;


import express from "express";
import { 
  adminLogin, 
  adminRegister,
  getAdminProfile,
  updateAdminProfile,

} from "../controllers/adminController.js";
import adminProtect from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/profile", adminProtect, getAdminProfile);

// 🔥 Update profile with image upload
router.put(
  "/profile",
  adminProtect,
  upload.single("profileImage"),
  updateAdminProfile
);



export default router;