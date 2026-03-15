import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance with default config and URL
 */
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to all requests
 */
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle response errors and token refresh
 */
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Auth Service Functions
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await authApi.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    organization_id: string;
  }) => {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await authApi.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    const response = await authApi.post('/auth/refresh');
    return response.data;
  },

  /**
   * Logout (clear token on backend if needed)
   */
  logout: async () => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await authApi.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Get stored token
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Get stored user
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authApi;
