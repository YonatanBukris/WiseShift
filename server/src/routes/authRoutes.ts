import { Router } from "express";
import { register, login } from "../controllers/authController";
import { managerDashboard, employeeDashboard } from "../controllers/dashboardController";
import { protect, requireRole } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/manager/dashboard", protect, requireRole(["manager"]), managerDashboard);
router.get("/employee/dashboard", protect, requireRole(["employee"]), employeeDashboard);

export default router; 