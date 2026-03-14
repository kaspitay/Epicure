import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser, IBook, IChef, IUserModel } from '../types';

const booksSchema = new Schema<IBook>({
  name: {
    type: String,
    required: true,
  },
  recipes: {
    type: [Schema.Types.ObjectId],
    ref: 'Recipe',
    default: [],
  },
});

const chefSchema = new Schema<IChef>({
  ccName: {
    type: String,
    required: true,
  },
  ccId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: Number, // 0 = user, 1 = chef
      required: true,
    },
    recipes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'recipes' }],
      default: [],
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: 'Recipe',
      default: [],
    },
    books: {
      type: [booksSchema],
      default: [],
    },
    chefs: {
      type: [chefSchema],
    },
    likes: {
      type: Number,
      default: 0,
    },
    watches: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Static signup method
userSchema.statics.signup = async function (
  name: string,
  email: string,
  password: string,
  userType: number,
  bio?: string,
  profilePicture?: string
): Promise<IUser> {
  // Check if all fields are filled out
  if (!name || !email || !password) {
    throw new Error('Email and password are required');
  }

  // Check if the string is an email format
  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid');
  }

  // Check if password is strong enough
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }

  // Double check that the email is unique
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error('Email already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create a new user
  const user = await this.create({
    name,
    email,
    password: hash,
    userType,
    bio,
    profilePicture,
  });

  return user;
};

// Static login method
userSchema.statics.login = async function (email: string, password: string): Promise<IUser> {
  // Check if all fields are filled out
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Check if the string is an email format
  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid');
  }

  // Find the user
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Email does not exist');
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }

  return user;
};

const User = mongoose.model<IUser, Model<IUser> & IUserModel>('User', userSchema);

export default User;
