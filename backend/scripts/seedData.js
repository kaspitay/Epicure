const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });

const User = require('../models/userModel');
const Recipe = require('../models/RecipeModel');

const MONGO = process.env.MONGO_URI;

const chefs = [
  {
    name: 'Chef Maria',
    email: 'maria@epicure.com',
    password: 'Chef1234!',
    userType: 1,
    bio: 'Italian cuisine expert with 15 years of experience. Passionate about fresh pasta and Mediterranean flavors.',
    profilePicture: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400',
    likes: 245,
    watches: 1200,
  },
  {
    name: 'Chef David',
    email: 'david@epicure.com',
    password: 'Chef1234!',
    userType: 1,
    bio: 'Asian fusion specialist. Trained in Tokyo and Bangkok. Love creating bold, exciting flavors.',
    profilePicture: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    likes: 189,
    watches: 890,
  },
  {
    name: 'Chef Sofia',
    email: 'sofia@epicure.com',
    password: 'Chef1234!',
    userType: 1,
    bio: 'Pastry chef and dessert artist. Making sweet dreams come true one cake at a time.',
    profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    likes: 312,
    watches: 1540,
  },
];

const getRecipesForChef = (chefId, chefIndex) => {
  const allRecipes = [
    // Chef Maria's recipes (Italian)
    [
      {
        title: 'Classic Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
        description:
          "Authentic Roman pasta with crispy guanciale, pecorino cheese, and silky egg sauce. A true Italian classic that's surprisingly simple to make.",
        ingredients: [
          { name: 'Spaghetti', quantity: 400, measurement: 'grams' },
          { name: 'Guanciale', quantity: 200, measurement: 'grams' },
          { name: 'Egg yolks', quantity: 4, measurement: 'pieces' },
          { name: 'Pecorino Romano', quantity: 100, measurement: 'grams' },
          { name: 'Black pepper', quantity: 2, measurement: 'teaspoons' },
        ],
        steps: [
          {
            description:
              'Bring a large pot of salted water to boil and cook spaghetti until al dente.',
          },
          {
            description:
              'Cut guanciale into small strips and cook in a pan until crispy and golden.',
          },
          { description: 'Mix egg yolks with grated pecorino and plenty of black pepper.' },
          {
            description:
              'Drain pasta, reserving some water. Add to guanciale pan, remove from heat.',
          },
          {
            description: 'Quickly toss with egg mixture, adding pasta water to create silky sauce.',
          },
        ],
        tags: [
          { tag: 'Italian', category: 'Cuisine' },
          { tag: 'Pasta', category: 'Main Ingredients' },
          { tag: 'Under 30 minutes', category: 'Cooking Time' },
        ],
        photos: [
          { image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=600' },
          { image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600' },
        ],
      },
      {
        title: 'Fresh Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
        description:
          'Neapolitan-style pizza with San Marzano tomatoes, fresh mozzarella, and basil. Simple ingredients, extraordinary taste.',
        ingredients: [
          { name: 'Pizza dough', quantity: 500, measurement: 'grams' },
          { name: 'San Marzano tomatoes', quantity: 400, measurement: 'grams' },
          { name: 'Fresh mozzarella', quantity: 250, measurement: 'grams' },
          { name: 'Fresh basil', quantity: 10, measurement: 'leaves' },
          { name: 'Olive oil', quantity: 2, measurement: 'tablespoons' },
        ],
        steps: [
          { description: 'Preheat oven to highest setting (250°C/480°F) with pizza stone inside.' },
          { description: 'Stretch dough into a 12-inch circle on floured surface.' },
          { description: 'Crush tomatoes by hand and spread evenly, leaving border for crust.' },
          { description: 'Tear mozzarella into pieces and distribute over pizza.' },
          {
            description:
              'Bake for 8-10 minutes until crust is charred. Add fresh basil and olive oil.',
          },
        ],
        tags: [
          { tag: 'Italian', category: 'Cuisine' },
          { tag: 'Vegetarian', category: 'Dietary' },
          { tag: 'Baked', category: 'Cooking Methods' },
        ],
        photos: [{ image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' }],
      },
    ],
    // Chef David's recipes (Asian)
    [
      {
        title: 'Thai Green Curry',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
        description:
          'Aromatic coconut curry with tender chicken, Thai basil, and vegetables. Creamy, spicy, and absolutely addictive.',
        ingredients: [
          { name: 'Chicken breast', quantity: 500, measurement: 'grams' },
          { name: 'Green curry paste', quantity: 4, measurement: 'tablespoons' },
          { name: 'Coconut milk', quantity: 400, measurement: 'ml' },
          { name: 'Thai basil', quantity: 1, measurement: 'cup' },
          { name: 'Bamboo shoots', quantity: 200, measurement: 'grams' },
          { name: 'Fish sauce', quantity: 2, measurement: 'tablespoons' },
        ],
        steps: [
          { description: 'Cut chicken into bite-sized pieces and set aside.' },
          {
            description: 'Heat thick coconut cream in wok, add curry paste and fry until fragrant.',
          },
          { description: 'Add chicken and stir-fry until cooked through.' },
          {
            description:
              'Pour in remaining coconut milk, add vegetables and simmer for 10 minutes.',
          },
          { description: 'Season with fish sauce, add Thai basil and serve with jasmine rice.' },
        ],
        tags: [
          { tag: 'Thai', category: 'Cuisine' },
          { tag: 'Spicy', category: 'Flavor Profile' },
          { tag: 'Chicken', category: 'Main Ingredients' },
        ],
        photos: [{ image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600' }],
      },
      {
        title: 'Crispy Pork Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        description:
          'Rich tonkotsu-style ramen with crispy pork belly, soft-boiled egg, and all the classic toppings.',
        ingredients: [
          { name: 'Ramen noodles', quantity: 400, measurement: 'grams' },
          { name: 'Pork belly', quantity: 400, measurement: 'grams' },
          { name: 'Pork broth', quantity: 1.5, measurement: 'liters' },
          { name: 'Soft-boiled eggs', quantity: 4, measurement: 'pieces' },
          { name: 'Green onions', quantity: 4, measurement: 'stalks' },
          { name: 'Nori sheets', quantity: 4, measurement: 'pieces' },
        ],
        steps: [
          { description: 'Season pork belly and roast at 200°C until crispy, about 45 minutes.' },
          { description: 'Heat pork broth with soy sauce and mirin until simmering.' },
          { description: 'Cook ramen noodles according to package instructions.' },
          { description: 'Slice pork belly into thick pieces.' },
          { description: 'Assemble bowls with noodles, broth, pork, egg, nori, and green onions.' },
        ],
        tags: [
          { tag: 'Japanese', category: 'Cuisine' },
          { tag: 'Pork', category: 'Main Ingredients' },
          { tag: 'Hot', category: 'Temperature' },
        ],
        photos: [{ image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600' }],
      },
    ],
    // Chef Sofia's recipes (Desserts)
    [
      {
        title: 'Classic Tiramisu',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
        description:
          'Layers of espresso-soaked ladyfingers and mascarpone cream. The ultimate Italian dessert, no baking required.',
        ingredients: [
          { name: 'Ladyfinger biscuits', quantity: 300, measurement: 'grams' },
          { name: 'Mascarpone cheese', quantity: 500, measurement: 'grams' },
          { name: 'Espresso coffee', quantity: 300, measurement: 'ml' },
          { name: 'Egg yolks', quantity: 4, measurement: 'pieces' },
          { name: 'Sugar', quantity: 100, measurement: 'grams' },
          { name: 'Cocoa powder', quantity: 30, measurement: 'grams' },
        ],
        steps: [
          { description: 'Brew espresso and let it cool completely.' },
          { description: 'Whisk egg yolks with sugar until pale and fluffy.' },
          { description: 'Fold in mascarpone until smooth and creamy.' },
          { description: 'Quickly dip ladyfingers in espresso and layer in dish.' },
          {
            description:
              'Spread mascarpone cream, repeat layers. Refrigerate 4 hours, dust with cocoa.',
          },
        ],
        tags: [
          { tag: 'Italian', category: 'Cuisine' },
          { tag: 'Dessert', category: 'Meal Type' },
          { tag: 'Sweet', category: 'Flavor Profile' },
          { tag: 'Vegetarian', category: 'Dietary' },
        ],
        photos: [{ image: 'https://images.unsplash.com/photo-1542124948-dc391252a940?w=600' }],
      },
      {
        title: 'Chocolate Lava Cake',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
        description:
          'Individual molten chocolate cakes with a gooey center. Pure chocolate indulgence in every bite.',
        ingredients: [
          { name: 'Dark chocolate', quantity: 200, measurement: 'grams' },
          { name: 'Butter', quantity: 150, measurement: 'grams' },
          { name: 'Eggs', quantity: 4, measurement: 'pieces' },
          { name: 'Sugar', quantity: 100, measurement: 'grams' },
          { name: 'Flour', quantity: 50, measurement: 'grams' },
        ],
        steps: [
          { description: 'Preheat oven to 200°C. Butter and flour 4 ramekins.' },
          { description: 'Melt chocolate and butter together, stirring until smooth.' },
          { description: 'Whisk eggs and sugar until thick, fold into chocolate mixture.' },
          { description: 'Add flour and divide between ramekins.' },
          {
            description:
              'Bake for 12-14 minutes until edges are set but center jiggles. Serve immediately.',
          },
        ],
        tags: [
          { tag: 'French', category: 'Cuisine' },
          { tag: 'Dessert', category: 'Meal Type' },
          { tag: 'Chocolate', category: 'Main Ingredients' },
          { tag: 'Baked', category: 'Cooking Methods' },
        ],
        photos: [{ image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' }],
      },
    ],
  ];

  return allRecipes[chefIndex].map((recipe) => ({
    ...recipe,
    userId: chefId,
  }));
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO, { dbName: 'Epicure' });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ userType: 1 });
    await Recipe.deleteMany({});
    console.log('Cleared existing chefs and recipes');

    // Create chefs
    const createdChefs = [];
    for (const chef of chefs) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(chef.password, salt);

      const newChef = await User.create({
        ...chef,
        password: hashedPassword,
      });
      createdChefs.push(newChef);
      console.log(`Created chef: ${chef.name}`);
    }

    // Create recipes for each chef
    for (let i = 0; i < createdChefs.length; i++) {
      const chef = createdChefs[i];
      const recipes = getRecipesForChef(chef._id, i);

      for (const recipeData of recipes) {
        const recipe = await Recipe.create(recipeData);

        // Add recipe to chef's recipes array
        await User.findByIdAndUpdate(chef._id, {
          $push: { recipes: recipe._id },
        });

        console.log(`Created recipe: ${recipe.title} by ${chef.name}`);
      }
    }

    console.log('\nSeeding complete!');
    console.log(`Created ${createdChefs.length} chefs`);
    console.log(`Created 6 recipes total`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
