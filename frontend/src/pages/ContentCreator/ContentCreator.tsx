import { useState, useEffect } from "react";
import About from "./AboutContentCreator/AboutContentCreator";
import SearchCC from "./SearchCC/SearchCC";
import Statistics from "./Statistics/Statistics";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRecipeContext } from "../../context/RecipeContext";
import { userApi } from "../../api";
import "./ContentCreator.css";

const ContentCreator = () => {
  const [activeFilter, setActiveFilter] = useState("About");
  const { user, users } = useAuthContext();
  const { dispatch } = useAuthContext();
  const { recipes } = useRecipeContext();
  const { creatorid } = useParams();
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isInChefsList, setIsInChefsList] = useState(false);
  const creatorRecipes = recipes.filter(
    (recipe) => recipe.userId === creatorid
  );

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const filterMenuHeight =
        document.getElementById("filter-menu")?.offsetHeight || 0;
      const newContainerHeight = windowHeight - filterMenuHeight;
      setContainerHeight(newContainerHeight);
    };
    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  useEffect(() => {
    const fetchCreator = () => {
      const creatorData = users.find((User) => User._id === creatorid);
      console.log("creatorData", creatorData);
      console.log("users", users);
      setCreator(creatorData);
    };
    fetchCreator();
  }, [creatorid, users]);

  useEffect(() => {
    if (creator) {
      const chefsList = user.user.chefs;
      const tf = chefsList.some((chef) => chef.ccId === creator._id);
      setIsInChefsList(tf);
    }
  }, [creator, user.user.chefs]);

  // Reset activeFilter and showAddRecipe when creatorid changes
  useEffect(() => {
    setActiveFilter("About");
    setShowAddRecipe(false);
  }, [creatorid]);

  const handleAddRecipeToggle = () => {
    setShowAddRecipe(!showAddRecipe);
  };

  const handleHeartToggle = async () => {
    if (loading || !user || !creator) return;
    setIsInChefsList(!isInChefsList);
    setLoading(true);

    try {
      let updatedUser;
      if (!isInChefsList) {
        updatedUser = await userApi.addToChefsList(user.user._id, creator._id, user.user);
      } else {
        updatedUser = await userApi.removeFromChefsList(user.user._id, creator._id, user.user);
      }

      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating chef's list:", error);
      setIsInChefsList(!isInChefsList);
    } finally {
      setLoading(false);
    }
  };

  const handleBgImageChange = (image) => {
    setSelectedBgImage(image);
  };

  const renderComponent = () => {
    switch (activeFilter) {
      case "About":
        return (
          <About
            creator={creator}
            onAddRecipeToggle={handleAddRecipeToggle}
            showAddRecipe={showAddRecipe}
            creatorRecipes={creatorRecipes}
          />
        );
      case "Search":
        return <SearchCC creatorRecipes={creatorRecipes} />;
      case "Statistics":
        return <Statistics />;
      default:
        return null;
    }
  };

  if (!creator) {
    return (
      <div className="loading-spinner-container">
        <div className="app-name">Epicure</div>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg bg-[#1E1C1A] overflow-hidden pb-10">
      <div
        style={{ backgroundImage: `url(${"/assets/background6.jpg"})` }}
        className="relative creator-header h-[100px]"
      >
        <img
          src={creator.profilePicture}
          alt={creator.name}
          className="creator-profile-picture"
        />
        <div className="creator-header-content">
          <h1 className="text-2xl lg:text-4xl text-white">{creator.name}</h1>
          <div className="buttons-container">
            <button
              className={`px-3 lg:px-5 py-2 rounded-full ${activeFilter === "About" ? "bg-[#BE6F50]" : "bg-[#272727]"
                }`}
              onClick={() => {
                setActiveFilter("About");
                setShowAddRecipe(false);
              }}
            >
              About
            </button>
            <button
              className={`px-3 lg:px-5 py-2 rounded-full ${activeFilter === "Search" ? "bg-[#BE6F50]" : "bg-[#272727]"
                }`}
              onClick={() => setActiveFilter("Search")}
            >
              Search
            </button>
          </div>
        </div>
        {creator._id !== user.user._id && (
          <button
            onClick={handleHeartToggle}
            className="absolute text-3xl flex gap-5 right-5 top-5 lg:right-[5%] lg:bottom-[10%] text-white bg-transparent border-none outline-none"
          >
            {isInChefsList ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
        )}
      </div>

      <div className="separator"></div>
      <div className="scrollable-content">{renderComponent()}</div>
    </div>
  );
};

export default ContentCreator;
