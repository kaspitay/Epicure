const express = require("express");
const router = express.Router();
const Recipe = require("../models/RecipeModel");
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addRecipeToCC,
} = require("../controllers/RecipeControllets");

router.get("/:id", getRecipe);

router.get("/", getRecipes);

router.post("/", createRecipe);

router.put("/:id", updateRecipe);

router.delete("/:id", deleteRecipe);

router.post("/add_recipe/:creatorId", createRecipe);

module.exports = router;
