import { Router } from "express";
import { managerDashboard, employeeDashboard } from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/manager", protect, requireRole(["manager"]), managerDashboard);
router.get("/employee", protect, requireRole(["employee"]), employeeDashboard);

export default router; 