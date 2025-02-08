import { Router } from "express";
import {
  activateEmergency,
  getEmergencyTasks,
  assignEmergencyTask,
  getAvailableEmployees,
  deactivateEmergency,
} from "../controllers/emergencyController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/activate", protect, requireRole(["manager"]), activateEmergency);
router.get("/tasks", protect, getEmergencyTasks);
router.post("/tasks/:taskId/assign", protect, requireRole(["manager"]), assignEmergencyTask);
router.get("/available-employees", protect, requireRole(["manager"]), getAvailableEmployees);
router.post("/deactivate", protect, requireRole(["manager"]), deactivateEmergency);

export default router; 