'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, isAuthenticated, getCurrentUser } from './api';

// Define user type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bloodType: string;
  isAvailable: boolean;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoggedIn: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isLoggedIn: false
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Provide more specific error message
        if (error instanceof Error && error.message.includes('Server connection failed')) {
          setError('Backend server connection failed. Please try again later or contact support.');
        } else {
          setError('Failed to load user information. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      
      // Fetch user data after successful login
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (err.message.includes('Server connection failed')) {
          setError('Backend server connection failed. Please ensure the server is running.');
        } else if (err.message.includes('Unauthorized')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Login failed. Please try again later.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  // Register function
  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(userData);
    } catch (err) {
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('Server connection failed')) {
          setError('Backend server connection failed. Please ensure the server is running.');
        } else if (err.message.includes('already exists')) {
          setError('An account with this email already exists. Please use a different email.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Registration failed. Please try again later.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isLoggedIn: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 