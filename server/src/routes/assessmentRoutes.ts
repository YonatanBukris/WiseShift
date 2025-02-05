import { Router } from "express";
import { submitAssessmentForm } from "../controllers/assessmentController";
import { protect, requireRole } from "../middleware/auth";

const router = Router();

router.post("/submit", protect, requireRole(["employee"]), submitAssessmentForm);

export default router; 