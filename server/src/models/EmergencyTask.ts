import mongoose, { Schema } from "mongoose";

const EmergencyTaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  criticality: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'inProgress', 'completed'],
    default: 'pending'
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  requiredSkills: [String],
  estimatedTime: Number, // in minutes
  location: String,
  isActive: { type: Boolean, default: false }, // becomes true during emergency
});

export const EmergencyTask = mongoose.model('EmergencyTask', EmergencyTaskSchema);
export default EmergencyTask; 