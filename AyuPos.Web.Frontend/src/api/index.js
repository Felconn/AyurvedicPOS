import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5054/api',
  // baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/Auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const userAPI = {
  getUsers: (params) => api.get('/User', { params }),
  updateUserStatus: (id, toggleData) => api.put(`/User/${id}/status`, toggleData),
  updateUser: (id, userData) => api.put(`/User/profile/${id}`, userData),

  // getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/User/invite', userData),
  // updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  // deleteUser: (id) => api.delete(`/users/${id}`),
  // toggleUserStatus: (id) => api.patch(`/users/${id}/toggle-status`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/activities'),
  getChartData: (type) => api.get(`/dashboard/charts/${type}`),
};

export const reportsAPI = {
  getReports: (params) => api.get('/reports', { params }),
  generateReport: (type, filters) => api.post('/reports/generate', { type, filters }),
  downloadReport: (id) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
};

export default api;