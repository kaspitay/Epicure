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
    const response = await apiClient.post<{ recipe: Recipe }>('/recipe', data);
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

  rateRecipe: async (
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<{ averageRating: number; totalRatings: number }> => {
    const response = await apiClient.post<{
      averageRating: number;
      totalRatings: number;
    }>(`/recipe/${recipeId}/rate`, { userId, rating });
    return response.data;
  },

  getUserRating: async (
    recipeId: string,
    userId: string
  ): Promise<{ userRating: number | null; averageRating: number; totalRatings: number }> => {
    const response = await apiClient.get<{
      userRating: number | null;
      averageRating: number;
      totalRatings: number;
    }>(`/recipe/${recipeId}/rating`, { params: { userId } });
    return response.data;
  },
};

export default recipeApi;
