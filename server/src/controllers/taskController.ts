import { Request, Response } from "express";
import Task from "../models/Task";
import { ApiResponse } from "../types/api";
import { ITask } from "../types/models";

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
export const getTasks = async (
  req: Request,
  res: Response<ApiResponse<ITask[]>>
) => {
  try {
    const { department, status, assignedTo } = req.query;
    const filter: any = {};

    if (department) filter.department = department;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error instanceof Error ? error.message : "Unknown error",
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