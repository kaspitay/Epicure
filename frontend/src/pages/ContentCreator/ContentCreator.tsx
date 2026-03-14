import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiGrid, FiSearch, FiPlus, FiBookOpen } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRecipeContext } from "../../context/RecipeContext";
import { userApi } from "../../api";
import RecipeCard from "../../components/RecipeCard";
import SearchBar from "../Search/components/SearchBar";
import AddRecipe from "./AddRecipe/AddRecipe";
import { User, Recipe } from "../../types";

type TabType = "recipes" | "search";

const ContentCreator = () => {
  const { creatorid } = useParams();
  const { user, users, dispatch } = useAuthContext();
  const { recipes } = useRecipeContext();

  const [creator, setCreator] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("recipes");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bioExpanded, setBioExpanded] = useState(false);

  const creatorRecipes = recipes.filter((recipe) => recipe.userId === creatorid);
  const isOwnProfile = user?.user?._id === creatorid;

  // Fetch creator data
  useEffect(() => {
    const creatorData = users.find((u) => u._id === creatorid);
    setCreator(creatorData || null);
  }, [creatorid, users]);

  // Check if following
  useEffect(() => {
    if (creator && user?.user?.chefs) {
      const isInChefsList = user.user.chefs.some((chef) => chef.ccId === creator._id);
      setIsFollowing(isInChefsList);
    }
  }, [creator, user?.user?.chefs]);

  // Reset state when creator changes
  useEffect(() => {
    setActiveTab("recipes");
    setShowAddRecipe(false);
    setSearchQuery("");
  }, [creatorid]);

  const handleFollowToggle = async () => {
    if (loading || !user || !creator) return;
    setIsFollowing(!isFollowing);
    setLoading(true);

    try {
      const updatedUser = isFollowing
        ? await userApi.removeFromChefsList(user.user._id, creator._id, user.user)
        : await userApi.addToChefsList(user.user._id, creator._id, user.user);

      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating follow status:", error);
      setIsFollowing(!isFollowing);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = searchQuery
    ? creatorRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : creatorRecipes;

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#BE6F50] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full rounded-xl bg-[#1E1C1A] overflow-hidden flex flex-col"
    >
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 md:h-44 bg-gradient-to-br from-[#BE6F50] via-[#9A5840] to-[#7A4530] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 md:px-10 pb-6">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 md:-top-20"
          >
            <div className="relative">
              <img
                src={creator.profilePicture || "/default-avatar.png"}
                alt={creator.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#1E1C1A] shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#BE6F50] rounded-full flex items-center justify-center border-2 border-[#1E1C1A]">
                <LuChefHat className="text-white text-sm" />
              </div>
            </div>
          </motion.div>

          {/* Name and Follow Button */}
          <div className="pt-16 md:pt-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white">{creator.name}</h1>
              <p className="text-gray-400 text-sm mt-1">Content Creator</p>
            </motion.div>

            {!isOwnProfile && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFollowToggle}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  isFollowing
                    ? "bg-[#BE6F50]/20 text-[#BE6F50] border border-[#BE6F50]"
                    : "bg-[#BE6F50] text-white hover:bg-[#A85D40]"
                }`}
              >
                <FiHeart className={isFollowing ? "fill-current" : ""} />
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </motion.button>
            )}

            {isOwnProfile && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddRecipe(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#BE6F50] text-white font-medium hover:bg-[#A85D40] transition-colors"
              >
                <FiPlus />
                <span>Add Recipe</span>
              </motion.button>
            )}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-6 mt-4"
          >
            <div className="flex items-center gap-2">
              <FiBookOpen className="text-[#BE6F50]" />
              <span className="text-white font-semibold">{creatorRecipes.length}</span>
              <span className="text-gray-400 text-sm">recipes</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <FiHeart className="text-[#BE6F50]" />
              <span className="text-white font-semibold">{creator.likes || 0}</span>
              <span className="text-gray-400 text-sm">likes</span>
            </div>
          </motion.div>

          {/* Bio */}
          {creator.bio && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <p className={`text-gray-300 text-sm leading-relaxed ${!bioExpanded ? "line-clamp-2" : ""}`}>
                {creator.bio}
              </p>
              {creator.bio.length > 150 && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="text-[#BE6F50] text-sm mt-1 hover:underline"
                >
                  {bioExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 md:px-10 border-b border-white/10">
        <div className="flex gap-1">
          <button
            onClick={() => {
              setActiveTab("recipes");
              setShowAddRecipe(false);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "recipes" && !showAddRecipe
                ? "border-[#BE6F50] text-[#BE6F50]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FiGrid />
            <span>Recipes</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("search");
              setShowAddRecipe(false);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "search"
                ? "border-[#BE6F50] text-[#BE6F50]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FiSearch />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {showAddRecipe ? (
            <motion.div
              key="add-recipe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Recipe</h2>
                <button
                  onClick={() => setShowAddRecipe(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
              <AddRecipe onRecipeAdded={() => setShowAddRecipe(false)} />
            </motion.div>
          ) : activeTab === "search" ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-xl mb-6">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery("")}
                  placeholder={`Search ${creator.name.split(" ")[0]}'s recipes...`}
                />
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <FiSearch className="text-4xl text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recipes found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {creatorRecipes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#272727] flex items-center justify-center">
                    <FiBookOpen className="text-3xl text-gray-500" />
                  </div>
                  <h3 className="text-xl text-white font-medium mb-2">No recipes yet</h3>
                  <p className="text-gray-400 mb-6">
                    {isOwnProfile
                      ? "Start sharing your culinary creations!"
                      : `${creator.name.split(" ")[0]} hasn't posted any recipes yet`}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowAddRecipe(true)}
                      className="px-6 py-2.5 rounded-full bg-[#BE6F50] text-white font-medium hover:bg-[#A85D40] transition-colors"
                    >
                      Add your first recipe
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {creatorRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContentCreator;
