import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import pastaImg from "../../assets/images/top-10(img-2).png";
import { FiDownload, FiPlus } from "react-icons/fi";
import { AiFillLike } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import About from "./About/About";
import Ingredients from "./Ingredients/Ingredients";
import Steps from "./Steps/Steps";
import Premium from "./Premium/Premium";
import "./SingleRecipePage.css";
import { useRecipeContext } from "../../context/RecipeContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { userApi } from "../../api";
import { Recipe } from "../../types";

const SingleRecipePage = () => {
  const { recipeid } = useParams();
  const { recipes } = useRecipeContext();
  const [recipe, setRecipe] = useState(
    recipes.find((recipe) => recipe._id === recipeid) || []
  );
  const [activeFilter, setActiveFilter] = useState("About");
  const [scrollbarVisible, setScrollbarVisible] = useState(true);
  const { user, users } = useAuthContext();
  const creator = users.find((User) => User._id === recipe.userId);
  const { dispatch } = useAuthContext();
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCookbook, setSelectedCookbook] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      setContainerHeight(windowHeight);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    // Listen for scroll event to hide scrollbar
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateContainerHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // set is liked if the recipe is in the user's favorites
    if (user.user.favorites.includes(recipeid)) {
      setLiked(true);
    }
  }, [recipeid]);

  const handleScroll = () => {
    // If user scrolls down, hide the scrollbar
    if (window.scrollY > 0) {
      setScrollbarVisible(false);
    } else {
      // If user scrolls to the top, show the scrollbar
      setScrollbarVisible(true);
    }
  };

  const renderComponent = () => {
    switch (activeFilter) {
      case "About":
        return (
          <About
            recipeDescription={recipe.description}
            photos={recipe.photos}
          />
        );
      case "Ingredients":
        return <Ingredients recipeIngredients={recipe.ingredients} />;
      case "Steps":
        return <Steps recipeSteps={recipe.steps} />;
      case "Premium":
        return <Premium />;
      default:
        return "";
    }
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectCookbook = (cookbook) => {
    setSelectedCookbook(cookbook);
    toggleDropdown(); // Close dropdown after selecting
    // if recipe is not in cookbook, save it
    if (
      !user.user.books
        .find((book) => book.name === cookbook)
        .recipes.includes(recipeid)
    ) {
      handleSave(cookbook);
    } else {
      handleDelete(cookbook);
    }
  };
  const handleSave = async (cookbook: string) => {
    if (!user || !recipe) return;
    try {
      const updatedUser = await userApi.saveRecipe({
        recipe: recipe as Recipe,
        cookbook,
        user: user.user,
      });
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      if (cookbook === 'favorites') {
        setLiked(!liked);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };
  const handleClick = (cookbook) => {
    if (liked) {
      handleDelete(cookbook);
    } else {
      handleSave(cookbook);
    }
  };

  const handleDelete = async (cookbook: string) => {
    if (!user || !recipe) return;
    setLiked(false);

    try {
      const updatedUser = await userApi.deleteRecipe(recipe as Recipe, cookbook, user.user);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleTagClick = (tag) => {
    const tagValue = typeof tag === 'object' ? tag.tag : tag;
    navigate(`/search?q=&tag=${encodeURIComponent(tagValue)}`);
  };

  return (
    <div className="h-full rounded-lg bg-[#1E1C1A] overflow-hidden flex flex-col">
      {/* Header Part */}
      <div>
        <div className="relative flex justify-between items-center h-[200px] px-5 bg-gradient-to-b from-[#768895]">
          <div className="absolute bottom-5 left-10 flex items-center">
            <img
              src={recipe.image}
              alt=""
              className="w-40 h-40 lg:w-40 lg:h-40 rounded-lg"
            />
            <div className="flex flex-col justify-center ml-4">
              <h1 className="text-2xl lg:text-4xl text-white">
                {recipe.title}
              </h1>
              {recipe.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1 text-xs font-medium bg-[#BE6F50]/90 text-white rounded-full backdrop-blur-sm shadow-md hover:bg-[#BE6F50] transition-colors duration-200 cursor-pointer"
                    >
                      {typeof tag === 'object' ? tag.tag : tag}
                    </button>
                  ))}
                </div>
              )}
              <Link
                to={`/creator/${recipe.userId}`}
                className="text-lg lg:text-xl text-[#8F8F8F] mt-2"
              >
                <p>{creator.name}</p>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-5 right-10 flex gap-5 text-white">
            <div className="relative">
              <FiPlus
                className="text-3xl cursor-pointer"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="absolute top-full right-0 bg-black border border-gray-200 rounded-lg mt-1 py-2 px-3 dropdown-menu">
                  <ul>
                    {user.user.books.map((cookbook, index) => (
                      <li
                        key={index}
                        onClick={() => selectCookbook(cookbook.name)}
                        className={`cursor-pointer px-4 py-2 ${cookbook.recipes.includes(recipeid)
                            ? "text-blue-500"
                            : "text-white"
                          } hover:bg-gray-700`}
                      >
                        {cookbook.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <AiFillLike
              className={`text-3xl cursor-pointer ${liked ? "text-blue-500" : "text-white"
                }`}
              onClick={() => handleClick("favorites")}
            />
          </div>
        </div>
      </div>

      <div
        className={`overflow-y-auto flex-grow mt-5 ${scrollbarVisible ? "scrollbar-visible" : "scrollbar-invisible"
          }`}
      >
        {/* Filter menu */}
        <div className="flex flex-col items-center">
          <div className="overflow-x-auto max-w-[80%] scrollbar-none lg:block ">
            <div className="flex text-white gap-10 px-3 lg:px-0">
              <button
                className={`px-3 lg:px-5 py-2 rounded-full ${activeFilter === "About" ? "bg-[#BE6F50]" : "bg-[#272727]"
                  }`}
                onClick={() => setActiveFilter("About")}
              >
                About
              </button>
              <button
                className={`px-3 lg:px-5 py-2 rounded-full ${activeFilter === "Ingredients"
                    ? "bg-[#BE6F50]"
                    : "bg-[#272727]"
                  }`}
                onClick={() => setActiveFilter("Ingredients")}
              >
                Ingredients
              </button>
              <button
                className={`px-3 lg:px-5 py-2 rounded-full ${activeFilter === "Steps" ? "bg-[#BE6F50]" : "bg-[#272727]"
                  }`}
                onClick={() => setActiveFilter("Steps")}
              >
                Steps
              </button>
            </div>
          </div>
          <div className="w-10/12 mx-auto my-5 border-b border-[#8F8F8F]"></div>
        </div>

        {/* Render selected component */}
        <div className="p-5 mx-3 lg:mx-10">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default SingleRecipePage;
