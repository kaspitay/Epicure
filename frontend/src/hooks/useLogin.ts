import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../api';
import { AxiosError } from 'axios';

interface UseLoginReturn {
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
}

export const useLogin = (): UseLoginReturn => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.login(email, password);
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({ type: 'LOGIN', payload: data });
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'An error occurred. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    login,
  };
};
