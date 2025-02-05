import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/models";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager", "employee"],
      required: true,
      default: "employee",
    },
    department: { type: String, required: true },
    phoneNumber: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
    status: {
      stressLevel: { type: Number, min: 1, max: 10 },
      physicallyInjured: { type: Boolean, default: false },
      spouseAvailable: { type: Boolean, default: false },
      availableHours: { type: Number, default: 0 },
      canWorkAsUsual: { type: Boolean, default: true },
      currentLocation: String,
      lastUpdated: { type: Date, default: Date.now },
    },
    preferences: {
      language: { type: String, default: "he" },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema); 