export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
} 