import SearchResultsList from "../../components/SearchResultsList";
import { useRecipeContext } from "../../context/RecipeContext";
import { motion } from "framer-motion";

const Home = () => {
  const { recipes, loading } = useRecipeContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#BE6F50] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading recipes...</p>
        </div>
      </div>
    );
  }

  // Filter recipes by tags
  const filterByTag = (tagName: string) =>
    recipes.filter((recipe) =>
      recipe.tags?.some((tag) => tag.tag === tagName)
    ).slice(0, 10);

  const dessertRecipes = filterByTag("Dessert");
  const italianRecipes = filterByTag("Italian");
  const asianRecipes = recipes.filter((recipe) =>
    recipe.tags?.some((tag) => ["Thai", "Japanese", "Chinese"].includes(tag.tag))
  ).slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {/* Featured/Top Recipes */}
      <SearchResultsList
        title="Popular Recipes"
        results={recipes.slice(0, 10)}
      />

      {/* Italian Cuisine */}
      {italianRecipes.length > 0 && (
        <SearchResultsList
          title="Italian Cuisine"
          results={italianRecipes}
        />
      )}

      {/* Asian Flavors */}
      {asianRecipes.length > 0 && (
        <SearchResultsList
          title="Asian Flavors"
          results={asianRecipes}
        />
      )}

      {/* Desserts */}
      {dessertRecipes.length > 0 && (
        <SearchResultsList
          title="Sweet Treats"
          results={dessertRecipes}
        />
      )}

      {/* All Recipes Grid */}
      <SearchResultsList
        title="All Recipes"
        results={recipes}
        useGrid={true}
      />
    </motion.div>
  );
};

export default Home;
