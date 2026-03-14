import { useState, useEffect } from "react";
import SearchBar from "../../Search/components/SearchBar";
import SearchResultsList from "../../../components/SearchResultsList";

const SearchCC = ({ creatorRecipes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(creatorRecipes);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results = creatorRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  return (
    <div className="overflow-y-auto grid grid-cols-1 items-center lg:max-auto xl:max-w-screen-xl max-h-[400px] scrollbar-none">
      <SearchBar
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="What's cooking?"
      />

      <div className="grid grid-rows-3 overflow-y-auto text-white text-lg px-10 sm:gap-10 lg:gap-10 mb-10">
        <SearchResultsList results={searchResults} searchFilter="recipes" />
      </div>
    </div>
  );
};

export default SearchCC;
