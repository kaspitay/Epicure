import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { router } from "./routes/router";
import { RecipeProvider } from "./context/RecipeContext";
import { HeightProvider } from "./context/HeightContext";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecipeProvider>
        <HeightProvider>
        <App />
        </HeightProvider>
      </RecipeProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
