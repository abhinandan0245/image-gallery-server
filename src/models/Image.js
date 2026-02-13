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

imageSchema.index({ createdAt: -1 }); // used for newest / oldest sorting
imageSchema.index({ likes: -1 });     // used for popular sorting

export default mongoose.model("Image", imageSchema);
