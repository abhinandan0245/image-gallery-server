// import express from "express";
// import cors from "cors";
// import adminRoutes from "./routes/adminRoutes.js";
// import imageRoutes from "./routes/imageRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// const app = express();

// //  CORS CONFIG
// app.use(
//   cors({
//     origin: ["http://localhost:5175", "http://localhost:5176" ,"https://image-gallery-client-aksk09i7y-abhinandan-guptas-projects.vercel.app" ,"https://image-gallery-abhi.netlify.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/api/admin", adminRoutes);
// app.use("/api/images", imageRoutes);
// app.use("/api/auth", authRoutes);

// export default app;


import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5175",
  "http://localhost:5176",
  
  "https://image-gallery-client-lime.vercel.app", // NO trailing slash
  "https://image-gallery-abhi.netlify.app", // NO trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// parse JSON
app.use(express.json());

// routes
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);

export default app;
