import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bad_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load current user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data && res.data.success) {
      const { token: receivedToken, user: loggedUser } = res.data;
      localStorage.setItem('bad_token', receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      return loggedUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    if (res.data && res.data.success) {
      const { token: receivedToken, user: registeredUser } = res.data;
      localStorage.setItem('bad_token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return registeredUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('bad_token');
    setToken(null);
    setUser(null);
  };

  // Quick 1-click login helper for seamless testing
  const quickLogin = async (role) => {
    let email = 'patient@bookadoctor.com';
    let pass = 'patient123';

    if (role === 'doctor') {
      email = 'dr.sophia@bookadoctor.com';
      pass = 'doctor123';
    } else if (role === 'admin') {
      email = 'admin@bookadoctor.com';
      pass = 'admin123';
    }

    return await login(email, pass);
  };

  const updateUserProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.data && res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      return res.data.user;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        quickLogin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
