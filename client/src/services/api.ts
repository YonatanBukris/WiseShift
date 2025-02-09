import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from "../types/api";
import {
  IUser,
  ManagerDashboardData,
  EmployeeDashboardData,
  ITask,
} from "../types/models";
import { AssessmentFormData } from "../components/forms/AssessmentForm";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("API URL not configured");
}

console.log("API URL:", API_URL); // לבדיקה

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request logging with full URL
api.interceptors.request.use((config) => {
  console.log(`Making request to: ${config.baseURL}${config.url}`);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  department: string;
  phoneNumber?: string;
}

interface AuthResponse extends ApiResponse<IUser> {
  token: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),
  login: async (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<AuthResponse>> => {
    return api.post("/auth/login", credentials);
  },
};

export const dashboardAPI = {
  getManagerDashboard: async (): Promise<ApiResponse<ManagerDashboardData>> => {
    const response = await api.get("/dashboard/manager");
    return response.data;
  },

  getEmployeeDashboard: async (): Promise<
    ApiResponse<EmployeeDashboardData>
  > => {
    const response = await api.get("/dashboard/employee");
    return response.data;
  },
};

export const assessmentAPI = {
  submitForm: async (
    formData: AssessmentFormData
  ): Promise<ApiResponse<void>> => {
    const response = await api.post("/assessment/submit", formData);
    return response.data;
  },
};

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  department: string;
  assignedTo?: string;
  deadline?: Date;
  estimatedHours?: number;
}

interface TaskFilters {
  department?: string;
  status?: string;
  assignedTo?: string;
}

export const taskAPI = {
  createTask: async (taskData: CreateTaskData): Promise<ApiResponse<ITask>> => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  getTasks: async (filters?: TaskFilters): Promise<ApiResponse<ITask[]>> => {
    const response = await api.get("/tasks", { params: filters });
    return response.data;
  },

  updateTask: async (
    id: string,
    updates: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  assignTask: async (taskId: string, employeeId: string) => {
    const response = await api.post(`/tasks/${taskId}/assign`, { employeeId });
    return response.data;
  },

  getAvailableEmployees: async () => {
    const response = await api.get("/tasks/available-employees");
    return response.data;
  },
};

export const emergencyAPI = {
  activateEmergency: async (
    description: string,
    areas: string[]
  ): Promise<ApiResponse<void>> => {
    const response = await api.post("/emergency/activate", {
      description,
      areas,
    });
    return response.data;
  },

  getEmergencyTasks: async (): Promise<ApiResponse<EmergencyTask[]>> => {
    const response = await api.get("/emergency/tasks");
    return response.data;
    console.log();
  },

  assignTask: async (taskId: string, employeeId: string) => {
    const response = await api.post(`/emergency/tasks/${taskId}/assign`, {
      employeeId,
    });
    return response.data;
  },

  getAvailableEmployees: async () => {
    const response = await api.get("/emergency/available-employees");
    return response.data;
  },

  updateTaskStatus: async (
    taskId: string,
    status: string
  ): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/emergency/tasks/${taskId}/status`, {
      status,
    });
    return response.data;
  },

  deactivateEmergency: async () => {
    const response = await api.post("/emergency/deactivate");
    return response.data;
  },
};

interface EmergencyTask {
  _id: string;
  title: string;
  description: string;
  criticality: "critical" | "high" | "medium" | "low";
  status: "pending" | "assigned" | "inProgress" | "completed";
  assignedTo?: string;
  location: string;
}

export default api;
