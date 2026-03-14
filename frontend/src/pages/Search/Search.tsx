import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSliders } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { MdRestaurantMenu } from "react-icons/md";
import SearchBar from "./components/SearchBar";
import RecipeCard from "../../components/RecipeCard";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Recipe, User } from "../../types";

// All filter options in a flat structure for horizontal display
const FILTER_GROUPS = [
  {
    id: "cuisine",
    label: "Cuisine",
    options: ["Italian", "Mexican", "Chinese", "Indian", "Japanese", "Thai", "Mediterranean", "French"],
  },
  {
    id: "meal",
    label: "Meal",
    options: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer"],
  },
  {
    id: "diet",
    label: "Diet",
    options: ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Healthy", "Low-Carb"],
  },
  {
    id: "difficulty",
    label: "Difficulty",
    options: ["Easy", "Medium", "Advanced"],
  },
];

const QUICK_FILTERS = ["Italian", "Vegetarian", "Easy", "Dessert", "Healthy", "Quick (15 min)"];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipes } = useRecipeContext();
  const { users } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"recipes" | "creators">("recipes");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeFilterGroup, setActiveFilterGroup] = useState<string | null>(null);

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const tag = params.get("tag") || "";

    setSearchQuery(query);
    if (tag) {
      setSelectedTags([tag]);
      setSearchType("recipes");
    }
  }, [location.search]);

  // Filter results
  const filteredResults = useMemo(() => {
    let results: (Recipe | User)[] = searchType === "recipes" ? [...recipes] : [...users];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((item) =>
        searchType === "recipes"
          ? (item as Recipe).title?.toLowerCase().includes(query)
          : (item as User).name?.toLowerCase().includes(query)
      );
    }

    // Filter by tags (recipes only)
    if (searchType === "recipes" && selectedTags.length > 0) {
      results = results.filter((recipe) => {
        const r = recipe as Recipe;
        if (!r.tags || !r.tags.length) return false;
        const recipeTags = r.tags.map((t) => (typeof t === "object" ? t.tag : t).toLowerCase());
        return selectedTags.some((tag) => recipeTags.includes(tag.toLowerCase()));
      });
    }

    return results;
  }, [recipes, users, searchQuery, searchType, selectedTags]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateUrl(e.target.value, selectedTags);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrl("", selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateUrl(searchQuery, newTags);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    updateUrl(searchQuery, []);
  };

  const updateUrl = (query: string, tags: string[]) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tags.length === 1) params.set("tag", tags[0]);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSearchTypeChange = (type: "recipes" | "creators") => {
    setSearchType(type);
    setSelectedTags([]);
    setSearchQuery("");
    setActiveFilterGroup(null);
    navigate("/search", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1E1C1A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Type Toggle */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex bg-[#272727] p-1 rounded-full">
              <button
                onClick={() => handleSearchTypeChange("recipes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  searchType === "recipes"
                    ? "bg-[#BE6F50] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <MdRestaurantMenu />
                <span>Recipes</span>
              </button>
              <button
                onClick={() => handleSearchTypeChange("creators")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  searchType === "creators"
                    ? "bg-[#BE6F50] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LuChefHat />
                <span>Chefs</span>
              </button>
            </div>

            {/* Results count */}
            <span className="text-sm text-gray-400">
              <span className="text-white font-medium">{filteredResults.length}</span> results
            </span>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              placeholder={searchType === "recipes" ? "Search recipes..." : "Search chefs..."}
              autoFocus
            />
          </div>

          {/* Filters - Only for recipes */}
          {searchType === "recipes" && (
            <div className="mt-4">
              {/* Quick Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs text-gray-500 flex-shrink-0">Quick:</span>
                {QUICK_FILTERS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-[#BE6F50] text-white"
                        : "bg-[#2A2725] text-gray-300 hover:bg-[#BE6F50]/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}

                {/* More Filters Button */}
                <div className="flex-shrink-0 border-l border-white/10 pl-2 ml-2">
                  <button
                    onClick={() => setActiveFilterGroup(activeFilterGroup ? null : "cuisine")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeFilterGroup
                        ? "bg-[#BE6F50] text-white"
                        : "bg-[#2A2725] text-gray-300 hover:bg-[#BE6F50]/20"
                    }`}
                  >
                    <FiSliders className="text-xs" />
                    <span>More</span>
                  </button>
                </div>
              </div>

              {/* Expanded Filter Groups */}
              <AnimatePresence>
                {activeFilterGroup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/5"
                  >
                    {/* Filter Group Tabs */}
                    <div className="flex gap-1 mb-3">
                      {FILTER_GROUPS.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => setActiveFilterGroup(group.id)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            activeFilterGroup === group.id
                              ? "bg-white/10 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {group.label}
                        </button>
                      ))}
                    </div>

                    {/* Active Group Options */}
                    {FILTER_GROUPS.filter((g) => g.id === activeFilterGroup).map((group) => (
                      <div key={group.id} className="flex flex-wrap gap-2">
                        {group.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleTagToggle(option)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                              selectedTags.includes(option)
                                ? "bg-[#BE6F50] text-white"
                                : "bg-[#2A2725] text-gray-400 hover:text-white hover:bg-[#BE6F50]/20"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Filters Display */}
              <AnimatePresence>
                {selectedTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5"
                  >
                    <span className="text-xs text-gray-500">Active:</span>
                    {selectedTags.map((tag) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => handleTagToggle(tag)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#BE6F50] text-white text-xs"
                      >
                        <span>{tag}</span>
                        <FiX className="text-xs" />
                      </motion.button>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-gray-400 hover:text-white ml-1"
                    >
                      Clear all
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#272727] flex items-center justify-center">
              {searchType === "recipes" ? (
                <MdRestaurantMenu className="text-2xl text-gray-500" />
              ) : (
                <LuChefHat className="text-2xl text-gray-500" />
              )}
            </div>
            <h3 className="text-lg text-white font-medium mb-1">No results found</h3>
            <p className="text-gray-400 text-sm mb-4">
              {searchQuery || selectedTags.length > 0
                ? "Try different keywords or filters"
                : `Search for ${searchType === "recipes" ? "recipes" : "chefs"}`}
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags([]);
                  navigate("/search", { replace: true });
                }}
                className="px-4 py-2 rounded-full bg-[#BE6F50] text-white text-sm font-medium hover:bg-[#A85D40] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {filteredResults.map((item, index) =>
              searchType === "recipes" ? (
                <RecipeCard key={item._id} recipe={item as Recipe} index={index} />
              ) : (
                <CreatorCard key={item._id} creator={item as User} index={index} />
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Creator Card Component
const CreatorCard = ({ creator, index }: { creator: User; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.03 }}
    whileHover={{ y: -4 }}
    className="h-full"
  >
    <Link to={`/creator/${creator._id}`} className="block h-full">
      <div className="flex flex-col items-center p-4 rounded-xl bg-[#2A2725] hover:bg-[#332F2C] transition-all duration-300 h-full">
        <div className="relative w-20 h-20 mb-3 flex-shrink-0">
          <img
            src={creator.profilePicture || "/default-avatar.png"}
            alt={creator.name}
            className="w-full h-full object-cover rounded-full ring-2 ring-[#BE6F50]/30 hover:ring-[#BE6F50] transition-all duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#BE6F50] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {creator.recipes?.length || 0}
            </span>
          </div>
        </div>
        <h3 className="text-white font-medium text-sm text-center line-clamp-1 w-full">
          {creator.name}
        </h3>
        <p className="text-gray-400 text-xs mt-1">{creator.likes || 0} likes</p>
      </div>
    </Link>
  </motion.div>
);

export default Search;
