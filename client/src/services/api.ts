import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from "../types/api";
import {
  IUser,
  ManagerDashboardData,
  EmployeeDashboardData,
  ITask,
  INote,
} from "../types/models";
import { AssessmentFormData } from "../components/forms/AssessmentForm";

const API_URL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL}/api` // רק ב-production נוסיף /api
  : import.meta.env.VITE_API_URL; // ב-development נשאיר כמו שזה

if (!API_URL) {
  throw new Error("API URL not configured");
}

// Add more debug logs
console.log("Environment:", import.meta.env.MODE); // יציג אם אנחנו ב-development או production
console.log("Full env:", import.meta.env); // יציג את כל משתני הסביבה
console.log("API URL:", API_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_URL, // This should be https://wiseshift.onrender.com/api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request logging with full URL
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log(`Making request to: ${fullUrl}`);
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
  submitForm: async (formData: AssessmentFormData) => {
    const response = await api.post("/assessment/submit", formData);
    return response.data;
  },
  triggerAssessmentForms: async () => {
    const response = await api.post("/assessment/trigger");
    return response.data;
  },
  checkPendingForm: async () => {
    const response = await api.get("/assessment/check-pending");
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

// Add at the top with other constants
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get full file URL
export const getFileUrl = (path: string, originalName: string) => {
  if (!path) return "";
  const filename = path.replace(/^uploads[/\\]/, "");
  return `${BASE_URL}/files/${filename}?name=${encodeURIComponent(
    originalName
  )}`;
};

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

  getAllEmployees: async () => {
    const response = await api.get("/tasks/available-employees");
    return response.data;
  },

  addNote: async (taskId: string, note: { text?: string; file?: File }) => {
    const formData = createFormData(note);
    const response = await api.post<ApiResponse<ITask>>(
      `/tasks/${taskId}/notes`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteNote: (taskId: string, noteId: string) =>
    api.delete<ApiResponse<ITask>>(`/tasks/${taskId}/notes/${noteId}`),
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

  getAllEmployees: async () => {
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

  updateTask: (taskId: string, updates: Partial<EmergencyTask>) =>
    api.put<EmergencyTask>(`/emergency/${taskId}`, updates),

  addNote: async (taskId: string, note: { text?: string; file?: File }) => {
    const formData = createFormData(note);
    const response = await api.post<ApiResponse<EmergencyTask>>(
      `/emergency/${taskId}/notes`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteNote: (taskId: string, noteId: string) =>
    api.delete<ApiResponse<EmergencyTask>>(
      `/emergency/${taskId}/notes/${noteId}`
    ),
};

interface EmergencyTask {
  _id: string;
  title: string;
  description: string;
  criticality: "critical" | "high" | "medium" | "low";
  status:
    | "pending"
    | "assigned"
    | "inProgress"
    | "completed"
    | "transferred"
    | "cancelled";
  assignedTo?: string;
  location: string;
  isEmergencyTask: boolean;
  notes: INote[];
}

const createFormData = (note: { text?: string; file?: File }) => {
  const formData = new FormData();
  if (note.text) formData.append("text", note.text);
  if (note.file) formData.append("file", note.file);
  return formData;
};

export default api;
