import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Main from "./layout/Main";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import CreatorSignUp from "./pages/CreatorSignUp/CreatorSignUp";
import SingleRecipePage from "./pages/SingleRecipePage/SingleRecipePage";
import CoockBooks from "./pages/CoockBooks/CoockBooks";
import ContentCreator from "./pages/ContentCreator/ContentCreator";
import AddRecipe from "./pages/ContentCreator/AddRecipe/AddRecipe";
import "./App.css";
import BASE_URL from "./config";
import { useRecipeContext } from "./context/RecipeContext";

const App = () => {
  const { user } = useContext(AuthContext);

  const showLoadingScreen = () => {
    setTimeout(() => {}, 3500);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={user ? <Search /> : <Navigate to="/login" />}
          />
          <Route
            path="/recipe/:recipeid"
            element={user ? <SingleRecipePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/cook_books/:id/:title"
            element={user ? <CoockBooks /> : <Navigate to="/login" />}
          />
          <Route
            path="/creator/:creatorid"
            element={user ? <ContentCreator /> : <Navigate to="/login" />}
          />
          <Route
            path="/add_recipe"
            element={user ? <AddRecipe /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/creatorSignup"
            element={!user ? <CreatorSignUp /> : <Navigate to="/" />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
