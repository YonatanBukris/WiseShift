import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '../types/api';
import { IUser, ManagerDashboardData, EmployeeDashboardData, ITask } from '../types/models';
import { AssessmentFormData } from '../components/forms/AssessmentForm';

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
  register: (data: RegisterData) => 
    axios.post(`${API_URL}/api/auth/register`, data),
  login: (data: LoginCredentials) => 
    axios.post(`${API_URL}/api/auth/login`, data),
};

export const dashboardAPI = {
  getManagerDashboard: async (): Promise<ApiResponse<ManagerDashboardData>> => {
    const response = await api.get('/dashboard/manager');
    return response.data;
  },

  getEmployeeDashboard: async (): Promise<ApiResponse<EmployeeDashboardData>> => {
    const response = await api.get('/dashboard/employee');
    return response.data;
  }
};

export const assessmentAPI = {
  submitForm: async (formData: AssessmentFormData): Promise<ApiResponse<void>> => {
    const response = await api.post('/assessment/submit', formData);
    return response.data;
  },
};

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
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
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  getTasks: async (filters?: TaskFilters): Promise<ApiResponse<ITask[]>> => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },

  updateTask: async (id: string, updates: Partial<ITask>): Promise<ApiResponse<ITask>> => {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api; 