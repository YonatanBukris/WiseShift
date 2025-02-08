import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAvailableEmployees,
  assignTask,
} from "../controllers/taskController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// All routes are protected and require authentication
router.use(protect);

// Routes accessible by managers
router.post("/", requireRole(["manager"]), createTask);
router.delete("/:id", requireRole(["manager"]), deleteTask);

// Routes accessible by both managers and employees
router.get("/", getTasks);
router.patch("/:id", updateTask);
router.get("/available-employees", getAvailableEmployees);
router.post("/:id/assign", assignTask);

export default router; 