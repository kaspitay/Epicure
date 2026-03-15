import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import Search from "../pages/Search/Search";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import CreatorSignUp from "../pages/CreatorSignUp/CreatorSignUp";
import SingleRecipePage from "../pages/SingleRecipePage/SingleRecipePage";
import CookBooks from "../pages/CookBooks/CookBooks";
import ContentCreator from "../pages/ContentCreator/ContentCreator";
import AddRecipe from "../pages/ContentCreator/AddRecipe/AddRecipeRefactored";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/signup",
          element: <SignUp/>
        },
        {
          path: "/search",
          element: <Search/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/creatorSignup",
          element: <CreatorSignUp/>
        },
        {
          path: '/recipe/:recipeid',
          element: <SingleRecipePage/>
        },
        {
          path: '/cook_books',
          element: <CookBooks />
        },
        {
          path: '/creator/:creatorid',
          element: <ContentCreator />
        },
        {
          path: '/add_recipe',
          element: <AddRecipe />
        }
      ],
      
    },
  ]);


