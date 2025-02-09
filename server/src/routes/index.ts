import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import { protect } from "../middleware/auth.js";
// ... other route imports

const router = Router();

// Log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes that don't need authentication
router.use("/auth", authRoutes);
router.get("/test", (_, res) => {
  res.json({ message: "Server is running" });
});

// Routes that need authentication
router.use("/dashboard", protect, dashboardRoutes);
// ... other route mounting

export default router;
