import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

const RecipeCard = ({ recipe, index = 0 }: RecipeCardProps) => {
  // Extract cooking time from tags if available
  const timeTag = recipe.tags?.find(
    (tag) => tag.tag?.includes("minutes") || tag.tag?.includes("hour")
  );
  const cookingTime = timeTag?.tag || null;

  // Get first tag for display (excluding time tags)
  const displayTag = recipe.tags?.find(
    (tag) => !tag.tag?.includes("minutes") && !tag.tag?.includes("hour")
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link to={`/recipe/${recipe._id}`} className="block h-full">
        <div className="relative overflow-hidden rounded-xl bg-[#2A2725] shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
          {/* Image Container - Fixed aspect ratio */}
          <div className="relative aspect-square overflow-hidden flex-shrink-0">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Like Button */}
            <button
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-[#BE6F50] transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <AiFillHeart className="text-white text-sm" />
            </button>

            {/* Cooking Time Badge */}
            {cookingTime && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                <FiClock className="text-[#BE6F50] text-xs" />
                <span>{cookingTime}</span>
              </div>
            )}

            {/* Tag Badge - Bottom of image */}
            {displayTag && (
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#BE6F50] text-white">
                  {displayTag.tag}
                </span>
              </div>
            )}
          </div>

          {/* Content - Fixed height */}
          <div className="p-3 flex flex-col flex-grow">
            <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-[#BE6F50] transition-colors duration-200 flex-grow">
              {recipe.title}
            </h3>

            {/* Recipe Meta - Always at bottom */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
              <span>{recipe.ingredients?.length || 0} ing.</span>
              <span className="text-white/20">•</span>
              <span>{recipe.steps?.length || 0} steps</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
