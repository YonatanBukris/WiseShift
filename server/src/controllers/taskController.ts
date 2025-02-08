import { Request, Response } from "express";
import Task from "../models/Task.js";
import { ApiResponse } from "../types/api.js";
import { ITask } from "../types/models.js";
import User from "../models/User.js";

// Create new task
export const createTask = async (
  req: Request,
  res: Response<ApiResponse<ITask>>
) => {
  try {
    const {
      title,
      description,
      priority,
      department,
      assignedTo,
      deadline,
      estimatedHours,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      department,
      assignedTo,
      deadline,
      estimatedHours,
      createdBy: req.user!._id,
    });

    res.json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get tasks (with filters)
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { assignedTo } = req.query;
    const user = req.user!;

    let query = {};
    
    // If employee, only return their assigned tasks
    if (user.role === 'employee') {
      query = { assignedTo: user._id };
    }
    // If manager with filter, apply the filter
    else if (user.role === 'manager' && assignedTo) {
      query = { assignedTo };
    }

    // First get the tasks
    const tasks = await Task.find(query)
      .populate({
        path: 'assignedTo',
        select: 'name email department',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .exec();

    // Transform the data to ensure consistent format for both roles
   

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response<ApiResponse<ITask>>
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get the original task
    const originalTask = await Task.findById(id);
    if (!originalTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Create history records for changed fields
    const history = Object.keys(updates).map((field) => ({
      field,
      oldValue: originalTask[field as keyof ITask],
      newValue: updates[field],
      updatedBy: req.user!._id,
    }));

    // Add history to updates
    updates.history = [...(originalTask.history || []), ...history];

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found after update",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response<ApiResponse<void>>
) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAvailableEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({
      role: "employee",
      "status.canWorkAsUsual": true,
    }).select("_id name");

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

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
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

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task assigned successfully",
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