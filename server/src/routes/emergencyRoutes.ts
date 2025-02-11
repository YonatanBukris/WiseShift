import { Router } from "express";
import {
  activateEmergency,
  getEmergencyTasks,
  assignEmergencyTask,
  getAllEmployees,
  deactivateEmergency,
  addEmergencyNote,
  deleteNote,
  updateEmergencyTask,
} from "../controllers/emergencyController.js";
import { protect, requireRole } from "../middleware/auth.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/activate", protect, requireRole(["manager"]), activateEmergency);
router.get("/tasks", protect, getEmergencyTasks);
router.post(
  "/tasks/:taskId/assign",
  protect,
  requireRole(["manager"]),
  assignEmergencyTask
);
router.get(
  "/available-employees",
  protect,
  requireRole(["manager"]),
  getAllEmployees
);
router.post(
  "/deactivate",
  protect,
  requireRole(["manager"]),
  deactivateEmergency
);
router.post("/:taskId/notes", protect, upload.single("file"), addEmergencyNote);
router.delete("/:taskId/notes/:noteId", protect, deleteNote);
router.put("/:taskId", protect, updateEmergencyTask);

export default router;
