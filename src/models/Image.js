import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: String,
    imageUrl: String,
    uploadedBy: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
