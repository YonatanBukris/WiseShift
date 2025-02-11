import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["https://wiseshift-ui.onrender.com", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Then mount API routes
app.use(routes);

// Serve static files from the React app FIRST
const buildPath = path.resolve(__dirname, "../../client/build");
console.log("Serving static files from:", buildPath);
app.use(express.static(buildPath));

// Handle React routing BEFORE API routes
app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// Test endpoint
app.get("/test", (_, res) => {
  res.json({ message: "Server is running" });
});

// Error handling last
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`,
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
