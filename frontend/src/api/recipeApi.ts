import apiClient from './apiClient';
import { Recipe, Ingredient, Step, Tag, Photo, User } from '../types';

export interface CreateRecipeData {
  title: string;
  image: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: Tag[];
  photos: Photo[];
  userId: string;
  user: User;
}

export interface UpdateRecipeData {
  title?: string;
  image?: string;
  description?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  tags?: Tag[];
  photos?: Photo[];
}

export const recipeApi = {
  getAll: async (): Promise<Recipe[]> => {
    const response = await apiClient.get<{ recipes: Recipe[] }>('/recipe');
    return response.data.recipes;
  },

  getById: async (id: string): Promise<Recipe> => {
    const response = await apiClient.get<{ recipe: Recipe }>(`/recipe/${id}`);
    return response.data.recipe;
  },

  create: async (data: CreateRecipeData): Promise<Recipe> => {
    const response = await apiClient.post<{ recipe: Recipe }>('/api/recipe', data);
    return response.data.recipe;
  },

  update: async (id: string, data: UpdateRecipeData): Promise<Recipe> => {
    const response = await apiClient.post<{ recipe: Recipe }>('/recipe', {
      ...data,
      recipeId: id,
    });
    return response.data.recipe;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipe/${id}`);
  },
};

export default recipeApi;
