import mongoose, { Schema, Model } from 'mongoose';
import { IRecipe, IIngredient, IStep, ITag, IPhoto } from '../types';

const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  measurement: {
    type: String,
    required: true,
  },
});

const stepsSchema = new Schema<IStep>({
  description: {
    type: String,
    required: true,
  },
  stepImage: {
    type: String,
  },
});

const tagsSchema = new Schema<ITag>({
  tag: {
    type: String,
    required: true,
  },
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
});

const photosSchema = new Schema<IPhoto>({
  image: String,
});

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    steps: [stepsSchema],
    tags: [tagsSchema],
    photos: [photosSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Recipe: Model<IRecipe> = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
