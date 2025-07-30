// Application constants
export const APP_NAME = 'BrandName';
export const COMPANY_NAME = 'Felcomm Software Solutions';

// API Configuration
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  INVENTORY: '/inventory',
  SETTINGS: '/settings',
};

// Table configuration
export const TABLE_ROWS_PER_PAGE = [5, 10, 25, 50];
export const DEFAULT_ROWS_PER_PAGE = 10;

// User status options
export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  INVENTORY_MANAGER: 'Inventory Manager',
  COMPOUNDER: 'Compounder',
  CASHIER: 'Cashier',
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_RESET: 'Password reset link sent to your email',
};

// Theme colors
export const COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#f59e0b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
};

// Chart colors
export const CHART_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
};

// File upload settings
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME_MODE: 'themeMode',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  TABLE_PREFERENCES: 'tablePreferences',
};

export default {
  APP_NAME,
  COMPANY_NAME,
  API_ENDPOINTS,
  TABLE_ROWS_PER_PAGE,
  DEFAULT_ROWS_PER_PAGE,
  USER_STATUS,
  USER_ROLES,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLORS,
  CHART_COLORS,
  DATE_FORMATS,
  UPLOAD_SETTINGS,
  PAGINATION,
  STORAGE_KEYS,
};