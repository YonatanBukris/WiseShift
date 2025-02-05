import { Router } from "express";
import { submitAssessmentForm } from "../controllers/assessmentController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/submit", protect, requireRole(["employee"]), submitAssessmentForm);

export default router; 