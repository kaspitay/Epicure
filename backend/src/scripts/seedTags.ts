import mongoose from 'mongoose';
import Tag from '../models/TagModel';
import dotenv from 'dotenv';

dotenv.config();

const tags = [
  // Dietary
  { name: 'Vegetarian', category: 'dietary', description: 'No meat or fish' },
  { name: 'Vegan', category: 'dietary', description: 'No animal products' },
  { name: 'Gluten-Free', category: 'dietary', description: 'No gluten-containing ingredients' },
  { name: 'Dairy-Free', category: 'dietary', description: 'No dairy products' },
  { name: 'Nut-Free', category: 'dietary', description: 'No nuts' },
  { name: 'Egg-Free', category: 'dietary', description: 'No eggs' },
  { name: 'Kosher', category: 'dietary', description: 'Follows kosher dietary laws' },
  { name: 'Halal', category: 'dietary', description: 'Follows halal dietary laws' },
  { name: 'Pescatarian', category: 'dietary', description: 'Vegetarian plus fish' },

  // Meal Type
  { name: 'Breakfast', category: 'mealType', description: 'Morning meal' },
  { name: 'Brunch', category: 'mealType', description: 'Late morning meal' },
  { name: 'Lunch', category: 'mealType', description: 'Midday meal' },
  { name: 'Dinner', category: 'mealType', description: 'Evening meal' },
  { name: 'Dessert', category: 'mealType', description: 'Sweet course' },
  { name: 'Appetizer', category: 'mealType', description: 'Starter course' },
  { name: 'Snack', category: 'mealType', description: 'Light bite' },
  { name: 'Side Dish', category: 'mealType', description: 'Accompaniment' },
  { name: 'Main Course', category: 'mealType', description: 'Primary dish' },
  { name: 'Soup', category: 'mealType', description: 'Liquid dish' },
  { name: 'Salad', category: 'mealType', description: 'Fresh greens dish' },
  { name: 'Beverage', category: 'mealType', description: 'Drinks' },

  // Cuisine
  { name: 'Italian', category: 'cuisine', description: 'Italian cuisine' },
  { name: 'Mexican', category: 'cuisine', description: 'Mexican cuisine' },
  { name: 'Chinese', category: 'cuisine', description: 'Chinese cuisine' },
  { name: 'Indian', category: 'cuisine', description: 'Indian cuisine' },
  { name: 'Mediterranean', category: 'cuisine', description: 'Mediterranean cuisine' },
  { name: 'Japanese', category: 'cuisine', description: 'Japanese cuisine' },
  { name: 'Thai', category: 'cuisine', description: 'Thai cuisine' },
  { name: 'French', category: 'cuisine', description: 'French cuisine' },
  { name: 'Greek', category: 'cuisine', description: 'Greek cuisine' },
  { name: 'Spanish', category: 'cuisine', description: 'Spanish cuisine' },
  { name: 'Korean', category: 'cuisine', description: 'Korean cuisine' },
  { name: 'Vietnamese', category: 'cuisine', description: 'Vietnamese cuisine' },
  { name: 'American', category: 'cuisine', description: 'American cuisine' },
  { name: 'Middle Eastern', category: 'cuisine', description: 'Middle Eastern cuisine' },
  { name: 'Caribbean', category: 'cuisine', description: 'Caribbean cuisine' },
  { name: 'African', category: 'cuisine', description: 'African cuisine' },

  // Cooking Time
  { name: 'Under 15 minutes', category: 'cookingTime', description: 'Very quick recipes' },
  { name: 'Under 30 minutes', category: 'cookingTime', description: 'Quick recipes' },
  { name: '30-60 minutes', category: 'cookingTime', description: 'Medium time recipes' },
  { name: '1-2 hours', category: 'cookingTime', description: 'Longer recipes' },
  { name: 'Over 2 hours', category: 'cookingTime', description: 'Extended cooking time' },
  { name: 'Quick & Easy', category: 'cookingTime', description: 'Fast and simple' },
  { name: 'Slow Cooker', category: 'cookingTime', description: 'Slow cooker recipes' },
  { name: 'Instant Pot', category: 'cookingTime', description: 'Pressure cooker recipes' },
  { name: 'No Cook', category: 'cookingTime', description: 'No cooking required' },
  { name: 'Overnight', category: 'cookingTime', description: 'Prepare ahead overnight' },

  // Difficulty
  { name: 'Beginner', category: 'difficulty', description: 'Easy for beginners' },
  { name: 'Easy', category: 'difficulty', description: 'Simple recipes' },
  { name: 'Intermediate', category: 'difficulty', description: 'Moderate skill level' },
  { name: 'Advanced', category: 'difficulty', description: 'Challenging recipes' },
  { name: 'Professional', category: 'difficulty', description: 'Chef-level recipes' },
  { name: 'Kid-Friendly', category: 'difficulty', description: 'Kids can help make' },

  // Season
  { name: 'Spring', category: 'season', description: 'Spring seasonal recipes' },
  { name: 'Summer', category: 'season', description: 'Summer seasonal recipes' },
  { name: 'Fall', category: 'season', description: 'Fall/Autumn seasonal recipes' },
  { name: 'Winter', category: 'season', description: 'Winter seasonal recipes' },
  { name: 'Year-Round', category: 'season', description: 'Any season' },

  // Special Occasions
  { name: 'Birthday', category: 'special', description: 'Birthday celebrations' },
  { name: 'Christmas', category: 'special', description: 'Christmas recipes' },
  { name: 'Thanksgiving', category: 'special', description: 'Thanksgiving recipes' },
  { name: 'Easter', category: 'special', description: 'Easter recipes' },
  { name: 'Valentine\'s Day', category: 'special', description: 'Romantic recipes' },
  { name: 'Halloween', category: 'special', description: 'Halloween recipes' },
  { name: 'New Year', category: 'special', description: 'New Year celebrations' },
  { name: 'Game Day', category: 'special', description: 'Sports event food' },
  { name: 'Party Food', category: 'special', description: 'Party recipes' },
  { name: 'Potluck', category: 'special', description: 'Shareable dishes' },
  { name: 'Date Night', category: 'special', description: 'Romantic dinner' },
  { name: 'Picnic', category: 'special', description: 'Outdoor eating' },

  // Main Ingredient
  { name: 'Chicken', category: 'ingredient', description: 'Chicken-based recipes' },
  { name: 'Beef', category: 'ingredient', description: 'Beef-based recipes' },
  { name: 'Pork', category: 'ingredient', description: 'Pork-based recipes' },
  { name: 'Fish', category: 'ingredient', description: 'Fish-based recipes' },
  { name: 'Seafood', category: 'ingredient', description: 'Seafood recipes' },
  { name: 'Shrimp', category: 'ingredient', description: 'Shrimp recipes' },
  { name: 'Turkey', category: 'ingredient', description: 'Turkey recipes' },
  { name: 'Lamb', category: 'ingredient', description: 'Lamb recipes' },
  { name: 'Tofu', category: 'ingredient', description: 'Tofu-based recipes' },
  { name: 'Eggs', category: 'ingredient', description: 'Egg-based recipes' },
  { name: 'Pasta', category: 'ingredient', description: 'Pasta dishes' },
  { name: 'Rice', category: 'ingredient', description: 'Rice dishes' },
  { name: 'Potatoes', category: 'ingredient', description: 'Potato dishes' },
  { name: 'Vegetables', category: 'ingredient', description: 'Vegetable-focused' },
  { name: 'Beans', category: 'ingredient', description: 'Bean-based recipes' },
  { name: 'Cheese', category: 'ingredient', description: 'Cheese-focused' },
  { name: 'Chocolate', category: 'ingredient', description: 'Chocolate recipes' },
  { name: 'Fruit', category: 'ingredient', description: 'Fruit-based recipes' },

  // Cooking Method
  { name: 'Baked', category: 'cookingMethod', description: 'Oven-baked recipes' },
  { name: 'Grilled', category: 'cookingMethod', description: 'Grilled recipes' },
  { name: 'Fried', category: 'cookingMethod', description: 'Fried recipes' },
  { name: 'Steamed', category: 'cookingMethod', description: 'Steamed recipes' },
  { name: 'Roasted', category: 'cookingMethod', description: 'Roasted recipes' },
  { name: 'Sautéed', category: 'cookingMethod', description: 'Pan-sautéed recipes' },
  { name: 'Stir-Fried', category: 'cookingMethod', description: 'Stir-fry recipes' },
  { name: 'Braised', category: 'cookingMethod', description: 'Braised recipes' },
  { name: 'Smoked', category: 'cookingMethod', description: 'Smoked recipes' },
  { name: 'Air Fryer', category: 'cookingMethod', description: 'Air fryer recipes' },
  { name: 'One-Pot', category: 'cookingMethod', description: 'Single pot cooking' },
  { name: 'Sheet Pan', category: 'cookingMethod', description: 'Sheet pan meals' },
  { name: 'Raw', category: 'cookingMethod', description: 'No cooking needed' },

  // Diet
  { name: 'Keto', category: 'diet', description: 'Ketogenic diet friendly' },
  { name: 'Paleo', category: 'diet', description: 'Paleo diet friendly' },
  { name: 'Low-Carb', category: 'diet', description: 'Low carbohydrate' },
  { name: 'High-Protein', category: 'diet', description: 'Protein-rich recipes' },
  { name: 'Whole30', category: 'diet', description: 'Whole30 compliant' },
  { name: 'DASH Diet', category: 'diet', description: 'DASH diet friendly' },
  { name: 'Clean Eating', category: 'diet', description: 'Whole, unprocessed foods' },
  { name: 'Plant-Based', category: 'diet', description: 'Plant-based recipes' },

  // Allergen Information
  { name: 'Peanut-Free', category: 'allergy', description: 'No peanuts' },
  { name: 'Tree Nut-Free', category: 'allergy', description: 'No tree nuts' },
  { name: 'Soy-Free', category: 'allergy', description: 'No soy' },
  { name: 'Shellfish-Free', category: 'allergy', description: 'No shellfish' },
  { name: 'Sesame-Free', category: 'allergy', description: 'No sesame' },

  // Nutrition
  { name: 'Low-Fat', category: 'nutrition', description: 'Low fat content' },
  { name: 'Low-Calorie', category: 'nutrition', description: 'Calorie-conscious' },
  { name: 'Sugar-Free', category: 'nutrition', description: 'No added sugar' },
  { name: 'Low-Sodium', category: 'nutrition', description: 'Reduced sodium' },
  { name: 'High-Fiber', category: 'nutrition', description: 'Fiber-rich recipes' },
  { name: 'Heart-Healthy', category: 'nutrition', description: 'Good for heart health' },

  // Temperature
  { name: 'Hot', category: 'temperature', description: 'Served hot' },
  { name: 'Cold', category: 'temperature', description: 'Served cold' },
  { name: 'Room Temperature', category: 'temperature', description: 'Served at room temp' },
  { name: 'Frozen', category: 'temperature', description: 'Frozen treats' },
  { name: 'Chilled', category: 'temperature', description: 'Served chilled' },

  // Texture
  { name: 'Crispy', category: 'texture', description: 'Crispy texture' },
  { name: 'Creamy', category: 'texture', description: 'Creamy texture' },
  { name: 'Crunchy', category: 'texture', description: 'Crunchy texture' },
  { name: 'Soft', category: 'texture', description: 'Soft texture' },
  { name: 'Chewy', category: 'texture', description: 'Chewy texture' },
  { name: 'Fluffy', category: 'texture', description: 'Light and fluffy' },
  { name: 'Tender', category: 'texture', description: 'Tender texture' },

  // Flavor Profile
  { name: 'Spicy', category: 'flavor', description: 'Spicy/hot flavor' },
  { name: 'Sweet', category: 'flavor', description: 'Sweet flavor' },
  { name: 'Savory', category: 'flavor', description: 'Savory/umami flavor' },
  { name: 'Sour', category: 'flavor', description: 'Sour/tangy flavor' },
  { name: 'Tangy', category: 'flavor', description: 'Tangy flavor' },
  { name: 'Smoky', category: 'flavor', description: 'Smoky flavor' },
  { name: 'Herb-Forward', category: 'flavor', description: 'Herby flavor' },
  { name: 'Garlicky', category: 'flavor', description: 'Garlic-forward' },
  { name: 'Zesty', category: 'flavor', description: 'Bright, zesty flavor' },
  { name: 'Mild', category: 'flavor', description: 'Mild, not spicy' },
  { name: 'Rich', category: 'flavor', description: 'Rich, indulgent flavor' },
  { name: 'Light', category: 'flavor', description: 'Light, refreshing flavor' },
];

async function seedTags() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not found in .env');
      process.exit(1);
    }
    await mongoose.connect(mongoUri, { dbName: 'Epicure' });
    console.log('Connected to MongoDB (Epicure database)');

    let created = 0;
    let skipped = 0;

    for (const tag of tags) {
      const existingTag = await Tag.findOne({ name: tag.name });
      if (!existingTag) {
        await Tag.create(tag);
        created++;
        console.log(`Created: ${tag.name}`);
      } else {
        skipped++;
      }
    }

    console.log(`\nSeed complete! Created: ${created}, Skipped (already exist): ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tags:', error);
    process.exit(1);
  }
}

seedTags();
