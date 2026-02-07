import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  googleId: String,
  likedImages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }]
});

export default mongoose.model("User", userSchema);
