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

export const managerDashboard = async (
  req: Request,
  res: Response<ApiResponse<ManagerDashboardData>>
) => {
  try {
    // Get all employees (excluding managers)
    const employees = await User.find({ role: "employee" });
    const availableEmployees = employees.filter(
      (emp) => emp.status.canWorkAsUsual
    );

    // Get today's form submissions
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaysForms = await AssessmentForm.find({
      createdAt: { $gte: startOfDay },
    }).populate<{ employee: { _id: Types.ObjectId; name: string } }>(
      "employee",
      "name"
    );

    // Find critical cases (high stress or injured)
    const criticalCases = todaysForms
      .filter((form) => form.stressLevel >= 8 || form.physicallyInjured)
      .map((form) => ({
        employeeId: form.employee._id.toString(), // Convert ObjectId to string
        name: form.employee.name,
        stressLevel: form.stressLevel,
        physicallyInjured: form.physicallyInjured,
        canWorkAsUsual: form.canWorkAsUsual,
      }));

    const dashboardData: ManagerDashboardData = {
      employeeStats: {
        totalEmployees: employees.length,
        availableEmployees: availableEmployees.length,
        unavailableEmployees: employees.length - availableEmployees.length,
        department: "כל המחלקות",
      },
      taskStats: {
        active: 0,
        completed: 0,
        pending: 0,
        department: "כל המחלקות",
      },
      formStats: {
        submittedToday: todaysForms.length,
        totalEmployees: employees.length,
        criticalCases,
      },
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching manager dashboard",
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
