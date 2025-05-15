import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ user: null, loading: false, error: null });
        return;
      }

      const response = await apiClient.get('/auth/me');
      setAuthState({
        user: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Authentication failed',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthState({ user, loading: false, error: null });
      return user;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Login failed',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ user: null, loading: false, error: null });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
  };
} 