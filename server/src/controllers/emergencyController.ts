import { Request, Response } from "express";
import EmergencyTask from "../models/EmergencyTask.js";
import EmergencyState from "../models/EmergencyState.js";
import { ApiResponse } from "../types/api.js";
import { EmergencyTask as IEmergencyTask, Note } from "../types/models.js";
import { Types } from "mongoose";

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
      .populate("assignedTo", "name")
      .exec();

    console.log(
      "Tasks being sent:",
      tasks.map((t) => ({
        title: t.title,
        department: t.department,
      }))
    );

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
        path: "assignedTo",
        select: "name email department",
        model: "User",
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

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({
      role: "employee",
    }).select("_id name email department phoneNumber status");

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
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
    await EmergencyTask.updateMany(
      {},
      {
        isActive: false,
        status: "pending",
        assignedTo: null,
      }
    );

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

export const addEmergencyNote = async (
  req: Request,
  res: Response<ApiResponse<IEmergencyTask>>
) => {
  try {
    const { taskId } = req.params;

    const { text } = req.body;
    const file = req.file;

    const note: any = {
      createdBy: req.user._id,
      createdAt: new Date(),
    };

    if (text) note.text = text;
    if (file) {
      note.file = {
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      };
    }

    const task = await EmergencyTask.findByIdAndUpdate(
      taskId,
      { $push: { notes: note } },
      { new: true }
    ).populate("notes.createdBy", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      data: task,
      message: "Note added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding note to emergency task",
    });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { taskId, noteId } = req.params;
    const userId = req.user?._id;

    const task = await EmergencyTask.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const noteIndex = task.notes.findIndex(
      (note: any) => note._id?.toString() === noteId
    );

    if (noteIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    const note = task.notes[noteIndex];
    if (note.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    task.notes.splice(noteIndex, 1);
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateEmergencyTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await EmergencyTask.findByIdAndUpdate(taskId, updates, {
      new: true,
    }).populate("assignedTo", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
