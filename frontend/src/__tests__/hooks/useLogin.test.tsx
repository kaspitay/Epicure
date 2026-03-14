import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogin } from '../../hooks/useLogin';
import { userApi } from '../../api';
import { AuthContextProvider } from '../../context/AuthContext';
import { ReactNode } from 'react';

// Mock the userApi
vi.mock('../../api', () => ({
  userApi: {
    login: vi.fn(),
    getAllUsers: vi.fn().mockResolvedValue([]),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.login).toBe('function');
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      email: 'test@example.com',
      token: 'test-token',
      user: { _id: '123', name: 'Test User', email: 'test@example.com' },
    };

    vi.mocked(userApi.login).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useLogin(), { wrapper });

    let success: boolean;
    await act(async () => {
      success = await result.current.login('test@example.com', 'password123');
    });

    expect(success!).toBe(true);
    expect(result.current.error).toBeNull();
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should set loading state during login', async () => {
    vi.mocked(userApi.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({} as any), 100))
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.login('test@example.com', 'password123');
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle login failure with ApiError', async () => {
    const { ApiError } = await import('../../api');
    vi.mocked(userApi.login).mockRejectedValueOnce(
      new ApiError('Invalid credentials', 401)
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    let success: boolean;
    await act(async () => {
      success = await result.current.login('test@example.com', 'wrongpassword');
    });

    expect(success!).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle unknown errors', async () => {
    vi.mocked(userApi.login).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useLogin(), { wrapper });

    let success: boolean;
    await act(async () => {
      success = await result.current.login('test@example.com', 'password123');
    });

    expect(success!).toBe(false);
    expect(result.current.error).toBe('An error occurred. Please try again.');
  });

  it('should clear previous error on new login attempt', async () => {
    const { ApiError } = await import('../../api');

    // First login fails
    vi.mocked(userApi.login).mockRejectedValueOnce(
      new ApiError('Invalid credentials', 401)
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'wrongpassword');
    });

    expect(result.current.error).toBe('Invalid credentials');

    // Second login attempt should clear error
    vi.mocked(userApi.login).mockResolvedValueOnce({
      email: 'test@example.com',
      token: 'token',
      user: {} as any,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'correctpassword');
    });

    expect(result.current.error).toBeNull();
  });
});
