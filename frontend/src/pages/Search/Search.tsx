import { FaSearch, FaFilter, FaFire, FaStar } from "react-icons/fa";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import SearchResultsList from "../../components/SearchResultsList.jsx";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLocation, useNavigate } from "react-router-dom";

// Tag categories (for UI organization)
const TAG_CATEGORIES = {
  dietary: {name: 'Dietary', icon: '🥗'},
  mealType: {name: 'Meal Type', icon: '🍲'},
  cuisine: {name: 'Cuisine', icon: '🌎'},
  cookingTime: {name: 'Cooking Time', icon: '⏱️'},
  difficulty: {name: 'Difficulty', icon: '📊'},
  season: {name: 'Season', icon: '🍂'},
  special: {name: 'Special', icon: '✨'}
};

// Available tags for each category
const AVAILABLE_TAGS = {
  dietary: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'],
  mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer'],
  cuisine: ['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Mediterranean'],
  cookingTime: ['Quick (15 min)', 'Medium (30 min)', 'Long (1h+)'],
  difficulty: ['Easy', 'Medium', 'Advanced'],
  season: ['Spring', 'Summer', 'Fall', 'Winter'],
  special: ['Holiday', 'Party', 'Comfort Food', 'Healthy']
};

// Popular tags (would come from API in real implementation)
const POPULAR_TAGS = ['Vegetarian', 'Italian', 'Easy', 'Quick (15 min)', 'Healthy'];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes");
  const { recipes } = useRecipeContext();
  const { users } = useAuthContext();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState('dietary');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const tag = params.get('tag') || '';
    
    setSearchQuery(query);
    setSelectedTag(tag);
    
    if (tag) {
      setActiveFilter("recipes");
    }
    
    filterResults(query, tag);
  }, [location.search, recipes]);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    updateUrl(query, selectedTag);
    filterResults(query, selectedTag);
  };

  const handleTagToggle = (tag) => {
    // If tag is already selected, deselect it
    const newTag = tag === selectedTag ? "" : tag;
    setSelectedTag(newTag);
    updateUrl(searchQuery, newTag);
    filterResults(searchQuery, newTag);
  };

  const updateUrl = (query, tag) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tag) params.set('tag', tag);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const filterResults = (query, tag) => {
    let results = activeFilter === "recipes" ? [...recipes] : [...users];
    
    // Filter by search query
    if (query) {
      results = results.filter(item => 
        activeFilter === "recipes" 
          ? item.title.toLowerCase().includes(query)
          : item.name.toLowerCase().includes(query)
      );
    }

    // Filter by tag (only for recipes)
    if (activeFilter === "recipes" && tag) {
      results = results.filter(recipe => {
        if (!recipe.tags || !recipe.tags.length) return false;
        
        // Get tag strings from recipe tags
        const recipeTags = recipe.tags.map(t => {
          return typeof t === 'object' ? t.tag : t;
        });
        
        return recipeTags.some(recipeTag => 
          recipeTag.toLowerCase() === tag.toLowerCase()
        );
      });
    }

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
    setSelectedTag("");
    navigate('/search', { replace: true });
  };

  const renderSearchResultsList_5Items = (results) => {
    if (results.length === 0) {
      return (
        <div className="text-center text-white py-8">
          <p className="text-xl">No results found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      );
    }

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
        popularTags={POPULAR_TAGS}
      />
    ));
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4 p-4">
        {/* Search Type Toggle */}
        <div className="flex justify-center">
          <div className="flex text-white gap-4 bg-[#2A2826] p-1 rounded-full">
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${
                activeFilter === "recipes" 
                  ? "bg-[#BE6F50] text-white shadow-lg" 
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => handleSearchType("recipes")}
            >
              Recipes
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${
                activeFilter === "creators" 
                  ? "bg-[#BE6F50] text-white shadow-lg" 
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => handleSearchType("creators")}
            >
              Content Creators
            </button>
          </div>
        </div>

        {/* Search Bar and Tag Filter */}
        <div className="flex items-center justify-center gap-4">
          <div className="relative max-w-2xl w-full">
            <SearchBar 
              value={searchQuery} 
              onChange={handleInputChange} 
              placeholder={activeFilter === "recipes" ? "What's cooking?" : "Who's cooking?"}
            />
          </div>
          
          {activeFilter === "recipes" && (
            <div className="relative">
              <button
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2826] text-[#BE6F50] hover:bg-[#BE6F50]/20 transition-colors duration-200"
              >
                <FaFilter className="h-5 w-5" />
                <span className="font-medium">Tags</span>
                {selectedTag && (
                  <span className="ml-1 px-2 py-0.5 bg-[#BE6F50] text-white text-xs rounded-full">
                    1
                  </span>
                )}
              </button>

              {/* Tag Dropdown */}
              {showTagDropdown && (
                <div className="absolute right-0 top-12 z-50 bg-[#2A2826] rounded-lg shadow-lg border border-[#BE6F50]/20 p-4 min-w-[300px] max-h-[80vh] overflow-y-auto">
                  {/* Popular Tags Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-white mb-3">
                      <FaFire className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium text-amber-300">Popular Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                            selectedTag === tag
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                              : 'bg-gradient-to-r from-amber-900/40 to-amber-800/40 text-amber-200 border border-amber-600/30 hover:bg-amber-700/40'
                          }`}
                        >
                          <FaStar className="h-3 w-3" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-b border-[#BE6F50]/20 mb-4"></div>

                  {/* Tag Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <h3 className="w-full text-white mb-3 font-medium">Browse by Category</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {Object.entries(TAG_CATEGORIES).map(([category, details]) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`category-button ${
                            activeCategory === category
                              ? 'category-button-active'
                              : 'category-button-inactive'
                          }`}
                        >
                          <span className="text-lg">{details.icon}</span>
                          <span>{details.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags for selected category */}
                  <div>
                    <h3 className="text-white mb-3 font-medium flex items-center gap-2">
                      <span className="text-lg">{TAG_CATEGORIES[activeCategory].icon}</span>
                      <span>{TAG_CATEGORIES[activeCategory].name} Tags</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS[activeCategory].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedTag === tag
                              ? 'bg-[#BE6F50] text-white shadow-md'
                              : 'bg-[#1E1C1A] text-gray-200 border border-[#BE6F50]/20 hover:bg-[#BE6F50]/10'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Tag Display */}
        {activeFilter === "recipes" && selectedTag && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                POPULAR_TAGS.includes(selectedTag)
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-[#BE6F50] text-white'
              }`}
            >
              {POPULAR_TAGS.includes(selectedTag) && <FaStar className="h-3 w-3" />}
              <span className="text-sm font-medium">{selectedTag}</span>
              <button
                onClick={() => handleTagToggle(selectedTag)}
                className="text-white hover:text-gray-200 ml-1"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="mt-4">
          {renderSearchResultsList_5Items(searchResults)}
        </div>
      </div>
    </div>
  );
};

export default Search;