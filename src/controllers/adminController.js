import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// 🔹 Admin Register
export const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Admin registered successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token using your utility
    const token = generateToken(admin._id);

    // Exclude password from the response
    const { password: _, ...adminData } = admin._doc;

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      admin: adminData, // frontend will now receive admin info
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// getAdminProfile 
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    } 
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }     
};

// 🔹 Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { email, password } = req.body;

    // 🔹 Update Email
    if (email) {
      const emailExists = await Admin.findOne({ email });

      if (emailExists && emailExists._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }

      admin.email = email;
    }

    // 🔹 Update Password (Re-hash)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    // 🔹 Update Profile Image (if uploaded)
    if (req.file) {
      admin.profileImage = req.file.path; // Cloudinary URL
    }

    const updatedAdmin = await admin.save();

    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        _id: updatedAdmin._id,
        email: updatedAdmin.email,
        profileImage: updatedAdmin.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
