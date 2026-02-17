import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';
import { useGamification } from './useGamification';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { handleDailyLogin } = useGamification();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getItem('auth_token');
      if (token) {
        const userData = await authService.verifyToken(token);
        setUser(userData);
        
        // Check for daily login bonus
        const lastLogin = getItem('last_login_date');
        const today = new Date().toDateString();
        if (lastLogin !== today) {
          handleDailyLogin();
          setItem('last_login_date', today);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: userData, token } = await authService.login(email, password);
      
      setUser(userData);
      setItem('auth_token', token);
      setItem('last_login_date', new Date().toDateString());
      
      // Award daily login points
      handleDailyLogin();
      
      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: newUser, token } = await authService.register(userData);
      
      setUser(newUser);
      setItem('auth_token', token);
      setItem('last_login_date', new Date().toDateString());
      
      return { success: true, user: newUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeItem('auth_token');
      removeItem('last_login_date');
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(email);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const token = getItem('auth_token');
      if (token) {
        const newToken = await authService.refreshToken(token);
        setItem('auth_token', newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    refreshToken,
    isAuthenticated: !!user,
    isPremium: user?.subscription?.type === 'premium'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};