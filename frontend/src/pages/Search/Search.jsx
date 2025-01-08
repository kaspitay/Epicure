import { FaSearch } from "react-icons/fa";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar.jsx";
import SearchResultsList from "../../components/SearchResultsList.jsx";
import { useRecipeContext } from "../../context/RecipeContext";
import { useHeightContext } from "../../context/HeightContext.jsx";
import { useAuthContext } from "../../hooks/useAuthContext";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes");
  const { recipes } = useRecipeContext();
  const { containerHeight } = useHeightContext();
  const { users } = useAuthContext();
  const [searchResults, setSearchResults] = useState(recipes);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results =
      activeFilter === "recipes"
        ? recipes.filter((recipe) => recipe.title.toLowerCase().includes(query))
        : users.filter((user) => user.name.toLowerCase().includes(query));
    setSearchResults(results);
  };

  const handleSearchType = (searchType) => {
    if (searchType === "recipes") {
      setActiveFilter("recipes");
      setSearchResults(recipes);
    } else {
      setActiveFilter("creators");
      setSearchResults(users);
    }
    setSearchQuery("");
  };

  const renderSearchResultsList_5Items = (results) => {
    const results_5items_array = [];
    for (let i = 0; i < results.length; i += 5) {
      const chunk = results.slice(i, i + 5);
      results_5items_array.push(chunk);
    }
    return results_5items_array.map((chunk, index) => (
      <SearchResultsList
        key={index}
        results={chunk}
        searchFilter={activeFilter}
        arrow={false}
      />
    ));
  };

  return (
    <div className="w-full h-full rounded-lg bg-[#1E1C1A] grid md:grid-rows-12 lg:grid-rows-10">
      <div className="row-span-2 md:h-[50px]">
        <PageHeader HeaderName="Search" />
      </div>
      <div
        className="overflow-y-auto scrollbar-hidden py-5"
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center " id="filter-menu">
          <div className="overflow-x-auto max-w-[80%] lg:block">
            <div className="flex text-white gap-10 px-3 lg:px-0">
              <button
                className={`px-3 lg:px-5 py-2 rounded-full ${
                  activeFilter === "recipes" ? "bg-[#BE6F50]" : "bg-[#272727]"
                }`}
                onClick={() => handleSearchType("recipes")}
              >
                Recipes
              </button>
              <button
                className={`px-3 lg:px-5 py-2 rounded-full ${
                  activeFilter === "creators" ? "bg-[#BE6F50]" : "bg-[#272727]"
                }`}
                onClick={() => handleSearchType("creators")}
              >
                Content Creators
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row-span-9 overflow-y-auto scrollbar-none mt-2">
        <SearchBar 
          value={searchQuery} 
          onChange={handleInputChange} 
          placeholder={activeFilter === "recipes" ? "What's cooking?" : "Who's cooking?"}
        />
        <div
          className=" grid grid-rows-2  bg-[#1E1C1A]
            text-white text-lg px-10 rounded-lg md:gap-5 lg:gap-5"
        >
          {renderSearchResultsList_5Items(searchResults)}
        </div>
      </div>
    </div>
  );
};

export default Search;