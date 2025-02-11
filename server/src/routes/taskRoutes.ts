import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllEmployees,
  assignTask,
  addNote,
  deleteNote,
} from "../controllers/taskController.js";
import { protect, requireRole } from "../middleware/auth.js";
import multer from "multer";

const router = Router();

// All routes are protected and require authentication
router.use(protect);

// Routes accessible by managers
router.post("/", requireRole(["manager"]), createTask);
router.delete("/:id", requireRole(["manager"]), deleteTask);

// Routes accessible by both managers and employees
router.get("/", getTasks);
router.patch("/:id", updateTask);
router.get("/available-employees", getAllEmployees);
router.post("/:id/assign", assignTask);

const upload = multer({ dest: "uploads/" });

router.post("/:taskId/notes", upload.single("file"), addNote);
router.delete("/:taskId/notes/:noteId", deleteNote);

export default router;
