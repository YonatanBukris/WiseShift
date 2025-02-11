import { Request, Response } from "express";
import User from "../models/User.js";
import AssessmentForm from "../models/AssessmentForm.js";
import { ApiResponse } from "../types/api.js";
import {
  ManagerDashboardData,
  EmployeeDashboardData,
} from "../types/models.js";
import { IUser } from "../types/models.js";
import { Types } from "mongoose";
import Task from "../models/Task.js";
import EmergencyTask from "../models/EmergencyTask.js";
import Emergency from "../models/Emergency.js";

export const managerDashboard = async (req: Request, res: Response) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const availableEmployees = await User.countDocuments({
      role: "employee",
      "status.canWorkAsUsual": true,
    });

    // Get tasks stats
    const activeTasks = await Task.countDocuments({ status: "active" });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ assignedTo: null }); // unassigned tasks

    const latestForms = await AssessmentForm.aggregate([
      { $match: { status: "submitted" } },
      { $sort: { submittedAt: -1 } },
      {
        $group: {
          _id: "$employee",
          latestForm: { $first: "$$ROOT" },
        },
      },
    ]);

    const emergencyStatus = await Emergency.findOne({}).sort({ createdAt: -1 });

    const dashboardData: ManagerDashboardData = {
      employeeStats: {
        totalEmployees,
        availableEmployees,
        unavailableEmployees: totalEmployees - availableEmployees,
        department: "כל המחלקות",
      },
      taskStats: {
        active: activeTasks,
        completed: completedTasks,
        pending: pendingTasks,
        total: activeTasks + completedTasks + pendingTasks,
        department: "כל המחלקות",
      },
      formStats: {
        submittedToday: latestForms.length,
        totalEmployees,
        criticalCases: [],
      },
      emergencyStatus: emergencyStatus?.status || "Inactive",
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEmployeeDashboard = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    console.log("Employee ID:", user._id);

    // Get tasks assigned to this employee and populate 'assignedTo'
    const assignedTasks = await Task.find({ assignedTo: user._id })
      .populate({
        path: "assignedTo",
        select: "name email department",
        model: "User",
      })
      .exec();
    console.log("Found assigned tasks:", assignedTasks);

    // Get emergency tasks assigned to this employee and populate 'assignedTo'
    const assignedEmergencyTasks = await EmergencyTask.find({
      assignedTo: user._id,
      isActive: true,
    })
      .populate({
        path: "assignedTo",
        select: "name email department",
        model: "User",
      })
      .exec();
    console.log("Found emergency tasks:", assignedEmergencyTasks);

    const dashboardData: EmployeeDashboardData = {
      personalStats: {
        department: user.department,
        canWorkAsUsual: user.status.canWorkAsUsual,
        availableHours: user.status.availableHours,
        currentTasks: assignedTasks.length,
        completedTasks: assignedTasks.filter((t) => t.status === "completed")
          .length,
        emergencyTasks: assignedEmergencyTasks.length,
        formSubmittedToday: false, // You might want to check this from forms collection
      },
      tasks: assignedTasks,
      emergencyTasks: assignedEmergencyTasks,
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching employee dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
