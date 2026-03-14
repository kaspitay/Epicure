import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import User from '../models/userModel';
import { SignupBody, LoginBody, SaveRecipeBody } from '../types';

async function saveBase64ImageLocally(base64Image: string): Promise<string> {
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, 'base64');
  const fileExtension = mimeType.split('/')[1];
  const filename = `${uuidv4()}.${fileExtension}`;
  const filepath = path.join(__dirname, '../../uploads/Profile', filename);

  try {
    fs.writeFileSync(filepath, buffer);
    return `http://localhost:${process.env.PORT}/uploads/Profile/${filename}`;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Error saving file locally: ${err.message}`);
  }
}

const createToken = (_id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ _id }, secret, { expiresIn: '3d' });
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.where('userType').equals(1);
    res.status(200).json({ users });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};

export const LoginUser = async (
  req: Request<object, object, LoginBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken((user._id as Types.ObjectId).toString());
    res.status(200).json({ email, user, token });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const SignupUser = async (
  req: Request<object, object, SignupBody>,
  res: Response
): Promise<void> => {
  const { name, email, password, userType, bio } = req.body;

  let profilePicture: string | undefined;
  try {
    if (req.body.profilePicture) {
      profilePicture = await saveBase64ImageLocally(req.body.profilePicture);
    }

    const user = await User.signup(name, email, password, userType, bio, profilePicture);
    const token = createToken((user._id as Types.ObjectId).toString());
    res.status(200).json({ email, user, token });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

interface CookbookBody {
  name: string;
  user: { _id: string };
}

export const CreateCookbook = async (
  req: Request<object, object, CookbookBody>,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.body.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.books.push({ name, recipes: [] });
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const DeleteCookbook = async (
  req: Request<object, object, CookbookBody>,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.body.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.books = user.books.filter((cookbook) => cookbook.name !== name);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const SaveRecipe = async (
  req: Request<object, object, SaveRecipeBody>,
  res: Response
): Promise<void> => {
  const { recipe, cookbook } = req.body;
  const recipeId = recipe._id;
  try {
    const user = await User.findById(req.body.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (cookbook === 'favorites') {
      user.favorites.push(new Types.ObjectId(recipeId));
      await user.save();
      res.status(201).json({ user });
      return;
    }

    const cookbookIndex = user.books.findIndex((book) => book.name === cookbook);
    if (cookbookIndex === -1) {
      res.status(404).json({ message: 'Cookbook not found' });
      return;
    }
    user.books[cookbookIndex].recipes.push(new Types.ObjectId(recipeId));
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const DeleteRecipe = async (
  req: Request<object, object, SaveRecipeBody>,
  res: Response
): Promise<void> => {
  const { recipe, cookbook } = req.body;
  const recipeId = recipe._id;
  try {
    const user = await User.findById(req.body.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (cookbook === 'favorites') {
      user.favorites = user.favorites.filter((id) => id.toString() !== recipeId.toString());
      await user.save();
      res.status(201).json({ user });
      return;
    }

    const cookbookIndex = user.books.findIndex((book) => book.name === cookbook);
    if (cookbookIndex === -1) {
      res.status(404).json({ message: 'Cookbook not found' });
      return;
    }
    user.books[cookbookIndex].recipes = user.books[cookbookIndex].recipes.filter(
      (id) => id.toString() !== recipeId.toString()
    );
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

interface ChefBody {
  creatorId: string;
}

export const AddChefToList = async (
  req: Request<{ id: string }, object, ChefBody>,
  res: Response
): Promise<void> => {
  const { creatorId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const creator = await User.findById(creatorId);
    if (!creator) {
      res.status(404).json({ message: 'Creator not found' });
      return;
    }

    const creatorName = creator.name;
    user.chefs.push({
      ccName: creatorName,
      ccId: new Types.ObjectId(creatorId),
    });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const DeleteChefFromList = async (
  req: Request<{ id: string }, object, ChefBody>,
  res: Response
): Promise<void> => {
  const { creatorId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.chefs = user.chefs.filter((chef) => chef.ccId.toString() !== creatorId.toString());
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};
