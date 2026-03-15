import apiClient from './apiClient';
import { TagDocument } from '../types';

export const tagApi = {
  getAll: async (): Promise<TagDocument[]> => {
    const response = await apiClient.get<TagDocument[]>('/tags');
    return response.data;
  },

  getPopular: async (limit = 10): Promise<TagDocument[]> => {
    const response = await apiClient.get<TagDocument[]>('/tags/popular', {
      params: { limit },
    });
    return response.data;
  },

  getByCategory: async (category: string): Promise<TagDocument[]> => {
    const response = await apiClient.get<{ tags: TagDocument[] }>(`/tags/category/${category}`);
    return response.data.tags;
  },

  incrementUsage: async (tagName: string): Promise<void> => {
    await apiClient.post('/tags/increment', { tagName });
  },
};

export default tagApi;
