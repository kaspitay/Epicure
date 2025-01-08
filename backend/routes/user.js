const express = require("express");
const router = express.Router();

// contoller functions
const {
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

} = require("../controllers/userController");

router.get("/", getUsers);

router.get("/:id", getUser);
//login route
router.post("/login", LoginUser);

//signup route
router.post("/signup", SignupUser);

//new cookbook route
router.post("/cookbook", CreateCookbook);

//delete cookbook route
router.delete("/cookbook", DeleteCookbook);


//save recipe to cookbook route
router.post("/save_recipe", SaveRecipe);

//delete recipe from cookbook route
router.delete("/delete_recipe", DeleteRecipe);

//add chef to list route
router.post("/add_chefs_list/:id", AddChefToList);

//delete chef from list route
router.delete("/remove_chefs_list/:id", DeleteChefFromList);


module.exports = router;
