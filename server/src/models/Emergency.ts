import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Emergency", EmergencySchema);
