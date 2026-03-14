import apiClient from './apiClient';
import { TagDocument } from '../types';

export const tagApi = {
  getAll: async (): Promise<TagDocument[]> => {
    const response = await apiClient.get<TagDocument[]>('/tags');
    return response.data;
  },

  incrementUsage: async (tagName: string): Promise<void> => {
    await apiClient.post('/tags/increment', { tagName });
  },
};

export default tagApi;
