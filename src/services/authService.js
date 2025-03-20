import axios from 'axios';

const API_URL = process.env.VUE_APP_BACKEND_URL || 'http://127.0.0.1:8000';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Login user and store token
  async login(email, password) {
    try {
      const response = await apiClient.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        const userData = {
          name: response.data.name || '',
          email: response.data.email || ''
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return response.data;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Logout user and remove token
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Use this method for all API requests
  getApiClient() {
    return apiClient;
  }
};