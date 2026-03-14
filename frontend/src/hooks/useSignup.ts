import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import BASE_URL from '../config';
import { LoginResponse } from '../types';

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
      const response = await fetch(`${BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType,
          bio,
          profilePicture,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: 'LOGIN', payload: data as LoginResponse });
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        setError(data.message || 'An error occurred. Please try again.');
        return false;
      }
    } catch {
      setLoading(false);
      setError('An error occurred. Please try again.');
      return false;
    }
  };

  return {
    error,
    loading,
    signup,
  };
};
