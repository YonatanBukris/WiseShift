import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
// ... other route imports

const router = Router();

// Log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
// ... other route mounting

export default router;
