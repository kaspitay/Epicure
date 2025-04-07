# Epicure
Epicure website

# Epicure Recipe Application

## New Tag System

The application now features an improved tag system with categories for better organization and search functionality. Tags are now stored in a dedicated collection in the database, which provides several benefits:

- **Categorized Tags**: Tags are now organized by categories such as dietary restrictions, cuisine type, cooking time, etc.
- **Tag Usage Tracking**: The system tracks how often tags are used, helping identify popular tags.
- **Improved Search**: Users can filter recipes by tag categories.
- **Consistent Tagging**: Using predefined tags ensures consistency across recipes.

### Tag Categories

Tags are organized into the following categories:

- Dietary (vegetarian, vegan, gluten-free, etc.)
- Meal Type (breakfast, lunch, dinner, etc.)
- Cuisine (Italian, Mexican, Indian, etc.)
- Cooking Time (quick & easy, under 30 minutes, etc.)
- Difficulty (beginner, intermediate, etc.)
- Season (spring, summer, fall, winter)
- Special Occasions (holidays, celebrations, etc.)
- Main Ingredients (chicken, beef, vegetables, etc.)
- Cooking Methods (baked, grilled, fried, etc.)
- Diet Types (low-carb, keto, paleo, etc.)
- Allergen Information (contains nuts, dairy, etc.)
- Nutrition (low-calorie, high-protein, etc.)
- Temperature (hot, cold, room temperature, etc.)
- Texture (crispy, creamy, crunchy, etc.)
- Flavor Profile (spicy, sweet, savory, etc.)

### Setting Up the Tag System

1. **Seed the Database**: Run the following command to populate the database with initial tags:

```bash
npm run seed-tags
```

2. **Adding New Tags**: To add new tags, you can:
   - Use the API endpoint: `POST /api/tags`
   - Add them to the seed file and re-run the seeding process

### Using Tags in the Add Recipe Form

The Add Recipe form now features a more intuitive tag selection interface:

1. Choose a tag category from the tabs.
2. Select tags from the displayed options for that category.
3. Selected tags appear with their category icon in the "Selected Tags" section.
4. You can remove tags by clicking the minus icon next to them.

### Tag API Endpoints

- `GET /api/tags` - Get all tags
- `GET /api/tags/category/:category` - Get tags by category
- `POST /api/tags` - Create new tags
- `POST /api/tags/increment` - Increment tag usage count
- `GET /api/tags/popular` - Get popular tags
- `GET /api/tags/suggestions?searchTerm=term` - Get tag suggestions based on search
- `GET /api/tags/stats` - Get tag statistics
