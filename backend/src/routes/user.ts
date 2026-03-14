import express from 'express';
import {
  LoginUser,
  SignupUser,
  CreateCookbook,
  DeleteCookbook,
  getUsers,
  getUser,
  SaveRecipe,
  DeleteRecipe,
  AddChefToList,
  DeleteChefFromList,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/login', LoginUser);
router.post('/signup', SignupUser);
router.post('/cookbook', CreateCookbook);
router.delete('/cookbook', DeleteCookbook);
router.post('/save_recipe', SaveRecipe);
router.delete('/delete_recipe', DeleteRecipe);
router.post('/add_chefs_list/:id', AddChefToList);
router.delete('/remove_chefs_list/:id', DeleteChefFromList);

export default router;
