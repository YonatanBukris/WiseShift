import { IUser } from './models';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  success: boolean;
  data?: IUser;
  message?: string;
  error?: string;
  token?: string;
} 