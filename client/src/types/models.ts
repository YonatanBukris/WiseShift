export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee' | 'guest';
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
  recentUpdates?: Array<{
    timestamp: Date;
    type: 'status' | 'task';
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
    formSubmittedToday?: boolean;
  };
  recentActivity?: Array<{
    timestamp: Date;
    type: 'status' | 'task';
    message: string;
  }>;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'inProgress' | 'completed' | 'transferred' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdBy: string;
  department: string;
  deadline?: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: Array<{
    task: string;
    type: 'blocks' | 'blocked_by';
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
  createdAt: Date;
  updatedAt: Date;
} 