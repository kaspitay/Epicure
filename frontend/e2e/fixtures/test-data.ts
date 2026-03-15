export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const testRecipe = {
  title: 'E2E Test Recipe',
  description: 'A delicious test recipe created by E2E tests',
  ingredients: [
    { name: 'Test Ingredient 1', amount: '1', unit: 'cup' },
    { name: 'Test Ingredient 2', amount: '2', unit: 'tbsp' },
  ],
  steps: [
    { instruction: 'First step of the test recipe' },
    { instruction: 'Second step of the test recipe' },
  ],
  tags: ['Quick', 'Easy'],
};

export const searchTerms = {
  validQuery: 'pasta',
  noResultsQuery: 'xyznonexistent123',
  tagFilter: 'Vegetarian',
};
