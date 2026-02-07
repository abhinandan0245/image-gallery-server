import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

//  CORS CONFIG
app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:5176"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);

export default app;
