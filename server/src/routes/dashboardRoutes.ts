import { Router } from "express";
import { managerDashboard, employeeDashboard } from "../controllers/dashboardController";
import { protect, requireRole } from "../middleware/auth";

const router = Router();

router.get("/manager", protect, requireRole(["manager"]), managerDashboard);
router.get("/employee", protect, requireRole(["employee"]), employeeDashboard);

export default router; 