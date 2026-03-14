import { describe, it, expect } from 'vitest';
import { ApiError } from '../../api/apiClient';

describe('ApiError', () => {
  it('should create an ApiError with message and status', () => {
    const error = new ApiError('Test error', 404);

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });

  it('should store original error when provided', () => {
    const originalError = new Error('Original') as any;
    const error = new ApiError('Test error', 500, originalError);

    expect(error.originalError).toBe(originalError);
  });

  it('should be catchable as a standard Error', () => {
    const error = new ApiError('Network failed', 500);

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(ApiError);
    }
  });
});
