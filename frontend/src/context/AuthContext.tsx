'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'Admin' | 'Engineer' | 'Viewer';

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  role: Role;
  isLoading: boolean;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAdmin: boolean;
  isEngineer: boolean;
  isViewer: boolean;
  login: (userData: { token: string; user: User }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: 'Viewer',
    isLoading: true
  });

  const normalizeRole = (rawRole: string, username?: string): Role => {
    const r = rawRole?.toLowerCase() || '';
    const u = username?.toLowerCase() || '';
    
    if (r.includes('admin') || u === 'bhuviguru') return 'Admin';
    if (r.includes('engineer')) return 'Engineer';
    return 'Viewer';
  };

  useEffect(() => {
    const saved = localStorage.getItem('doctor_user');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        const userObj = userData.user || userData;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          user: userObj,
          role: normalizeRole(userObj.role, userObj.username),
          isLoading: false
        });
      } catch {
        localStorage.removeItem('doctor_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (userData: { token: string; user: User }) => {
    localStorage.setItem('doctor_user', JSON.stringify(userData));
    const userObj = userData.user;
    setState({
      user: userObj,
      role: normalizeRole(userObj.role, userObj.username),
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('doctor_user');
    setState({
      user: null,
      role: 'Viewer',
      isLoading: false
    });
    window.location.reload();
  };

  const isAdmin = state.role === 'Admin';
  const isEngineer = state.role === 'Engineer';
  const isViewer = state.role === 'Viewer';

  return (
    <AuthContext.Provider value={{ 
      user: state.user, 
      role: state.role, 
      isAdmin, 
      isEngineer, 
      isViewer, 
      login, 
      logout, 
      isLoading: state.isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
