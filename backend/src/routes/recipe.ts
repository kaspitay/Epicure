import express from 'express';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';

const router = express.Router();

router.get('/:id', getRecipe);
router.get('/', getRecipes);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/add_recipe/:creatorId', createRecipe);

export default router;
