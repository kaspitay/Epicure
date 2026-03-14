import { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as LoginResponse;
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ users: User[] }>(`${BASE_URL}/user`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, users }}>
      {children}
    </AuthContext.Provider>
  );
};
