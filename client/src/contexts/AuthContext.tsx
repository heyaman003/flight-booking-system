'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    console.log('AuthContext: Login called with user:', userData);
    
    // Store tokens in localStorage for persistence
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    console.log('AuthContext: User state set to:', userData);
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    
    setUser(null);
    router.push('/login');
  };

  const checkAuth = (): boolean => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
        return false;
      }
    }
    
    return false;
  };

  useEffect(() => {
    console.log('AuthContext: Checking authentication on mount...');
    
    // Check authentication status on mount
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    console.log('AuthContext: Found token:', !!accessToken);
    console.log('AuthContext: Found user data:', !!userData);
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Setting user from storage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
      }
    }
    
    setIsLoading(false);
    console.log('AuthContext: Finished checking authentication');
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 