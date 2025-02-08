import { Request, Response } from "express";
import EmergencyTask from "../models/EmergencyTask.js";
import EmergencyState from "../models/EmergencyState.js";
import User from "../models/User.js";

export const activateEmergency = async (req: Request, res: Response) => {
  try {
    const { description, areas } = req.body;

    // Create or update emergency state
    await EmergencyState.findOneAndUpdate(
      {},
      {
        isActive: true,
        activatedBy: req.user?._id,
        activatedAt: new Date(),
        description,
        affectedAreas: areas,
      },
      { upsert: true }
    );

    // Activate all emergency tasks
    await EmergencyTask.updateMany({}, { isActive: true });

    res.json({
      success: true,
      message: "Emergency mode activated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to activate emergency mode",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEmergencyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await EmergencyTask.find({ isActive: true })
      .populate('assignedTo', 'name')
      .exec();

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emergency tasks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const assignEmergencyTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { employeeId } = req.body;

    const task = await EmergencyTask.findByIdAndUpdate(
      taskId,
      {
        assignedTo: employeeId,
        status: "assigned",
      },
      { new: true }
    )
    .populate({
      path: 'assignedTo',
      select: 'name email department',
      model: 'User'
    })
    .exec();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAvailableEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({
      role: "employee",
      "status.canWorkAsUsual": true,
    }).select("name status");

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available employees",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deactivateEmergency = async (req: Request, res: Response) => {
  try {
    // Reset emergency state
    await EmergencyState.findOneAndUpdate(
      {},
      {
        isActive: false,
        activatedBy: req.user?._id,
        activatedAt: new Date(),
      }
    );

    // Deactivate all emergency tasks
    await EmergencyTask.updateMany({}, { 
      isActive: false,
      status: 'pending',
      assignedTo: null 
    });

    res.json({
      success: true,
      message: "Emergency mode deactivated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate emergency mode",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 