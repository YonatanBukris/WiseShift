import { Request, Response } from "express";
import User from "../models/User.js";
import AssessmentForm from "../models/AssessmentForm.js";
import { ApiResponse } from "../types/api.js";
import { ManagerDashboardData, EmployeeDashboardData } from "../types/models.js";
import { IUser } from "../types/models.js";
import { Types } from "mongoose";


export const managerDashboard = async (
  req: Request,
  res: Response<ApiResponse<ManagerDashboardData>>
) => {
  try {
    // Get all employees (excluding managers)
    const employees = await User.find({ role: "employee" });
    const availableEmployees = employees.filter(emp => emp.status.canWorkAsUsual);

    // Get today's form submissions
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todaysForms = await AssessmentForm.find({
      createdAt: { $gte: startOfDay }
    }).populate<{ employee: { _id: Types.ObjectId; name: string } }>('employee', 'name');

    // Find critical cases (high stress or injured)
    const criticalCases = todaysForms
      .filter(form => form.stressLevel >= 8 || form.physicallyInjured)
      .map(form => ({
        employeeId: form.employee._id.toString(), // Convert ObjectId to string
        name: form.employee.name,
        stressLevel: form.stressLevel,
        physicallyInjured: form.physicallyInjured,
        canWorkAsUsual: form.canWorkAsUsual
      }));

    const dashboardData: ManagerDashboardData = {
      employeeStats: {
        totalEmployees: employees.length,
        availableEmployees: availableEmployees.length,
        unavailableEmployees: employees.length - availableEmployees.length,
        department: "כל המחלקות"
      },
      taskStats: {
        active: 0,
        completed: 0,
        pending: 0,
        department: "כל המחלקות"
      },
      formStats: {
        submittedToday: todaysForms.length,
        totalEmployees: employees.length,
        criticalCases
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching manager dashboard",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const employeeDashboard = async (
  req: Request,
  res: Response<ApiResponse<EmployeeDashboardData>>
) => {
  try {
    const user = req.user!;

    // Check if form was submitted today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayForm = await AssessmentForm.findOne({
      employee: user._id,
      createdAt: { $gte: startOfDay }
    });

    const dashboardData: EmployeeDashboardData = {
      personalStats: {
        department: user.department,
        canWorkAsUsual: user.status.canWorkAsUsual,
        availableHours: user.status.availableHours,
        currentTasks: 0,
        completedTasks: 0,
        formSubmittedToday: !!todayForm
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employee dashboard",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 