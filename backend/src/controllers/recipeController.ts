import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import Recipe from '../models/RecipeModel';
import User from '../models/userModel';
import { CreateRecipeBody, IStep } from '../types';

async function saveBase64ImageLocally(base64Image: string): Promise<string> {
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, 'base64');
  const fileExtension = mimeType.split('/')[1];
  const filename = `${uuidv4()}.${fileExtension}`;
  const filepath = path.join(__dirname, '../../uploads/Food', filename);

  try {
    fs.writeFileSync(filepath, buffer);
    return `http://localhost:${process.env.PORT}/uploads/Food/${filename}`;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Error saving file locally: ${err.message}`);
  }
}

export const getRecipes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recipeStream = Recipe.find().cursor();

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    });

    res.write('{"recipes":[');

    let isFirst = true;
    for await (const recipe of recipeStream) {
      if (!isFirst) {
        res.write(',');
      }
      isFirst = false;

      const chunk = JSON.stringify(recipe);
      res.write(chunk);
    }

    res.write(']}');
    res.end();
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const getRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json({ recipe });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const createRecipe = async (
  req: Request<object, object, CreateRecipeBody>,
  res: Response
): Promise<void> => {
  const { title, description, ingredients, steps, tags, user, userId } = req.body;

  let image: string | undefined;
  let photos: string[] = [];

  try {
    // Upload main image
    if (req.body.image) {
      image = await saveBase64ImageLocally(req.body.image);
    }

    // Upload step images
    const updatedSteps: IStep[] = await Promise.all(
      steps.map(async (step) => {
        if (step.stepImage) {
          const stepImageUrl = await saveBase64ImageLocally(step.stepImage);
          return { ...step, stepImage: stepImageUrl };
        }
        return step;
      })
    );

    // Upload additional photos
    if (Array.isArray(req.body.photos)) {
      photos = await Promise.all(
        req.body.photos.map((photo) => saveBase64ImageLocally(photo.image))
      );
    }

    const photosToSave = photos.map((photoUrl) => ({ image: photoUrl }));

    const recipe = new Recipe({
      title,
      image,
      description,
      ingredients,
      steps: updatedSteps,
      tags,
      photos: photosToSave,
      userId,
    });

    const savedRecipe = await recipe.save();

    await User.findByIdAndUpdate(userId, {
      $push: { recipes: savedRecipe._id },
    });

    user.recipes.push(savedRecipe._id as Types.ObjectId);

    res.status(201).json({ recipe: savedRecipe, user });
  } catch (err) {
    const error = err as Error;
    console.error('Error in createRecipe:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  const { title, image, description, ingredients, steps, tags, photos } = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, image, description, ingredients, steps, tags, photos },
      { new: true }
    );
    res.status(200).json({ recipe });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const rateRecipe = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId, rating } = req.body;

  try {
    if (!userId || !rating) {
      res.status(400).json({ message: 'userId and rating are required' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex].rating = rating;
      recipe.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      // Add new rating
      recipe.ratings.push({
        userId: new Types.ObjectId(userId),
        rating,
        createdAt: new Date(),
      });
    }

    await recipe.save();

    res.status(200).json({
      message: existingRatingIndex !== -1 ? 'Rating updated' : 'Rating added',
      recipe,
      averageRating: recipe.averageRating,
      totalRatings: recipe.totalRatings,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const getUserRating = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    const userRating = recipe.ratings.find(
      (r) => r.userId.toString() === userId
    );

    res.status(200).json({
      userRating: userRating?.rating || null,
      averageRating: recipe.averageRating,
      totalRatings: recipe.totalRatings,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
