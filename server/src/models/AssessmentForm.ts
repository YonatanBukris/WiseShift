import mongoose, { Schema } from "mongoose";
import { IAssessmentForm } from "../types/models.js";

const AssessmentFormSchema = new Schema<IAssessmentForm>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    stressLevel: { type: Number, required: false },
    physicallyInjured: { type: Boolean, required: false },
    injuryDetails: { type: String },
    spouseAvailable: { type: Boolean, required: false },
    availableHours: { type: Number, required: false },
    canWorkAsUsual: { type: Boolean, required: false },
    constraints: { type: String },
    status: {
      type: String,
      enum: ["pending", "submitted", "reviewed"],
      default: "pending",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewNotes: { type: String },
    triggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAssessmentForm>(
  "AssessmentForm",
  AssessmentFormSchema
);
