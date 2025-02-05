import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { managerDashboard, employeeDashboard } from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/manager/dashboard", protect, requireRole(["manager"]), managerDashboard);

router.get("/employee/dashboard", protect, requireRole(["employee"]), employeeDashboard);

export default router; 