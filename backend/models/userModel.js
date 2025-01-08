const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { schema } = require("./RecipeModel");

const Schema = mongoose.Schema;

const booksSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  recipes: {
    type: [Schema.Types.ObjectId],
    ref: "Recipe",
    default: [],
  },
});

const chefSchema = new Schema({
 ccName: {
   type: String,
   required: true,
 },
 ccId: {
   type: Schema.Types.ObjectId,
   ref: "User",
   required: true,
 },
});

const userSchema = new Schema(
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
      type: [{ type: Schema.Types.ObjectId, ref: "recipes" }], // Note the use of 'type' inside the array declaration
      default: [],
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: "Recipe",
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
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  userType,
  bio,
  profilePicture
) {
  //check if all fields are filled out
  if (!name | !email || !password) {
    throw new Error("Email and password are required");
  }

  //check if the string is an email format
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }

  //check if password is strong enough (8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  //double check that the email is unique
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //create a new user
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

// static login method
userSchema.statics.login = async function (email, password) {
  //check if all fields are filled out
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  //check if the string is an email format
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }

  //find the user
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist");
  }

  //compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
