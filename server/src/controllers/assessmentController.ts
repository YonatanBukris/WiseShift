import { Request, Response } from "express";
import AssessmentForm from "../models/AssessmentForm.js";
import User from "../models/User.js";
import { ApiResponse } from "../types/api.js";

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

    // Update the triggered form status
    await AssessmentForm.findOneAndUpdate(
      {
        employee: req.user!._id,
        status: "pending",
        triggered: true,
      },
      {
        status: "submitted",
        triggered: false,
        submittedAt: new Date(),
        ...req.body,
      }
    );

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
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting assessment form",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const triggerAssessmentForms = async (req: Request, res: Response) => {
  try {
    // Get all employees
    const employees = await User.find({ role: "employee" });

    // Create assessment form trigger for each employee
    const triggers = await Promise.all(
      employees.map((employee) =>
        AssessmentForm.create({
          employee: employee._id,
          triggered: true,
          triggeredAt: new Date(),
          status: "pending",
        })
      )
    );

    res.json({
      success: true,
      message: "Assessment forms triggered successfully",
      data: triggers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error triggering assessment forms",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkPendingForm = async (req: Request, res: Response) => {
  try {
    const pendingForm = await AssessmentForm.findOne({
      employee: req.user!._id,
      triggered: true,
      status: "pending",
    });

    res.json({
      success: true,
      data: { hasPendingForm: !!pendingForm },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking pending form",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
