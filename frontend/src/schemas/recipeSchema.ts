import { z } from 'zod';

// Constants
export const RECIPE_LIMITS = {
  MAX_RECIPE_NAME_LENGTH: 30,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_INGREDIENTS: 20,
  MAX_INGREDIENT_LENGTH: 30,
  MAX_INGREDIENT_QUANTITY_LENGTH: 10,
  MAX_STEPS: 15,
  MAX_STEP_DESCRIPTION_LENGTH: 400,
  MAX_TAGS: 5,
  MAX_EXTRA_IMAGES: 4,
  MAX_IMAGE_SIZE_MB: 5,
} as const;

// Ingredient schema
const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, 'Ingredient name is required')
    .max(RECIPE_LIMITS.MAX_INGREDIENT_LENGTH, `Name must be under ${RECIPE_LIMITS.MAX_INGREDIENT_LENGTH} characters`)
    .regex(/^[A-Za-z\s]+$/, 'Only English letters and spaces allowed'),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .max(RECIPE_LIMITS.MAX_INGREDIENT_QUANTITY_LENGTH, 'Quantity too long'),
  measurement: z.string().min(1, 'Measurement is required'),
});

// Step schema
const stepSchema = z.object({
  description: z
    .string()
    .min(1, 'Step description is required')
    .max(RECIPE_LIMITS.MAX_STEP_DESCRIPTION_LENGTH, `Description must be under ${RECIPE_LIMITS.MAX_STEP_DESCRIPTION_LENGTH} characters`),
  stepImage: z.string().optional().nullable(),
});

// Tag schema
const tagSchema = z.object({
  _id: z.string(),
  name: z.string(),
  category: z.string(),
});

// Extra image schema
const extraImageSchema = z.object({
  base64: z.string(),
});

// Main recipe form schema
export const recipeFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Recipe name is required')
    .max(RECIPE_LIMITS.MAX_RECIPE_NAME_LENGTH, `Name must be under ${RECIPE_LIMITS.MAX_RECIPE_NAME_LENGTH} characters`)
    .regex(/^[\p{L}\s'''-]+$/u, 'Only letters, spaces, apostrophes, and hyphens allowed'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(RECIPE_LIMITS.MAX_DESCRIPTION_LENGTH, `Description must be under ${RECIPE_LIMITS.MAX_DESCRIPTION_LENGTH} characters`),

  image: z
    .string()
    .min(1, 'Recipe image is required'),

  ingredients: z
    .array(ingredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(RECIPE_LIMITS.MAX_INGREDIENTS, `Maximum ${RECIPE_LIMITS.MAX_INGREDIENTS} ingredients allowed`),

  steps: z
    .array(stepSchema)
    .min(1, 'At least one step is required')
    .max(RECIPE_LIMITS.MAX_STEPS, `Maximum ${RECIPE_LIMITS.MAX_STEPS} steps allowed`),

  tags: z
    .array(tagSchema)
    .min(1, 'At least one tag is required')
    .max(RECIPE_LIMITS.MAX_TAGS, `Maximum ${RECIPE_LIMITS.MAX_TAGS} tags allowed`),

  photos: z
    .array(extraImageSchema)
    .max(RECIPE_LIMITS.MAX_EXTRA_IMAGES, `Maximum ${RECIPE_LIMITS.MAX_EXTRA_IMAGES} extra images allowed`)
    .default([]),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type IngredientField = z.infer<typeof ingredientSchema>;
export type StepField = z.infer<typeof stepSchema>;
export type TagField = z.infer<typeof tagSchema>;
