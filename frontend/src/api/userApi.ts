import apiClient from './apiClient';
import { LoginResponse, User, Recipe } from '../types';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  userType: number;
  bio?: string;
  profilePicture?: string;
}

export interface CookbookCreateData {
  name: string;
  user: User;
}

export interface SaveRecipeData {
  recipe: Recipe;
  cookbook?: string;
  user: User;
}

export interface ChefFollowData {
  userId: string;
  ccName: string;
  ccId: string;
}

export const userApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/user/login', {
      email,
      password,
    });
    return response.data;
  },

  signup: async (data: SignupData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/user/signup', data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<{ users: User[] }>('/user');
    return response.data.users;
  },

  saveRecipe: async (data: SaveRecipeData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/user/save_recipe', data);
    return response.data;
  },

  deleteRecipe: async (recipe: Recipe, cookbook: string, user: User): Promise<LoginResponse> => {
    const response = await apiClient.delete<LoginResponse>('/user/delete_recipe', {
      data: { recipe, cookbook, user },
    });
    return response.data;
  },

  createCookbook: async (data: CookbookCreateData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/user/cookbook', data);
    return response.data;
  },

  deleteCookbook: async (name: string, user: User): Promise<LoginResponse> => {
    const response = await apiClient.delete<LoginResponse>('/user/cookbook', {
      data: { name, user },
    });
    return response.data;
  },

  followChef: async (data: ChefFollowData): Promise<User> => {
    const response = await apiClient.post<{ user: User }>('/user/chef', data);
    return response.data.user;
  },

  unfollowChef: async (userId: string, ccId: string): Promise<User> => {
    const response = await apiClient.delete<{ user: User }>('/user/chef', {
      data: { userId, ccId },
    });
    return response.data.user;
  },

  addToChefsList: async (userId: string, creatorId: string, user: User): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      `/user/add_chefs_list/${userId}`,
      { creatorId, user }
    );
    return response.data;
  },

  removeFromChefsList: async (userId: string, creatorId: string, user: User): Promise<LoginResponse> => {
    const response = await apiClient.delete<LoginResponse>(
      `/user/remove_chefs_list/${userId}`,
      { data: { creatorId, user } }
    );
    return response.data;
  },
};

export default userApi;
