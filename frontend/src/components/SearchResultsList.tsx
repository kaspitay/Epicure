import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import RecipeCard from "./RecipeCard";
import { Recipe, User } from "../types";
import { motion } from "framer-motion";

interface SearchResultsListProps {
  results: (Recipe | User)[];
  title?: string;
  searchFilter?: string;
  arrow?: boolean;
  useGrid?: boolean;
}

const SearchResultsList = ({
  results,
  title,
  searchFilter,
  arrow = true,
  useGrid = false,
}: SearchResultsListProps) => {
  const isCreator = searchFilter === "creators";

  // Creator card component
  const CreatorCard = ({ creator, index }: { creator: User; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/creator/${creator._id}`} className="block">
        <div className="flex flex-col items-center p-4 rounded-xl bg-[#2A2725] hover:bg-[#332F2C] transition-all duration-300">
          <div className="relative w-24 h-24 mb-3">
            <img
              src={creator.profilePicture}
              alt={creator.name}
              className="w-full h-full object-cover rounded-full ring-2 ring-[#BE6F50]/30 group-hover:ring-[#BE6F50] transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#BE6F50] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{creator.recipes?.length || 0}</span>
            </div>
          </div>
          <h3 className="text-white font-semibold text-sm group-hover:text-[#BE6F50] transition-colors">
            {creator.name}
          </h3>
          <p className="text-gray-400 text-xs mt-1">{creator.likes || 0} likes</p>
        </div>
      </Link>
    </motion.div>
  );

  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="mb-8">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-6 bg-[#BE6F50] rounded-full" />
            {title}
          </h2>
        )}
        <p className="text-gray-400">No {searchFilter || 'results'} found</p>
      </div>
    );
  }

  // Grid layout
  if (useGrid) {
    return (
      <div className="mb-8">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-[#BE6F50] rounded-full" />
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item, index) =>
            isCreator ? (
              <CreatorCard key={item._id} creator={item as User} index={index} />
            ) : (
              <RecipeCard key={item._id} recipe={item as Recipe} index={index} />
            )
          )}
        </div>
      </div>
    );
  }

  // Carousel layout
  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1 h-6 bg-[#BE6F50] rounded-full" />
          {title}
        </h2>
      )}
      <Splide
        options={{
          perPage: 4,
          gap: "1rem",
          pagination: false,
          arrows: arrow,
          breakpoints: {
            1280: { perPage: 4 },
            1024: { perPage: 3 },
            768: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
      >
        {results.map((item, index) => (
          <SplideSlide key={item._id}>
            {isCreator ? (
              <CreatorCard creator={item as User} index={index} />
            ) : (
              <RecipeCard recipe={item as Recipe} index={index} />
            )}
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default SearchResultsList;
