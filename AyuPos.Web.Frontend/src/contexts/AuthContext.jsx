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


  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { accessToken, refreshToken } = response.data.tokens;

      if (!accessToken) throw new Error('Access token missing from response');

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode user info from token if needed
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));

      const user = {
        id: decodedPayload.sub,
        name: decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      };

      console.log('accessToken:', accessToken);
      console.log('user:', user);

      // Save user object
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);

      console.log('Login successful:', user);

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