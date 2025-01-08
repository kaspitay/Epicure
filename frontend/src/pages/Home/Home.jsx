import PageHeader from "../../components/common/PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResultsList from "../../components/SearchResultsList";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  
  const { recipes } = useRecipeContext();
  const { user} = useAuthContext();
  const { loading } = useRecipeContext();

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="app-name">Epicure</div>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg">
      <div className="h-full grid grid-row-10 rounded-lg bg-[#1E1C1A]">
        <div className="row-span-3">
          <PageHeader HeaderName={user ? "Welcome, " + user.user.name : null} />
        </div>

        {/* make the section scrollable*/}
        <div className="row-span-9 overflow-y-auto scrollbar-none ">
          <div
            className=" grid grid-rows-2  bg-[#1E1C1A]
            text-white text-lg px-10 rounded-lg md:gap-5 lg:gap-5"
          >
            {/* Top 10 Section */}

            <SearchResultsList title="Top 10" results={recipes.slice(0, 10)} />

            {/* Breakfast Section */}
            <SearchResultsList
              title="Breakfast"
              results={recipes
                .filter((recipe) => {
                  return recipe.tags.some((tag) => tag.tag === "Breakfast");
                })
                .slice(0, 10)}
            />

            {/* Main Dishes Section */}
            <SearchResultsList
              title="Main Dishes"
              results={recipes
                .filter((recipe) => {
                  return recipe.tags.some((tag) => tag.tag === "Main Dishes");
                })
                .slice(0, 10)}
            />

            {/* Desserts Section */}
            <SearchResultsList
              title="Desserts"
              results={recipes
                .filter((recipe) => {
                  return recipe.tags.some((tag) => tag.tag === "Desserts");
                })
                .slice(0, 10)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
