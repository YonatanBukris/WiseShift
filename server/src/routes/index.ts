import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import taskRoutes from "./taskRoutes.js";
import assessmentRoutes from "./assessmentRoutes.js";
import emergencyRoutes from "./emergencyRoutes.js";
// ... other route imports

const router = Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tasks", taskRoutes);
router.use("/assessment", assessmentRoutes);
router.use("/emergency", emergencyRoutes);
// ... other route mounting

export default router;
