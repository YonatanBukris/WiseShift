import mongoose, { Schema } from "mongoose";

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

const EmergencyTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    criticality: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    department: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "assigned", "inProgress", "completed"],
      default: "pending",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    requiredSkills: [String],
    estimatedTime: { type: Number, required: true },
    location: { type: String, required: false },
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
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const EmergencyTask = mongoose.model(
  "EmergencyTask",
  EmergencyTaskSchema
);
export default EmergencyTask;
