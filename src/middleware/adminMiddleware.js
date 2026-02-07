import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 IMPORTANT LINE (THIS WAS MISSING)
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Admin not authorized" });
      }

      // 🔥 Attach admin to request
      req.admin = admin;

      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      return res.status(401).json({ message: "Invalid admin token" });
    }
  } else {
    return res.status(401).json({ message: "No admin token provided" });
  }
};

export default adminProtect;
