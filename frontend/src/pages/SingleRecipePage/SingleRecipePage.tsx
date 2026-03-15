import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiUsers, FiBookmark, FiHeart, FiChevronDown } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import About from "./About/About";
import Ingredients from "./Ingredients/Ingredients";
import Steps from "./Steps/Steps";
import StarRating from "../../components/StarRating";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { userApi, recipeApi } from "../../api";
import { Recipe } from "../../types";

const tabs = ["About", "Ingredients", "Steps"] as const;
type TabType = typeof tabs[number];

const SingleRecipePage = () => {
  const { recipeid } = useParams();
  const { recipes } = useRecipeContext();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(
    recipes.find((recipe) => recipe._id === recipeid) || null
  );
  const [activeTab, setActiveTab] = useState<TabType>("About");
  const { user, users, dispatch } = useAuthContext();
  const creator = users.find((u) => u._id === recipe?.userId);
  const [liked, setLiked] = useState(false);
  const [showCookbookMenu, setShowCookbookMenu] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(recipe?.averageRating || 0);
  const [totalRatings, setTotalRatings] = useState<number>(recipe?.totalRatings || 0);

  useEffect(() => {
    if (user?.user?.favorites?.includes(recipeid)) {
      setLiked(true);
    }
  }, [recipeid, user]);

  // Fetch user's rating for this recipe
  useEffect(() => {
    const fetchRating = async () => {
      if (!recipeid || !user?.user?._id) return;
      try {
        const data = await recipeApi.getUserRating(recipeid, user.user._id);
        setUserRating(data.userRating);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };
    fetchRating();
  }, [recipeid, user?.user?._id]);

  const handleRate = async (rating: number) => {
    if (!recipeid || !user?.user?._id) return;
    try {
      const data = await recipeApi.rateRecipe(recipeid, user.user._id, rating);
      setUserRating(rating);
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
    } catch (error) {
      console.error("Error rating recipe:", error);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => setShowCookbookMenu(false);
    if (showCookbookMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showCookbookMenu]);

  const handleSave = async (cookbook: string) => {
    if (!user || !recipe) return;
    try {
      const updatedUser = await userApi.saveRecipe({
        recipe: recipe as Recipe,
        cookbook,
        user: user.user,
      });
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      if (cookbook === "favorites") {
        setLiked(true);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleDelete = async (cookbook: string) => {
    if (!user || !recipe) return;
    try {
      const updatedUser = await userApi.deleteRecipe(
        recipe as Recipe,
        cookbook,
        user.user
      );
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      if (cookbook === "favorites") {
        setLiked(false);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleLikeClick = () => {
    if (liked) {
      handleDelete("favorites");
    } else {
      handleSave("favorites");
    }
  };

  const selectCookbook = (cookbook: string) => {
    const book = user?.user?.books?.find((b) => b.name === cookbook);
    if (book?.recipes?.includes(recipeid || "")) {
      handleDelete(cookbook);
    } else {
      handleSave(cookbook);
    }
    setShowCookbookMenu(false);
  };

  const handleTagClick = (tag: { tag: string } | string) => {
    const tagValue = typeof tag === "object" ? tag.tag : tag;
    navigate(`/search?q=&tag=${encodeURIComponent(tagValue)}`);
  };

  const renderTabContent = () => {
    if (!recipe) return null;

    switch (activeTab) {
      case "About":
        return (
          <About
            recipeDescription={recipe.description}
            photos={recipe.photos || []}
          />
        );
      case "Ingredients":
        return <Ingredients recipeIngredients={recipe.ingredients || []} />;
      case "Steps":
        return <Steps recipeSteps={recipe.steps || []} />;
      default:
        return null;
    }
  };

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Recipe not found</p>
      </div>
    );
  }

  // Extract cooking time from tags
  const timeTag = recipe.tags?.find(
    (tag) => tag.tag?.includes("minutes") || tag.tag?.includes("hour")
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full rounded-xl bg-[#1E1C1A] overflow-hidden flex flex-col"
    >
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[350px] overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#1E1C1A]" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end pb-6 px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
            {/* Recipe Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover shadow-2xl ring-4 ring-white/10"
              />
              {timeTag && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#BE6F50] text-white text-xs font-medium shadow-lg">
                  <FiClock className="text-sm" />
                  <span>{timeTag.tag}</span>
                </div>
              )}
            </motion.div>

            {/* Recipe Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                {recipe.title}
              </h1>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {recipe.tags.slice(0, 5).map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-[#BE6F50]/80 text-white rounded-full backdrop-blur-sm transition-colors duration-200"
                    >
                      {typeof tag === "object" ? tag.tag : tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Creator */}
              {creator && (
                <Link
                  to={`/creator/${recipe.userId}`}
                  className="inline-flex items-center gap-2 group"
                >
                  {creator.profilePicture && (
                    <img
                      src={creator.profilePicture}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-[#BE6F50] transition-all"
                    />
                  )}
                  <span className="text-gray-300 group-hover:text-[#BE6F50] transition-colors">
                    by {creator.name}
                  </span>
                </Link>
              )}

              {/* Rating */}
              <div className="mt-3">
                <StarRating
                  rating={averageRating}
                  totalRatings={totalRatings}
                  size="md"
                  interactive={!!user}
                  onRate={handleRate}
                  userRating={userRating}
                />
                {!user && (
                  <p className="text-gray-500 text-xs mt-1">
                    <Link to="/login" className="text-[#BE6F50] hover:underline">
                      Log in
                    </Link>{" "}
                    to rate this recipe
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                className={`p-3 rounded-full transition-all duration-200 ${
                  liked
                    ? "bg-red-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {liked ? (
                  <AiFillHeart className="text-xl" />
                ) : (
                  <FiHeart className="text-xl" />
                )}
              </button>

              {/* Save to Cookbook */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCookbookMenu(!showCookbookMenu);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#BE6F50] hover:bg-[#A85D40] text-white transition-colors duration-200"
                >
                  <FiBookmark className="text-lg" />
                  <span className="hidden md:inline text-sm font-medium">Save</span>
                  <FiChevronDown className={`text-sm transition-transform ${showCookbookMenu ? "rotate-180" : ""}`} />
                </button>

                {/* Cookbook Dropdown */}
                <AnimatePresence>
                  {showCookbookMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-[#2A2725] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wide">
                          Your Cookbooks
                        </p>
                        {user?.user?.books?.map((cookbook, index) => {
                          const isInCookbook = cookbook.recipes?.includes(recipeid || "");
                          return (
                            <button
                              key={index}
                              onClick={() => selectCookbook(cookbook.name)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                isInCookbook
                                  ? "bg-[#BE6F50]/20 text-[#BE6F50]"
                                  : "text-white hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate">{cookbook.name}</span>
                              {isInCookbook && (
                                <span className="text-xs bg-[#BE6F50] px-2 py-0.5 rounded-full">
                                  Saved
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recipe Stats */}
      <div className="flex items-center justify-center gap-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-gray-400">
          <FiUsers className="text-[#BE6F50]" />
          <span>{recipe.ingredients?.length || 0} ingredients</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 text-gray-400">
          <span>{recipe.steps?.length || 0} steps</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center pt-4">
        <div className="flex bg-[#272727] rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#BE6F50] rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SingleRecipePage;
