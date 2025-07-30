// Authentication utilities
export const TOKEN_KEY = 'authToken';
export const USER_KEY = 'userData';

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = () => {
  removeAuthToken();
  removeUserData();
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Role-based permissions
export const ROLES = {
  ADMIN: 'Admin',
  INVENTORY_MANAGER: 'Inventory Manager',
  COMPOUNDER: 'Compounder',
  CASHIER: 'Cashier',
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'reports.view',
    'reports.generate',
    'inventory.view',
    'inventory.edit',
    'settings.view',
    'settings.edit',
  ],
  [ROLES.INVENTORY_MANAGER]: [
    'inventory.view',
    'inventory.edit',
    'reports.view',
    'reports.generate',
  ],
  [ROLES.COMPOUNDER]: [
    'inventory.view',
    'reports.view',
  ],
  [ROLES.CASHIER]: [
    'inventory.view',
  ],
};

export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.includes(permission) || false;
};

export const canAccessRoute = (userRole, routePermissions = []) => {
  if (!routePermissions.length) return true;
  return routePermissions.some(permission => hasPermission(userRole, permission));
};