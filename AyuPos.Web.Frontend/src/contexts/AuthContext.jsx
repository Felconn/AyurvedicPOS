import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // checking for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

const login = async (userId, password) => {
  try {
    const response = await authAPI.login({ userId, password });

    const { token, user } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    setUser(user);

    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    return { success: false, error: message };
  }
};

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};