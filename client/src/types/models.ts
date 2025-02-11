export interface IUser {
  _id: string;
  name: string;
  email: string;
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
  employeeStats: {
    totalEmployees: number;
    availableEmployees: number;
    unavailableEmployees: number;
    department: string;
  };
  taskStats: {
    active: number;
    completed: number;
    pending: number;
    total: number;
    department: string;
  };
  formStats: {
    submittedToday: number;
    totalSubmitted: number;
    pendingReview: number;
    total: number;
  };
  emergencyStatus: "Active" | "Inactive";
}

export interface EmployeeDashboardData {
  personalStats: {
    department: string;
    canWorkAsUsual: boolean;
    availableHours: number;
    currentTasks: number;
    completedTasks: number;
    emergencyTasks: number;
    formSubmittedToday: boolean;
  };
  tasks: ITask[];
  emergencyTasks: ITask[];
  recentActivity?: Array<{
    timestamp: Date;
    type: "status" | "task";
    message: string;
  }>;
}

export interface INote {
  _id: string;
  text?: string;
  file?: {
    filename: string;
    path: string;
    mimetype: string;
  };
  createdBy: string;
  createdAt: Date;
}

export type TaskStatus =
  | "pending"
  | "assigned"
  | "inProgress"
  | "completed"
  | "transferred"
  | "cancelled";

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  assignedTo?:
    | {
        _id: string;
        name: string;
      }
    | string;
  createdBy: string;
  department: string;
  deadline?: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: Array<{
    task: string;
    type: "blocks" | "blocked_by";
  }>;
  comments: Array<{
    text: string;
    author: string;
    createdAt: Date;
  }>;
  history: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    updatedBy: string;
    updatedAt: Date;
  }>;
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
  isEmergencyTask?: boolean;
  criticality?: string;
  location?: string;
}

export interface EmergencyTask {
  _id: string;
  title: string;
  description: string;
  criticality: "low" | "medium" | "high" | "critical";
  department: string;
  status: "pending" | "inProgress" | "completed" | "assigned";
  assignedTo?: string;
  location: string;
  isEmergencyTask: boolean;
}

export interface IEmergencyTask {
  _id: string;
  title: string;
  description: string;
  criticality: "low" | "medium" | "high" | "critical";
  department: string;
  status: TaskStatus;
  assignedTo?: string;
  requiredSkills: string[];
  estimatedTime: number;
  location: string;
  notes?: INote[];
  isActive: boolean;
  isEmergencyTask: boolean;
}
