const Recipe = require('../models/RecipeModel');
const users = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function saveBase64ImageLocally(base64Image) {
  // Extract the MIME type and base64 data
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const [, mimeType, base64Data] = matches;

  // Decode base64 data
  const buffer = Buffer.from(base64Data, 'base64');

  // Generate a unique filename
  const fileExtension = mimeType.split('/')[1];
  const filename = `${uuidv4()}.${fileExtension}`;
  const filepath = path.join(__dirname, '../uploads/Food', filename);

  try {
    fs.writeFileSync(filepath, buffer);
    return `http://localhost:${process.env.PORT}/uploads/Food/${filename}`;
  } catch (error) {
    throw new Error(`Error saving file locally: ${error.message}`);
  }
}

exports.getRecipes = async (req, res) => {
  try {
    const recipeStream = await Recipe.find().cursor();

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
    res.status(400).json({ message: err.message });
  }
};

//get one recipe
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//create recipe
exports.createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, tags, user, userId } = req.body;

  let image, photos;
  try {
    // Upload main image
    if (req.body && req.body.image) {
      image = await saveBase64ImageLocally(req.body.image);
    }

    // Upload step images
    const updatedSteps = await Promise.all(
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
    } else {
      photos = [];
    }
    const photos_to_save = photos.map((photoUrl) => ({ image: photoUrl }));

    const recipe = new Recipe({
      title,
      image,
      description,
      ingredients,
      steps: updatedSteps, // Use the updated steps with S3 URLs
      tags,
      photos: photos_to_save,
      userId,
    });

    const savedRecipe = await recipe.save();

    await users.findByIdAndUpdate(userId, {
      $push: { recipes: savedRecipe._id },
    });
    user.recipes.push(savedRecipe._id.toString());

    res.status(201).json({ recipe: savedRecipe, user });
  } catch (err) {
    console.error('Error in createRecipe:', err);
    res.status(400).json({ message: err.message });
  }
};

//update recipe
exports.updateRecipe = async (req, res) => {
  const { title, image, description, ingredients, steps, tags, photos } = req.body;
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, image, description, ingredients, steps, tags, photos },
      { new: true }
    );
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
