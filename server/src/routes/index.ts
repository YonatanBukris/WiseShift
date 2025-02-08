import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
// ... other route imports

const router = Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
// ... other route mounting

export default router;
