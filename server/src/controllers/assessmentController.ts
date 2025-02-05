import { Request, Response } from "express";
import AssessmentForm from "../models/AssessmentForm";
import User from "../models/User";
import { ApiResponse } from "../types/api";

export const submitAssessmentForm = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const {
      stressLevel,
      physicallyInjured,
      injuryDetails,
      spouseAvailable,
      availableHours,
      canWorkAsUsual,
      constraints,
    } = req.body;

    // Create new assessment form
    const form = await AssessmentForm.create({
      employee: req.user!._id,
      submittedBy: req.user!._id,
      stressLevel,
      physicallyInjured,
      injuryDetails,
      spouseAvailable,
      availableHours,
      canWorkAsUsual,
      constraints,
    });

    // Update user's status
    await User.findByIdAndUpdate(req.user!._id, {
      status: {
        stressLevel,
        physicallyInjured,
        spouseAvailable,
        availableHours,
        canWorkAsUsual,
        lastUpdated: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Assessment form submitted successfully",
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting assessment form",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 