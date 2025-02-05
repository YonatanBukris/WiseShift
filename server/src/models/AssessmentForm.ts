import mongoose, { Schema } from "mongoose";
import { IAssessmentForm } from "../types/models";

const AssessmentFormSchema = new Schema<IAssessmentForm>({
  employee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stressLevel: { type: Number, required: true, min: 1, max: 10 },
  physicallyInjured: { type: Boolean, required: true },
  injuryDetails: { type: String },
  spouseAvailable: { type: Boolean, required: true },
  availableHours: { type: Number, required: true, min: 0, max: 24 },
  canWorkAsUsual: { type: Boolean, required: true },
  constraints: { type: String },
  status: {
    type: String,
    enum: ["draft", "submitted", "reviewed"],
    default: "submitted",
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAssessmentForm>("AssessmentForm", AssessmentFormSchema); 