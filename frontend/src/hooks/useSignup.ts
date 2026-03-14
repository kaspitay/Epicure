import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { userApi } from '../api';
import { AxiosError } from 'axios';

interface UseSignupReturn {
  error: string | null;
  loading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    userType: number,
    bio?: string,
    profilePicture?: string
  ) => Promise<boolean>;
}

export const useSignup = (): UseSignupReturn => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signup = async (
    name: string,
    email: string,
    password: string,
    userType: number,
    bio?: string,
    profilePicture?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.signup({
        name,
        email,
        password,
        userType,
        bio,
        profilePicture,
      });
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
    signup,
  };
};
