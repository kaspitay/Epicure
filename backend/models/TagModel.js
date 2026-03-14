const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'dietary', // Dietary restrictions
        'mealType', // Type of meal
        'cuisine', // Cuisine types
        'cookingTime', // Time to prepare
        'difficulty', // Cooking difficulty
        'season', // Seasonal recipes
        'special', // Special occasions
        'ingredient', // Main ingredients
        'cookingMethod', // Cooking techniques
        'diet', // Diet types
        'allergy', // Allergen information
        'nutrition', // Nutritional aspects
        'temperature', // Serving temperature
        'texture', // Food texture
        'flavor', // Flavor profiles
      ],
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
tagSchema.index({ category: 1, name: 1 });
tagSchema.index({ usageCount: -1 });
tagSchema.index({ isPopular: 1 });

// Virtual for formatted name
tagSchema.virtual('displayName').get(function () {
  return this.name.charAt(0).toUpperCase() + this.name.slice(1);
});

module.exports = mongoose.model('Tag', tagSchema);
