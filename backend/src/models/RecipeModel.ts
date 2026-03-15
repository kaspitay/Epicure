import mongoose, { Schema, Model } from 'mongoose';
import { IRecipe, IIngredient, IStep, ITag, IPhoto, IRating } from '../types';

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

const ratingSchema = new Schema<IRating>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
    ratings: [ratingSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for average rating
recipeSchema.virtual('averageRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Virtual for total ratings count
recipeSchema.virtual('totalRatings').get(function () {
  return this.ratings ? this.ratings.length : 0;
});

const Recipe: Model<IRecipe> = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
