import mongoose, { Schema } from "mongoose";

const EmergencyStateSchema = new Schema({
  isActive: { type: Boolean, default: false },
  activatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  activatedAt: { type: Date },
  description: String,
  affectedAreas: [String],
});

export const EmergencyState = mongoose.model('EmergencyState', EmergencyStateSchema);
export default EmergencyState; 