import { Document, Types } from 'mongoose';

// Ingredient type
export interface IIngredient {
  name: string;
  quantity: number;
  measurement: string;
}

// Step type
export interface IStep {
  description: string;
  stepImage?: string;
}

// Tag type
export interface ITag {
  tag: string;
  _id?: Types.ObjectId;
  category?: string;
}

// Photo type
export interface IPhoto {
  image: string;
}

// Rating type
export interface IRating {
  userId: Types.ObjectId;
  rating: number;
  createdAt: Date;
}

// Recipe interface
export interface IRecipe extends Document {
  title: string;
  image: string;
  description: string;
  ingredients: IIngredient[];
  steps: IStep[];
  tags: ITag[];
  photos: IPhoto[];
  ratings: IRating[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  totalRatings?: number;
}

// Book/Cookbook type
export interface IBook {
  name: string;
  recipes: Types.ObjectId[];
}

// Chef reference type
export interface IChef {
  ccName: string;
  ccId: Types.ObjectId;
}

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: number; // 0 = user, 1 = chef
  recipes: Types.ObjectId[];
  favorites: Types.ObjectId[];
  books: IBook[];
  chefs: IChef[];
  likes: number;
  watches: number;
  bio: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

// User model with static methods
export interface IUserModel {
  signup(
    name: string,
    email: string,
    password: string,
    userType: number,
    bio?: string,
    profilePicture?: string
  ): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
}

// Tag document interface
export interface ITagDocument extends Document {
  name: string;
  category: string;
  description?: string;
  usageCount: number;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request body types
export interface CreateRecipeBody {
  title: string;
  image?: string;
  description: string;
  ingredients: IIngredient[];
  steps: IStep[];
  tags: ITag[];
  photos?: { image: string }[];
  user: IUser;
  userId: string;
}

export interface SaveRecipeBody {
  recipe: { _id: string };
  cookbook: string;
  user: { _id: string };
}

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  userType: number;
  bio?: string;
  profilePicture?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
