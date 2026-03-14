import { useAuthContext } from './useAuthContext';

interface UseLogoutReturn {
  logout: () => void;
}

export const useLogout = (): UseLogoutReturn => {
  const { dispatch } = useAuthContext();

  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return {
    logout,
  };
};
