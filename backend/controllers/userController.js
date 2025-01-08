const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadBase64ImageToS3(base64Image) {
  // Extract the MIME type and base64 data
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const [, mimeType, base64Data] = matches;

  // Decode base64 data
  const buffer = Buffer.from(base64Data, "base64");

  // Generate a unique filename
  const fileExtension = mimeType.split("/")[1];
  const key = `Profile/${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: mimeType,
    ACL: "public-read",
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw new Error(`Error uploading file to S3: ${error.message}`);
  }
}
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.where("userType").equals(1);
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//login user
exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//signup user
exports.SignupUser = async (req, res) => {
  const { name, email, password, userType, bio } = req.body;

  let profilePicture;
  try {
    // Upload main image
    if (req.body && req.body.profilePicture) {
      profilePicture = await uploadBase64ImageToS3(req.body.profilePicture);
    }

    const user = await User.signup(
      name,
      email,
      password,
      userType,
      bio,
      profilePicture
    );

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//create new cookbook
exports.CreateCookbook = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.body.user._id);
    user.books.push({ name, recipes: [] });
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete cookbook
exports.DeleteCookbook = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.body.user._id);
    user.books = user.books.filter((cookbook) => cookbook.name !== name);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//save recipe to cookbook
exports.SaveRecipe = async (req, res) => {
  const recipe = req.body.recipe;
  const cookbook = req.body.cookbook;
  const recipeId = recipe._id;
  try {
    const user = await User.findById(req.body.user._id);
    if (cookbook === "favorites") {
      user.favorites.push(recipeId);
      await user.save();
      res.status(201).json({ user });
      return;
    }
    const cookbookIndex = user.books.findIndex(
      (book) => book.name === cookbook
    );
    user.books[cookbookIndex].recipes.push(recipe);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//delete recipe from cookbook
exports.DeleteRecipe = async (req, res) => {
  const recipe = req.body.recipe;
  const cookbook = req.body.cookbook;
  const recipeId = recipe._id;
  try {
    const user = await User.findById(req.body.user._id);
    if (cookbook === "favorites") {
      user.favorites = user.favorites.filter((id) => id != recipeId);
      await user.save();
      res.status(201).json({ user });
      return;
    }
    const cookbookIndex = user.books.findIndex(
      (book) => book.name === cookbook
    );
    user.books[cookbookIndex].recipes = user.books[
      cookbookIndex
    ].recipes.filter((recipe) => recipe._id != recipeId);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//update chefs list
exports.AddChefToList = async (req, res) => {
  const { creatorId, user } = req.body;
  try {
    const user = await User.findById(req.params.id);
    const creator = await User.findById(creatorId);
    const creatorName = creator.name;
    user.chefs.push({ ccName: creatorName, ccId: creatorId });
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete chef from list
exports.DeleteChefFromList = async (req, res) => {
  const { creatorId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    user.chefs = user.chefs.filter((chef) => chef.ccId != creatorId);
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
