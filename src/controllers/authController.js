import admin from "../config/firebase.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    // 🔐 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { name, email, uid } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
      });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({
      message: "Invalid Google token",
    });
  }
};
