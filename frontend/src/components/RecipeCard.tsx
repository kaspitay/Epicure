import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiUsers } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

const RecipeCard = ({ recipe, index = 0 }: RecipeCardProps) => {
  // Extract cooking time from tags if available
  const timeTag = recipe.tags?.find(tag =>
    tag.tag?.includes('minutes') || tag.tag?.includes('hour')
  );
  const cookingTime = timeTag?.tag || null;

  // Get first 2 tags for display
  const displayTags = recipe.tags?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/recipe/${recipe._id}`} className="block">
        <div className="relative overflow-hidden rounded-xl bg-[#2A2725] shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Like Button */}
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-[#BE6F50] transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                // Handle like
              }}
            >
              <AiFillHeart className="text-white text-lg" />
            </button>

            {/* Tags on Image */}
            {displayTags.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                {displayTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#BE6F50]/90 text-white backdrop-blur-sm"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            )}

            {/* Cooking Time Badge */}
            {cookingTime && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                <FiClock className="text-[#BE6F50]" />
                <span>{cookingTime}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-[#BE6F50] transition-colors duration-200">
              {recipe.title}
            </h3>

            {/* Recipe Meta */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <FiUsers className="text-[#BE6F50]" />
                <span>{recipe.ingredients?.length || 0} ingredients</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <span>{recipe.steps?.length || 0} steps</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
