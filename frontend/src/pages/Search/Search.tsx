import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronDown, FiLoader } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { MdRestaurantMenu } from "react-icons/md";
import SearchBar from "./components/SearchBar";
import RecipeCard from "../../components/RecipeCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Recipe, User, TagDocument } from "../../types";
import { recipeApi, tagApi } from "../../api";
import { TAG_CATEGORIES } from "../../constants";

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
] as const;

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { users } = useAuthContext();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"recipes" | "creators">("recipes");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'popular'>('newest');

  // Data state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [availableTags, setAvailableTags] = useState<Record<string, TagDocument[]>>({});
  const [_suggestedTags, setSuggestedTags] = useState<{ name: string; category: string; count: number }[]>([]);
  const [popularTags, setPopularTags] = useState<TagDocument[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("dietary");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [allTags, popular] = await Promise.all([
          tagApi.getAll(),
          tagApi.getPopular(10),
        ]);

        // Group by category
        const grouped: Record<string, TagDocument[]> = {};
        Object.keys(TAG_CATEGORIES).forEach(cat => {
          grouped[cat] = [];
        });
        allTags.forEach((tag: TagDocument) => {
          if (tag.category && grouped[tag.category]) {
            grouped[tag.category].push(tag);
          }
        });
        setAvailableTags(grouped);
        setPopularTags(popular);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const tag = params.get("tag") || "";
    const tags = params.get("tags")?.split(",").filter(Boolean) || [];
    const category = params.get("category") || "";
    const sort = params.get("sort") as typeof sortBy || "newest";

    setSearchQuery(query);
    if (tag) {
      setSelectedTags([tag]);
    } else if (tags.length) {
      setSelectedTags(tags);
    }
    setSelectedCategory(category);
    setSortBy(sort);
  }, [location.search]);

  // Search recipes
  const searchRecipes = useCallback(async (resetPage = true) => {
    if (searchType !== "recipes") return;

    setIsLoading(resetPage);
    setIsLoadingMore(!resetPage);

    try {
      const currentPage = resetPage ? 1 : page;
      const response = await recipeApi.search({
        q: searchQuery,
        tags: selectedTags,
        category: selectedCategory,
        page: currentPage,
        limit: 20,
        sort: sortBy,
      });

      if (resetPage) {
        setRecipes(response.recipes);
        setPage(1);
      } else {
        setRecipes(prev => [...prev, ...response.recipes]);
      }

      setHasMore(response.pagination.hasMore);
      setTotal(response.pagination.total);
      setSuggestedTags(response.suggestions.tags);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedTags, selectedCategory, sortBy, page, searchType]);

  // Trigger search on filter changes
  useEffect(() => {
    if (searchType === "recipes") {
      const debounce = setTimeout(() => {
        searchRecipes(true);
      }, 300);
      return () => clearTimeout(debounce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedTags, selectedCategory, sortBy, searchType]);

  // Update URL
  const updateUrl = useCallback((query: string, tags: string[], category: string, sort: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tags.length) params.set("tags", tags.join(","));
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateUrl(value, selectedTags, selectedCategory, sortBy);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrl("", selectedTags, selectedCategory, sortBy);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateUrl(searchQuery, newTags, selectedCategory, sortBy);
  };

  const _handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    updateUrl(searchQuery, selectedTags, newCategory, sortBy);
  };

  const handleSortChange = (sort: typeof sortBy) => {
    setSortBy(sort);
    updateUrl(searchQuery, selectedTags, selectedCategory, sort);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedCategory("");
    setSearchQuery("");
    setSortBy("newest");
    navigate("/search", { replace: true });
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    searchRecipes(false);
  };

  const handleSearchTypeChange = (type: "recipes" | "creators") => {
    setSearchType(type);
    setSelectedTags([]);
    setSearchQuery("");
    setSelectedCategory("");
    navigate("/search", { replace: true });
  };

  // Filter creators (client-side for now)
  const filteredCreators = searchQuery
    ? users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  const hasActiveFilters = selectedTags.length > 0 || selectedCategory || searchQuery;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1E1C1A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Type Toggle & Results */}
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

            <span className="text-sm text-gray-400">
              <span className="text-white font-medium">
                {searchType === "recipes" ? total : filteredCreators.length}
              </span>{" "}
              results
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                placeholder={searchType === "recipes" ? "Search recipes..." : "Search chefs..."}
                autoFocus
              />
            </div>

            {searchType === "recipes" && (
              <>
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                  className="bg-[#2A2725] text-white px-4 py-2 rounded-xl border border-white/10 text-sm cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    showFilters || hasActiveFilters
                      ? "bg-[#BE6F50] text-white"
                      : "bg-[#2A2725] text-gray-300 hover:bg-[#353230]"
                  }`}
                >
                  Filters
                  {selectedTags.length > 0 && (
                    <span className="bg-white/20 px-1.5 rounded-full text-xs">
                      {selectedTags.length}
                    </span>
                  )}
                  <FiChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>
              </>
            )}
          </div>

          {/* Filters Panel */}
          {searchType === "recipes" && (
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  {/* Popular Tags */}
                  {popularTags.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 mb-2 block">Popular:</span>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <button
                            key={tag._id}
                            onClick={() => handleTagToggle(tag.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedTags.includes(tag.name)
                                ? "bg-[#BE6F50] text-white"
                                : "bg-[#2A2725] text-gray-300 hover:bg-[#353230]"
                            }`}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Tabs */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.keys(TAG_CATEGORIES).slice(0, 8).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                          activeFilterCategory === cat
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {(TAG_CATEGORIES as Record<string, { label: string }>)[cat]?.label}
                      </button>
                    ))}
                  </div>

                  {/* Tags Grid */}
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags[activeFilterCategory]?.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => handleTagToggle(tag.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTags.includes(tag.name)
                            ? "bg-[#BE6F50] text-white"
                            : "bg-[#2A2725] text-gray-400 hover:text-white hover:bg-[#353230]"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && searchType === "recipes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 flex-wrap"
              >
                <span className="text-xs text-gray-500">Active:</span>
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#BE6F50] text-white text-xs"
                  >
                    {tag}
                    <FiX className="text-xs" />
                  </button>
                ))}
                {searchQuery && (
                  <span className="px-2 py-1 rounded-full bg-[#2A2725] text-gray-300 text-xs">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-white ml-2"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="animate-spin text-[#BE6F50] text-3xl" />
          </div>
        ) : searchType === "recipes" ? (
          recipes.length === 0 ? (
            <EmptyState
              type="recipes"
              hasFilters={hasActiveFilters}
              onClear={clearAllFilters}
            />
          ) : (
            <>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
              >
                {recipes.map((recipe, index) => (
                  <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-[#2A2725] text-white rounded-xl font-medium hover:bg-[#353230] transition-colors disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <FiLoader className="animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )
        ) : filteredCreators.length === 0 ? (
          <EmptyState
            type="creators"
            hasFilters={!!searchQuery}
            onClear={clearAllFilters}
          />
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
          >
            {filteredCreators.map((creator, index) => (
              <CreatorCard key={creator._id} creator={creator} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({
  type,
  hasFilters,
  onClear,
}: {
  type: "recipes" | "creators";
  hasFilters: boolean;
  onClear: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#272727] flex items-center justify-center">
      {type === "recipes" ? (
        <MdRestaurantMenu className="text-2xl text-gray-500" />
      ) : (
        <LuChefHat className="text-2xl text-gray-500" />
      )}
    </div>
    <h3 className="text-lg text-white font-medium mb-1">No results found</h3>
    <p className="text-gray-400 text-sm mb-4">
      {hasFilters ? "Try different keywords or filters" : `Search for ${type}`}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="px-4 py-2 rounded-full bg-[#BE6F50] text-white text-sm font-medium hover:bg-[#A85D40] transition-colors"
      >
        Clear all filters
      </button>
    )}
  </motion.div>
);

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
