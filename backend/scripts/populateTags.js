const mongoose = require('mongoose');
const Tag = require('../models/TagModel');
require('dotenv').config();

const initialTags = [
  // Dietary Restrictions
  { name: 'vegetarian', category: 'dietary', description: 'Contains no meat or fish' },
  { name: 'vegan', category: 'dietary', description: 'Contains no animal products' },
  { name: 'gluten-free', category: 'dietary', description: 'Contains no gluten' },
  { name: 'dairy-free', category: 'dietary', description: 'Contains no dairy products' },
  { name: 'keto', category: 'dietary', description: 'Low-carb, high-fat diet' },
  { name: 'paleo', category: 'dietary', description: 'Based on ancient human diet' },
  { name: 'low-carb', category: 'dietary', description: 'Reduced carbohydrate content' },
  { name: 'sugar-free', category: 'dietary', description: 'Contains no added sugar' },

  // Meal Types
  { name: 'breakfast', category: 'mealType', description: 'Morning meal' },
  { name: 'lunch', category: 'mealType', description: 'Midday meal' },
  { name: 'dinner', category: 'mealType', description: 'Evening meal' },
  { name: 'snack', category: 'mealType', description: 'Small meal between main meals' },
  { name: 'dessert', category: 'mealType', description: 'Sweet course after main meal' },
  { name: 'appetizer', category: 'mealType', description: 'Starter course' },
  { name: 'brunch', category: 'mealType', description: 'Combination of breakfast and lunch' },

  // Cuisines
  { name: 'italian', category: 'cuisine', description: 'Italian cuisine' },
  { name: 'mexican', category: 'cuisine', description: 'Mexican cuisine' },
  { name: 'chinese', category: 'cuisine', description: 'Chinese cuisine' },
  { name: 'indian', category: 'cuisine', description: 'Indian cuisine' },
  { name: 'japanese', category: 'cuisine', description: 'Japanese cuisine' },
  { name: 'mediterranean', category: 'cuisine', description: 'Mediterranean cuisine' },
  { name: 'thai', category: 'cuisine', description: 'Thai cuisine' },
  { name: 'french', category: 'cuisine', description: 'French cuisine' },

  // Cooking Times
  { name: 'quick', category: 'cookingTime', description: '15 minutes or less' },
  { name: 'medium', category: 'cookingTime', description: '30 minutes or less' },
  { name: 'long', category: 'cookingTime', description: '1 hour or more' },
  { name: 'overnight', category: 'cookingTime', description: 'Requires overnight preparation' },

  // Difficulty Levels
  { name: 'easy', category: 'difficulty', description: 'Simple to prepare' },
  { name: 'medium', category: 'difficulty', description: 'Moderate skill required' },
  { name: 'advanced', category: 'difficulty', description: 'Advanced cooking skills needed' },
  { name: 'expert', category: 'difficulty', description: 'Professional level skills required' },

  // Seasons
  { name: 'spring', category: 'season', description: 'Spring season recipes' },
  { name: 'summer', category: 'season', description: 'Summer season recipes' },
  { name: 'fall', category: 'season', description: 'Fall season recipes' },
  { name: 'winter', category: 'season', description: 'Winter season recipes' },

  // Special Occasions
  { name: 'holiday', category: 'special', description: 'Holiday recipes' },
  { name: 'party', category: 'special', description: 'Party food' },
  { name: 'comfort-food', category: 'special', description: 'Comfort food recipes' },
  { name: 'healthy', category: 'special', description: 'Healthy recipes' },
  { name: 'romantic', category: 'special', description: 'Romantic dinner recipes' },

  // Main Ingredients
  { name: 'chicken', category: 'ingredient', description: 'Chicken-based recipes' },
  { name: 'beef', category: 'ingredient', description: 'Beef-based recipes' },
  { name: 'fish', category: 'ingredient', description: 'Fish-based recipes' },
  { name: 'vegetables', category: 'ingredient', description: 'Vegetable-based recipes' },
  { name: 'pasta', category: 'ingredient', description: 'Pasta-based recipes' },
  { name: 'rice', category: 'ingredient', description: 'Rice-based recipes' },

  // Cooking Methods
  { name: 'baked', category: 'cookingMethod', description: 'Baked recipes' },
  { name: 'grilled', category: 'cookingMethod', description: 'Grilled recipes' },
  { name: 'fried', category: 'cookingMethod', description: 'Fried recipes' },
  { name: 'steamed', category: 'cookingMethod', description: 'Steamed recipes' },
  { name: 'slow-cooked', category: 'cookingMethod', description: 'Slow-cooked recipes' },

  // Diet Types
  { name: 'mediterranean-diet', category: 'diet', description: 'Mediterranean diet recipes' },
  { name: 'dash-diet', category: 'diet', description: 'DASH diet recipes' },
  { name: 'flexitarian', category: 'diet', description: 'Flexitarian diet recipes' },
  { name: 'pescatarian', category: 'diet', description: 'Pescatarian diet recipes' },

  // Allergen Information
  { name: 'nut-free', category: 'allergy', description: 'Contains no nuts' },
  { name: 'egg-free', category: 'allergy', description: 'Contains no eggs' },
  { name: 'soy-free', category: 'allergy', description: 'Contains no soy' },
  { name: 'shellfish-free', category: 'allergy', description: 'Contains no shellfish' },

  // Nutritional Aspects
  { name: 'high-protein', category: 'nutrition', description: 'High protein content' },
  { name: 'high-fiber', category: 'nutrition', description: 'High fiber content' },
  { name: 'low-fat', category: 'nutrition', description: 'Low fat content' },
  { name: 'low-sodium', category: 'nutrition', description: 'Low sodium content' },

  // Serving Temperature
  { name: 'hot', category: 'temperature', description: 'Served hot' },
  { name: 'cold', category: 'temperature', description: 'Served cold' },
  { name: 'room-temperature', category: 'temperature', description: 'Served at room temperature' },

  // Food Texture
  { name: 'crispy', category: 'texture', description: 'Crispy texture' },
  { name: 'creamy', category: 'texture', description: 'Creamy texture' },
  { name: 'crunchy', category: 'texture', description: 'Crunchy texture' },
  { name: 'soft', category: 'texture', description: 'Soft texture' },

  // Flavor Profiles
  { name: 'spicy', category: 'flavor', description: 'Spicy flavor' },
  { name: 'sweet', category: 'flavor', description: 'Sweet flavor' },
  { name: 'savory', category: 'flavor', description: 'Savory flavor' },
  { name: 'tangy', category: 'flavor', description: 'Tangy flavor' }
];

const populateTags = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tags
    await Tag.deleteMany({});
    console.log('Cleared existing tags');

    // Insert new tags
    const result = await Tag.insertMany(initialTags);
    console.log(`Successfully inserted ${result.length} tags`);

    process.exit(0);
  } catch (error) {
    console.error('Error populating tags:', error);
    process.exit(1);
  }
};

populateTags(); 