import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import AddRecipe from "../AddRecipe/AddRecipe";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link, useParams } from "react-router-dom";

const AboutContentCreator = ({
  creator,
  onAddRecipeToggle,
  showAddRecipe,
  creatorRecipes,
}) => {
  const { user } = useAuthContext();
  const { creatorid } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxCharacters = 200;

  const handleAddRecipeClick = () => {
    onAddRecipeToggle();
  };

  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };

  const renderBio = () => {
    if (creator.bio.length <= maxCharacters || isExpanded) {
      return creator.bio;
    }
    return creator.bio.slice(0, maxCharacters) + '...';
  };

  return (
    <div className="container mx-auto max-h-[450px] lg:max-h-full xl:max-h-full overflow-y-auto scrollbar-none mb-20">
      {!showAddRecipe && (
        <>
          <h1 className="text-[#D9D9D9] text-3xl mb-5">
            About {creator.name.split(" ")[0]},
          </h1>
          <div className="">
            <div className="relative mb-2"> {/* Changed mb-5 to mb-2 */}
              <p className="text-[14px] sm:text-[18px] md:text-[18px] lg:text-[18px] p-3 rounded-lg text-[#666666] bg-[#272727] whitespace-pre-line">
                {renderBio()}
              </p>
              {creator.bio.length > maxCharacters && (
                <button
                  onClick={toggleBio}
                  className="mt-1 text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="mt-3 mb-16"> {/* Changed mt-5 to mt-3 */}
              <div className="flex justify-between items-center">
                <h1 className="text-[#D9D9D9] text-xl ml-10 mt-2"> {/* Changed mt-5 to mt-2 */}
                  My Recipes
                </h1>
                {user.user._id === creatorid && (
                  <button onClick={handleAddRecipeClick}>
                    <IoMdAdd className="text-4xl text-white " />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-5 mt-5 lg:mt-3 mb-10">
                {creatorRecipes.map((recipe, index) => (
                  <div key={recipe._id} className="flex flex-col justify-center items-center text-white">
                    <Link
                      to={`/recipe/${recipe._id}`}
                      className="flex flex-col items-start mt-4"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                    </Link>
                    <p className="text-base mt-2">{recipe.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showAddRecipe && <AddRecipe onRecipeAdded={handleAddRecipeClick} />}
    </div>
  );
};

export default AboutContentCreator;