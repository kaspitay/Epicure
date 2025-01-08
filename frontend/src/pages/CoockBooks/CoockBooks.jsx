import top10Img1 from "../../assets/images/top-10(img-1).png";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import CookBooks from "../../layout/components/CookBooks";
import SearchResultsList from "../../components/SearchResultsList";
import { useRecipeContext } from "../../context/RecipeContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CoockBooks = () => {
  const { user } = useAuthContext();
  const { recipes } = useRecipeContext();
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const { id, title } = useParams();

  useEffect(() => {
    // extract the cookBook from the user
    let cookBook = [];
    if (title !== "favorites") {
      cookBook = user.user.books.find((book) => book._id === id);
      setFilteredRecipes(
        recipes.filter((recipe) => cookBook.recipes.includes(recipe._id))
      );
    } else {
      cookBook = user.user.favorites;

      setFilteredRecipes(
        recipes.filter((recipe) => cookBook.includes(recipe._id))
      );
    }
  }, [id, title]);

  return (
    <div className="w-full h-full rounded-lg bg-[#1E1C1A] grid md:grid-rows-12 lg:grid-rows-10">
      <div className="row-span-2">
        <PageHeader HeaderName={title} />
      </div>

      {/* Scrollable section */}
      <div className="row-span-9 overflow-y-auto scrollbar-none">
        <div
          className=" grid grid-rows-2  bg-[#1E1C1A]
            text-white text-lg px-10 rounded-lg md:gap-5 lg:gap-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-4 mt-5 lg:mt-3 mb-10">
            {/* Recipe Cards */}
            {filteredRecipes.map((recipe, index) => (
              <div className="flex flex-col justify-center items-center text-white">
                <Link
                  key={recipe._id}
                  to={`/recipe/${recipe._id}`}
                  className="flex flex-col items-start mt-4"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-40 h-40 object-cover rounded-lg" // Square with rounded corners
                  />
                </Link>
                <p className="text-base mt-2">{recipe.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoockBooks;
