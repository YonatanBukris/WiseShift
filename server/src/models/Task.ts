import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/models.js";

interface Note {
  text?: string;
  file?: {
    filename: string;
    path: string;
    mimetype: string;
  };
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "inProgress",
        "completed",
        "transferred",
        "cancelled",
      ],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: true },
    deadline: { type: Date },
    estimatedHours: { type: Number },
    actualHours: { type: Number },
    dependencies: [
      {
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        type: { type: String, enum: ["blocks", "blocked_by"] },
      },
    ],
    comments: [
      {
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    history: [
      {
        field: { type: String, required: true },
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    notes: [
      {
        text: String,
        file: {
          filename: String,
          path: String,
          mimetype: String,
        },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>("Task", TaskSchema);
