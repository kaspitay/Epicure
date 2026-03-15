import { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { userApi } from '../api';
import { AuthContextType, AuthAction, LoginResponse, User } from '../types';

interface AuthState {
  user: LoginResponse | null;
}

const initialState: AuthState = {
  user: null,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
      };
    case 'UPDATE_USER':
      return {
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as LoginResponse;
      dispatch({ type: 'LOGIN', payload: user });
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userApi.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, users, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
