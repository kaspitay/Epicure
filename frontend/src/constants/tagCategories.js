export const TAG_CATEGORIES = {
  dietary: {
    label: "Dietary",
    description: "Dietary restrictions and preferences",
    icon: "🍽️",
    examples: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free"]
  },
  mealType: {
    label: "Meal Type",
    description: "Type of meal or course",
    icon: "🍲",
    examples: ["Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Snack"]
  },
  cuisine: {
    label: "Cuisine",
    description: "Regional and cultural cuisines",
    icon: "🌎",
    examples: ["Italian", "Mexican", "Chinese", "Indian", "Mediterranean"]
  },
  cookingTime: {
    label: "Cooking Time",
    description: "Time required to prepare the recipe",
    icon: "⏱️",
    examples: ["Under 30 minutes", "Quick & Easy", "Slow-cooked", "Weekend Project"]
  },
  difficulty: {
    label: "Difficulty",
    description: "Recipe difficulty level",
    icon: "📊",
    examples: ["Beginner", "Intermediate", "Advanced", "Professional"]
  },
  season: {
    label: "Season",
    description: "Seasonal recipes",
    icon: "🍂",
    examples: ["Spring", "Summer", "Fall", "Winter", "Holiday"]
  },
  special: {
    label: "Special Occasions",
    description: "Special occasions and celebrations",
    icon: "🎉",
    examples: ["Birthday", "Anniversary", "Christmas", "Thanksgiving", "Valentine's Day"]
  },
  ingredient: {
    label: "Main Ingredient",
    description: "Key ingredients in the recipe",
    icon: "🥕",
    examples: ["Chicken", "Beef", "Fish", "Tofu", "Vegetables"]
  },
  cookingMethod: {
    label: "Cooking Method",
    description: "Techniques used in the recipe",
    icon: "👨‍🍳",
    examples: ["Baked", "Grilled", "Fried", "Steamed", "Slow-cooked"]
  },
  diet: {
    label: "Diet",
    description: "Diet types and plans",
    icon: "🥗",
    examples: ["Keto", "Paleo", "Low-carb", "High-protein", "Mediterranean Diet"]
  },
  allergy: {
    label: "Allergen Information",
    description: "Allergen-related information",
    icon: "⚠️",
    examples: ["No Peanuts", "No Soy", "No Eggs", "No Wheat", "No Dairy"]
  },
  nutrition: {
    label: "Nutrition",
    description: "Nutritional aspects of the recipe",
    icon: "💪",
    examples: ["High-protein", "Low-fat", "Low-calorie", "Sugar-free", "Low-sodium"]
  },
  temperature: {
    label: "Temperature",
    description: "Serving temperature",
    icon: "🌡️",
    examples: ["Hot", "Cold", "Room Temperature", "Frozen", "Chilled"]
  },
  texture: {
    label: "Texture",
    description: "Food texture",
    icon: "👅",
    examples: ["Crispy", "Creamy", "Crunchy", "Soft", "Smooth"]
  },
  flavor: {
    label: "Flavor Profile",
    description: "Flavor characteristics",
    icon: "😋",
    examples: ["Spicy", "Sweet", "Savory", "Sour", "Umami"]
  }
};

// Helper function to get all tags from all categories
export const getAllTagExamples = () => {
  return Object.values(TAG_CATEGORIES).reduce((allTags, category) => {
    return [...allTags, ...category.examples];
  }, []);
};

// Helper function to get category by tag name
export const getCategoryByTagName = (tagName) => {
  for (const [categoryKey, category] of Object.entries(TAG_CATEGORIES)) {
    if (category.examples.includes(tagName)) {
      return categoryKey;
    }
  }
  return null;
}; 