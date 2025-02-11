import { Document, Types, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "manager" | "employee" | "guest";
  department: string;
  phoneNumber?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  status: {
    stressLevel?: number;
    physicallyInjured: boolean;
    spouseAvailable: boolean;
    availableHours: number;
    canWorkAsUsual: boolean;
    currentLocation?: string;
    lastUpdated: Date;
  };
  preferences: {
    language: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "inProgress" | "completed" | "transferred" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  assignedTo?: IUser["_id"];
  createdBy: IUser["_id"];
  department: string;
  deadline?: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: Array<{
    task: ITask["_id"];
    type: "blocks" | "blocked_by";
  }>;
  comments: Array<{
    text: string;
    author: IUser["_id"];
    createdAt: Date;
  }>;
  history: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    updatedBy: IUser["_id"];
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
}

export interface IAssessmentForm extends Document {
  employee: Types.ObjectId;
  submittedBy: Types.ObjectId;
  stressLevel: number;
  physicallyInjured: boolean;
  injuryDetails?: string;
  spouseAvailable: boolean;
  availableHours: number;
  canWorkAsUsual: boolean;
  constraints?: string;
  triggered: boolean;
  triggeredAt?: Date;
  submittedAt?: Date;
  status: "pending" | "submitted" | "reviewed";
  reviewedBy?: Types.ObjectId;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentStats {
  totalEmployees: number;
  availableEmployees: number;
  unavailableEmployees: number;
  department: string;
}

export interface TaskStats {
  active: number;
  completed: number;
  pending: number;
  total: number;
  department: string;
}

export interface ManagerDashboardData {
  employeeStats: DepartmentStats;
  taskStats: TaskStats;
  formStats: {
    submittedToday: number;
    totalEmployees: number;
    criticalCases: Array<{
      employeeId: string;
      name: string;
      stressLevel: number;
      physicallyInjured: boolean;
      canWorkAsUsual: boolean;
    }>;
  };
  emergencyStatus: "Active" | "Inactive";
  recentUpdates?: Array<{
    timestamp: Date;
    type: "status" | "task";
    message: string;
  }>;
}

export interface EmployeeDashboardData {
  personalStats: {
    department: string;
    canWorkAsUsual: boolean;
    availableHours: number;
    currentTasks: number;
    completedTasks: number;
    emergencyTasks: number;
    formSubmittedToday?: boolean;
  };
  recentActivity?: Array<{
    timestamp: Date;
    type: "status" | "task";
    message: string;
  }>;
  tasks: ITask[];
  emergencyTasks: EmergencyTask[];
}

export interface EmergencyTask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  criticality: "critical" | "high" | "medium" | "low";
  status: "pending" | "assigned" | "inProgress" | "completed";
  assignedTo?: Types.ObjectId;
  location?: string;
  isActive: boolean;
  requiredSkills?: string[];
  estimatedTime?: number;
  notes: Note[];
}

export interface Note {
  _id?: string;
  text?: string;
  file?: {
    filename?: string;
    path?: string;
    mimetype?: string;
  };
  createdBy: string | Types.ObjectId;
  createdAt: Date;
}
