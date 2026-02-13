import Image from "../models/Image.js";
import User from "../models/User.js";


// 🔹 Upload Image (Admin)
// 🔹 Upload Single or Multiple Images
export const uploadImage = async (req, res) => {
  try {
    const { title } = req.body;

    // Handle multiple files
    if (req.files && req.files.length > 0) {
      const imagesData = req.files.map((file) => ({
        title, // You can customize title per file if needed
        imageUrl: file.path,
        uploadedBy: req.admin.email,
      }));

      const images = await Image.insertMany(imagesData);

      return res.status(201).json({
        message: "Images uploaded successfully",
        images,
      });
    }

    // Handle single file
    if (req.file) {
      const image = await Image.create({
        title,
        imageUrl: req.file.path,
        uploadedBy: req.admin.email,
      });

      return res.status(201).json({
        message: "Image uploaded successfully",
        image,
      });
    }

    // No files sent
    return res.status(400).json({ message: "No image file provided" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Images (Admin)
// 🔹 Get All Images (Public + Sorting)
export const getImages = async (req, res) => {
  try {
    const { sort = "newest", page = 1, limit = 12 } = req.query;

    let sortQuery = {};

    if (sort === "newest") sortQuery = { createdAt: -1 };
    else if (sort === "oldest") sortQuery = { createdAt: 1 };
    else if (sort === "popular") sortQuery = { likes: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch paginated images
    const images = await Image.find()
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const total = await Image.countDocuments();

    res.json({
      images,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);  
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Images by Same User (Excluding current image)
// 

export const getImageBySameAdmin = async (req, res) => {
  try {
    const imageId = req.params.id;
    
    console.log("Getting images by same admin for image ID:", imageId);
    
    // 1. Find the current image
    const currentImage = await Image.findById(imageId);
    if (!currentImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    console.log("Current image uploaded by:", currentImage.uploadedBy);
    
    // 2. Find other images by the same admin (excluding current image)
    const images = await Image.find({
      uploadedBy: currentImage.uploadedBy,
      _id: { $ne: imageId }
    })
    .sort({ createdAt: -1 }) // Latest first
    .limit(6); // Limit to 6 images
    
    console.log(`Found ${images.length} images by same admin`);
    
    res.json(images);
  } catch (error) {
    console.error("Error in getImageBySameAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Image
export const deleteImage = async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Edit Image
export const editImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






/**
 * ❤️ USER: Like / Unlike Image
 */
export const likeUnlikeImage = async (req, res) => {
  try {
    const userId = req.user;
    const imageId = req.params.id;

    const image = await Image.findById(imageId);
    const user = await User.findById(userId);

    if (!image || !user) {
      return res.status(404).json({ message: "Image or user not found" });
    }

    const alreadyLiked = image.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      image.likes.pull(userId);
      user.likedImages.pull(imageId);
    } else {
      // Like
      image.likes.push(userId);
      user.likedImages.push(imageId);
    }

    await image.save();
    await user.save();

    res.json({
      message: alreadyLiked ? "Image unliked" : "Image liked",
      likesCount: image.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❤️ USER: Get liked images
 */
export const getLikedImages = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("likedImages");
    res.json(user.likedImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
