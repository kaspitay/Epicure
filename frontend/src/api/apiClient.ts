import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import BASE_URL from '../config';

export class ApiError extends Error {
  status: number;
  originalError?: AxiosError;

  constructor(message: string, status: number, originalError?: AxiosError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.originalError = originalError;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const message = error.response?.data?.message
      || error.message
      || 'An unexpected error occurred';

    const status = error.response?.status || 500;

    return Promise.reject(new ApiError(message, status, error));
  }
);

export default apiClient;
