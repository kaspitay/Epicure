const mongoose = require('mongoose');
const Tag = require('../models/TagModel');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Check if MONGO_URI is defined
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not defined!');
  console.error('Please ensure your .env file in the backend directory contains MONGO_URI=your_mongodb_connection_string');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  dbName: "Epicure"
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

// Initial tag data by category
const tagData = [
  // Dietary restrictions
  { name: 'vegetarian', category: 'dietary', description: 'Contains no meat or fish' },
  { name: 'vegan', category: 'dietary', description: 'Contains no animal products' },
  { name: 'gluten-free', category: 'dietary', description: 'Contains no gluten' },
  { name: 'dairy-free', category: 'dietary', description: 'Contains no dairy products' },
  { name: 'nut-free', category: 'dietary', description: 'Contains no nuts' },
  { name: 'soy-free', category: 'dietary', description: 'Contains no soy products' },
  { name: 'egg-free', category: 'dietary', description: 'Contains no eggs' },
  { name: 'sugar-free', category: 'dietary', description: 'Contains no added sugar' },
  
  // Meal types
  { name: 'breakfast', category: 'mealType', description: 'Morning meal' },
  { name: 'lunch', category: 'mealType', description: 'Midday meal' },
  { name: 'dinner', category: 'mealType', description: 'Evening meal' },
  { name: 'dessert', category: 'mealType', description: 'Sweet dish usually served after main course' },
  { name: 'appetizer', category: 'mealType', description: 'Small dish served before a meal' },
  { name: 'snack', category: 'mealType', description: 'Light meal between regular meals' },
  { name: 'side dish', category: 'mealType', description: 'Smaller dish that accompanies a main dish' },
  { name: 'main course', category: 'mealType', description: 'Primary dish in a meal' },
  
  // Cuisines
  { name: 'italian', category: 'cuisine', description: 'Italian cuisine' },
  { name: 'mexican', category: 'cuisine', description: 'Mexican cuisine' },
  { name: 'indian', category: 'cuisine', description: 'Indian cuisine' },
  { name: 'chinese', category: 'cuisine', description: 'Chinese cuisine' },
  { name: 'japanese', category: 'cuisine', description: 'Japanese cuisine' },
  { name: 'thai', category: 'cuisine', description: 'Thai cuisine' },
  { name: 'french', category: 'cuisine', description: 'French cuisine' },
  { name: 'mediterranean', category: 'cuisine', description: 'Mediterranean cuisine' },
  { name: 'middle eastern', category: 'cuisine', description: 'Middle Eastern cuisine' },
  { name: 'american', category: 'cuisine', description: 'American cuisine' },
  { name: 'greek', category: 'cuisine', description: 'Greek cuisine' },
  { name: 'spanish', category: 'cuisine', description: 'Spanish cuisine' },
  { name: 'korean', category: 'cuisine', description: 'Korean cuisine' },
  { name: 'vietnamese', category: 'cuisine', description: 'Vietnamese cuisine' },
  
  // Cooking time
  { name: 'under 15 minutes', category: 'cookingTime', description: 'Preparation time under 15 minutes' },
  { name: 'under 30 minutes', category: 'cookingTime', description: 'Preparation time under 30 minutes' },
  { name: 'under 1 hour', category: 'cookingTime', description: 'Preparation time under 1 hour' },
  { name: 'over 1 hour', category: 'cookingTime', description: 'Preparation time over 1 hour' },
  { name: 'quick & easy', category: 'cookingTime', description: 'Fast and simple to prepare' },
  { name: 'slow-cooked', category: 'cookingTime', description: 'Cooked for a long time on low heat' },
  
  // Difficulty
  { name: 'beginner', category: 'difficulty', description: 'Easy enough for novice cooks' },
  { name: 'intermediate', category: 'difficulty', description: 'Requires some cooking experience' },
  { name: 'advanced', category: 'difficulty', description: 'For experienced cooks' },
  { name: 'professional', category: 'difficulty', description: 'Chef-level complexity' },
  
  // Seasonal
  { name: 'spring', category: 'season', description: 'Spring recipes' },
  { name: 'summer', category: 'season', description: 'Summer recipes' },
  { name: 'fall', category: 'season', description: 'Fall recipes' },
  { name: 'winter', category: 'season', description: 'Winter recipes' },
  { name: 'holiday', category: 'season', description: 'Holiday recipes' },
  
  // Special occasions
  { name: 'christmas', category: 'special', description: 'Christmas recipes' },
  { name: 'thanksgiving', category: 'special', description: 'Thanksgiving recipes' },
  { name: 'easter', category: 'special', description: 'Easter recipes' },
  { name: 'halloween', category: 'special', description: 'Halloween recipes' },
  { name: 'valentine\'s day', category: 'special', description: 'Valentine\'s Day recipes' },
  { name: 'birthday', category: 'special', description: 'Birthday celebration recipes' },
  { name: 'anniversary', category: 'special', description: 'Anniversary celebration recipes' },
  { name: 'bbq', category: 'special', description: 'Barbecue recipes' },
  { name: 'picnic', category: 'special', description: 'Picnic-friendly recipes' },
  { name: 'potluck', category: 'special', description: 'Potluck-appropriate dishes' },
  
  // Main ingredients
  { name: 'chicken', category: 'ingredient', description: 'Chicken-based recipes' },
  { name: 'beef', category: 'ingredient', description: 'Beef-based recipes' },
  { name: 'pork', category: 'ingredient', description: 'Pork-based recipes' },
  { name: 'fish', category: 'ingredient', description: 'Fish-based recipes' },
  { name: 'seafood', category: 'ingredient', description: 'Seafood-based recipes' },
  { name: 'tofu', category: 'ingredient', description: 'Tofu-based recipes' },
  { name: 'vegetables', category: 'ingredient', description: 'Vegetable-based recipes' },
  { name: 'pasta', category: 'ingredient', description: 'Pasta-based recipes' },
  { name: 'rice', category: 'ingredient', description: 'Rice-based recipes' },
  { name: 'potato', category: 'ingredient', description: 'Potato-based recipes' },
  
  // Cooking methods
  { name: 'baked', category: 'cookingMethod', description: 'Cooked by dry heat in an oven' },
  { name: 'grilled', category: 'cookingMethod', description: 'Cooked over direct heat' },
  { name: 'fried', category: 'cookingMethod', description: 'Cooked in hot oil' },
  { name: 'steamed', category: 'cookingMethod', description: 'Cooked with steam' },
  { name: 'boiled', category: 'cookingMethod', description: 'Cooked in boiling liquid' },
  { name: 'roasted', category: 'cookingMethod', description: 'Cooked by dry heat in an oven' },
  { name: 'sautéed', category: 'cookingMethod', description: 'Cooked quickly in a small amount of oil' },
  { name: 'stir-fried', category: 'cookingMethod', description: 'Cooked quickly over high heat while stirring' },
  { name: 'slow-cooked', category: 'cookingMethod', description: 'Cooked for a long time on low heat' },
  { name: 'pressure-cooked', category: 'cookingMethod', description: 'Cooked under pressure' },
  
  // Diet types
  { name: 'low-carb', category: 'diet', description: 'Low in carbohydrates' },
  { name: 'keto', category: 'diet', description: 'High-fat, low-carb' },
  { name: 'paleo', category: 'diet', description: 'Based on foods presumed to be available to paleolithic humans' },
  { name: 'whole30', category: 'diet', description: 'Whole food based elimination diet' },
  { name: 'mediterranean diet', category: 'diet', description: 'Based on foods common to Mediterranean countries' },
  { name: 'high-protein', category: 'diet', description: 'High in protein content' },
  
  // Allergen information
  { name: 'contains peanuts', category: 'allergy', description: 'Recipe contains peanuts' },
  { name: 'contains tree nuts', category: 'allergy', description: 'Recipe contains tree nuts' },
  { name: 'contains dairy', category: 'allergy', description: 'Recipe contains dairy' },
  { name: 'contains eggs', category: 'allergy', description: 'Recipe contains eggs' },
  { name: 'contains soy', category: 'allergy', description: 'Recipe contains soy' },
  { name: 'contains wheat', category: 'allergy', description: 'Recipe contains wheat' },
  { name: 'contains shellfish', category: 'allergy', description: 'Recipe contains shellfish' },
  
  // Nutrition
  { name: 'low-calorie', category: 'nutrition', description: 'Low in calories' },
  { name: 'low-fat', category: 'nutrition', description: 'Low in fat' },
  { name: 'low-sodium', category: 'nutrition', description: 'Low in sodium' },
  { name: 'high-fiber', category: 'nutrition', description: 'High in dietary fiber' },
  { name: 'protein-rich', category: 'nutrition', description: 'Rich in protein' },
  
  // Temperature
  { name: 'hot', category: 'temperature', description: 'Served hot' },
  { name: 'cold', category: 'temperature', description: 'Served cold' },
  { name: 'frozen', category: 'temperature', description: 'Served frozen' },
  { name: 'room temperature', category: 'temperature', description: 'Served at room temperature' },
  
  // Texture
  { name: 'crispy', category: 'texture', description: 'Has a crisp texture' },
  { name: 'crunchy', category: 'texture', description: 'Has a crunchy texture' },
  { name: 'creamy', category: 'texture', description: 'Has a creamy texture' },
  { name: 'smooth', category: 'texture', description: 'Has a smooth texture' },
  { name: 'soft', category: 'texture', description: 'Has a soft texture' },
  { name: 'chewy', category: 'texture', description: 'Has a chewy texture' },
  
  // Flavor
  { name: 'spicy', category: 'flavor', description: 'Has a spicy taste' },
  { name: 'sweet', category: 'flavor', description: 'Has a sweet taste' },
  { name: 'savory', category: 'flavor', description: 'Has a savory taste' },
  { name: 'sour', category: 'flavor', description: 'Has a sour taste' },
  { name: 'bitter', category: 'flavor', description: 'Has a bitter taste' },
  { name: 'umami', category: 'flavor', description: 'Has an umami taste' },
];

// Function to seed tags
const seedTags = async () => {
  try {
    // Clear existing tags
    await Tag.deleteMany({});
    console.log('Cleared existing tags');
    
    // Insert new tags
    await Tag.insertMany(tagData);
    console.log(`${tagData.length} tags have been added to the database`);
    
    // Mark some tags as popular for initial display
    const popularTags = ['vegetarian', 'vegan', 'italian', 'mexican', 'quick & easy', 
      'dinner', 'dessert', 'chicken', 'baked', 'grilled', 'spicy', 'sweet'];
    
    await Tag.updateMany(
      { name: { $in: popularTags } }, 
      { $set: { isPopular: true, usageCount: 100 } }
    );
    console.log(`${popularTags.length} tags have been marked as popular`);
    
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding tags:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedTags(); 