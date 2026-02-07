// import express from "express";
// import { adminLogin } from "../controllers/adminController.js";

// const router = express.Router();

// router.post("/login", adminLogin);

// export default router;


import express from "express";
import { 
  adminLogin, 
  adminRegister,

} from "../controllers/adminController.js";

const router = express.Router();

// Public routes
router.post("/register", adminRegister);
router.post("/login", adminLogin);



export default router;