// Ingredient type
export interface Ingredient {
  name: string;
  quantity: number;
  measurement: string;
}

// Step type
export interface Step {
  description: string;
  stepImage?: string;
}

// Tag type
export interface Tag {
  tag: string;
  _id?: string;
  category?: string;
}

// Photo type
export interface Photo {
  image: string;
}

// Rating type
export interface Rating {
  userId: string;
  rating: number;
  createdAt: string;
}

// Recipe interface
export interface Recipe {
  _id: string;
  title: string;
  image: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: Tag[];
  photos: Photo[];
  ratings?: Rating[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  totalRatings?: number;
}

// Book/Cookbook type
export interface Book {
  _id: string;
  name: string;
  recipes: string[];
}

// Chef reference type
export interface ChefRef {
  ccName: string;
  ccId: string;
}

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  userType: number; // 0 = user, 1 = chef
  recipes: string[];
  favorites: string[];
  books: Book[];
  chefs: ChefRef[];
  likes: number;
  watches: number;
  bio: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

// Auth state
export interface AuthState {
  user: {
    email: string;
    user: User;
    token: string;
  } | null;
}

// Tag document from API
export interface TagDocument {
  _id: string;
  name: string;
  category: string;
  description?: string;
  usageCount: number;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface LoginResponse {
  email: string;
  user: User;
  token: string;
}

export interface RecipesResponse {
  recipes: Recipe[];
}

export interface UsersResponse {
  users: User[];
}

// Context types
export interface AuthContextType {
  user: LoginResponse | null;
  dispatch: React.Dispatch<AuthAction>;
  users: User[];
  isAuthLoading: boolean;
}

export interface RecipeContextType {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

// Action types
export type AuthAction =
  | { type: 'LOGIN'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: LoginResponse };
