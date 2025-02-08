import { Router } from "express";
import {
  managerDashboard,
  getEmployeeDashboard,
} from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/manager", protect, requireRole(["manager"]), managerDashboard);
router.get(
  "/employee",
  protect,
  requireRole(["employee"]),
  getEmployeeDashboard
);

export default router;
