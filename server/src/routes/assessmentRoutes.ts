import express from "express";
import {
  submitAssessmentForm,
  triggerAssessmentForms,
  checkPendingForm,
} from "../controllers/assessmentController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", protect, submitAssessmentForm);
router.post("/trigger", protect, triggerAssessmentForms);
router.get("/check-pending", protect, checkPendingForm);

export default router;
