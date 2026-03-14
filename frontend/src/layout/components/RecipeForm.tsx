import React, { useMemo } from "react";
import RecipeInput from "./RecipeInput";
import foodMeasurements from "./foodMeasurements";
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle, FaTag, FaTags } from "react-icons/fa";
import { TAG_CATEGORIES } from "../../constants";
import TagButton from "../../pages/ContentCreator/AddRecipe/TagButton";

const RecipeForm = ({
  recipeName,
  recipeNameError,
  handleRecipeNameChange,
  handleImageChange,
  imageError,
  imageBase64,
  description,
  descriptionError,
  handleDescriptionChange,
  ingredientFields,
  ingredientErrors,
  handleIngredientChange,
  handleAddIngredient,
  handleRemoveIngredient,
  maxIngredients,
  stepFields,
  stepErrors,
  handleStepChange,
  handleAddStep,
  handleRemoveStep,
  maxSteps,
  fileInputRefs,
  tags,
  tagsError,
  handleTagChange,
  handleTagCategoryChange,
  activeTagCategory,
  availableTags,
  removeTag,
  maxTags,
  extraImages,
  extraImagesError,
  handleExtraImageChange,
  handleAddExtraImage,
  handleRemoveExtraImage,
  maxExtraImages,
  handleSubmit,
  isSubmitting,
  isLoading,
  tagCategories,
}) => {
  const isTagLimitReached = tags.length >= maxTags;
  const isStepLimitReached = stepFields.length >= maxSteps;
  const isStepMinReached = stepFields.length == 1;
  const isIngredientLimitReached = ingredientFields.length >= maxIngredients;
  const isIngredientMinReached = ingredientFields.length == 1;
  const isExtraImageLimitReached = extraImages.length >= maxExtraImages;
  
  // Group tags by category for better organization in the UI
  const tagsByCategory = useMemo(() => {
    const grouped = {};
    tags.forEach(tag => {
      if (!grouped[tag.category]) {
        grouped[tag.category] = [];
      }
      grouped[tag.category].push(tag);
    });
    return grouped;
  }, [tags]);
  
  const formProgress = useMemo(() => {
    let completed = 0;
    const totalSteps = 6; // Name, Image, Description, Ingredients, Steps, Tags
    
    if (recipeName.trim()) completed++;
    if (imageBase64) completed++;
    if (description.trim()) completed++;
    if (ingredientFields.length > 0 && ingredientFields.every(ing => ing.name && ing.quantity && ing.measurement)) completed++;
    if (stepFields.length > 0 && stepFields.every(step => step.description)) completed++;
    if (tags.length > 0) completed++;
    
    return Math.floor((completed / totalSteps) * 100);
  }, [recipeName, imageBase64, description, ingredientFields, stepFields, tags]);
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="max-w-screen-2xl lg:max-w-screen-lg mb-20 mx-auto"
    >
      <h1 className="text-[#D9D9D9] text-3xl font-bold text-center mb-2 tracking-wide">
        Create Your Recipe
      </h1>
      
      {/* Progress indicator */}
      <div className="mb-8 w-full bg-gray-800 rounded-full h-2.5">
        <div 
          className="bg-orange-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${formProgress}%` }}
        ></div>
        <div className="text-center text-sm text-gray-400 mt-1">
          {formProgress < 100 ? `${formProgress}% Complete` : "Ready to submit!"}
        </div>
      </div>
      
      {/* Recipe Name & Image section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <RecipeInput
            label="Recipe Name"
            type="text"
            value={recipeName}
            onChange={handleRecipeNameChange}
            error={recipeNameError}
            placeholder="Enter recipe name"
          />
          
          <RecipeInput
            label="Description"
            type="textarea"
            value={description}
            onChange={handleDescriptionChange}
            error={descriptionError}
            placeholder="Enter description"
            className="mt-4"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-[#D9D9D9] text-lg mb-2">
            Recipe Image
          </label>
          
          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 
            ${imageBase64 ? 'border-green-600' : 'border-gray-600 hover:border-orange-600'}`}>
            {imageBase64 ? (
              <div className="relative group">
                <img
                  src={imageBase64}
                  alt="Recipe"
                  className="max-h-[200px] mx-auto object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                  <button
                    type="button"
                    className="bg-orange-600 text-white px-3 py-1 rounded-md"
                    onClick={() => document.getElementById('recipeImageInput').click()}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-400 mb-2">Drag and drop your image here or click to browse</p>
                <button
                  type="button"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md mt-2"
                  onClick={() => document.getElementById('recipeImageInput').click()}
                >
                  Upload Image
                </button>
              </div>
            )}
            <input
              id="recipeImageInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="hidden"
            />
          </div>
          
          {imageError && (
            <div className="text-red-500 text-sm mt-1 bg-red-100 border border-red-400 rounded-md py-1 px-3">
              {imageError}
            </div>
          )}
        </div>
      </div>
      
      {/* Ingredients Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-[#D9D9D9] text-lg font-medium">Ingredients</label>
          {!isIngredientLimitReached && (
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full p-1 transition-colors"
            >
              <IoMdAddCircle className="text-xl" />
            </button>
          )}
        </div>
        
        {ingredientFields.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2 mb-3 bg-gray-700 p-3 rounded-md transition-all">
            <div className="bg-gray-800 text-gray-300 h-6 w-6 flex items-center justify-center rounded-full mr-1">
              {index + 1}
            </div>
            <RecipeInput
              type="text"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              error={ingredientErrors[index]?.name}
              placeholder="Name"
              className="flex-1"
            />
            <RecipeInput
              type="number"
              value={ingredient.quantity}
              onChange={(e) => {
                const newValue = Math.max(0, parseInt(e.target.value) || 0);
                handleIngredientChange(index, "quantity", newValue.toString());
              }}
              error={ingredientErrors[index]?.quantity}
              placeholder="Quantity"
              className="w-[100px]"
            />
            <RecipeInput
              type="select"
              value={ingredient.measurement}
              onChange={(e) =>
                handleIngredientChange(index, "measurement", e.target.value)
              }
              options={foodMeasurements.map((measurement) => ({
                label: measurement,
                value: measurement,
              }))}
              error={ingredientErrors[index]?.measurement}
              placeholder="Measurement"
              className="w-[180px]"
            />
            {!isIngredientMinReached && (
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
              >
                <FaMinusCircle className="text-lg" />
              </button>
            )}
          </div>
        ))}
        
        {isIngredientLimitReached && (
          <p className="text-yellow-500 text-sm mt-1">
            You&apos;ve reached the maximum of {maxIngredients} ingredients.
          </p>
        )}
      </div>
      
      {/* Cooking Steps Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-[#CCCCCC] text-lg font-medium">Cooking Steps</label>
          {!isStepLimitReached && (
            <button
              type="button"
              onClick={handleAddStep}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full p-1 transition-colors"
            >
              <IoMdAddCircle className="text-xl" />
            </button>
          )}
        </div>
        
        {stepFields.map((step, index) => (
          <div key={index} className="mb-3 bg-gray-700 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <div className="bg-gray-800 text-gray-300 h-6 w-6 flex items-center justify-center rounded-full mr-2">
                {index + 1}
              </div>
              <div className="text-gray-300 font-medium">Step {index + 1}</div>
              {!isStepMinReached && (
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="ml-auto text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                >
                  <FaMinusCircle className="text-lg" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <RecipeInput
                type="textarea"
                value={step.description}
                onChange={(e) =>
                  handleStepChange(index, "description", e.target.value)
                }
                error={stepErrors[index]}
                placeholder={`Describe step ${index + 1}`}
                className="flex-grow"
              />
              
              <div className="w-full md:w-1/4">
                <div 
                  onClick={() => fileInputRefs.current[index].click()}
                  className={`cursor-pointer border-2 border-dashed rounded-md p-2 h-full flex flex-col items-center justify-center transition-all
                    ${step.stepImage ? 'border-green-600' : 'border-gray-600 hover:border-orange-600'}`}
                >
                  {step.stepImage ? (
                    <div className="relative w-full h-24">
                      <img 
                        src={step.stepImage} 
                        alt={`Step ${index + 1}`}
                        className="max-h-[200px] mx-auto object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-400 mb-2">Drag and drop your image here or click to browse</p>
                      <button
                        type="button"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md mt-2"
                        onClick={() => fileInputRefs.current[index].click()}
                      >
                        Upload Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tags Section */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-[#D9D9D9] text-lg font-medium">Tags</label>
          <div className="text-sm text-gray-400">
            <FaTags className="inline mr-1" /> {tags.length}/{maxTags}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-[#D9D9D9]">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500 mr-2"></div>
            Loading tags...
          </div>
        ) : (
          <>
            {/* Selected tags display */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.length > 0 ? (
                  tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-orange-600 text-white px-3 py-1 rounded-full flex items-center"
                    >
                      {tag.name}
                      <div
                        onClick={() => {
                          console.log("Remove tag at index", idx);
                          removeTag(idx);
                        }}
                        className="ml-2 text-white hover:text-red-200 cursor-pointer"
                      >
                        ×
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    <FaTag className="inline mr-2" /> Select tags to categorize your recipe
                  </div>
                )}
              </div>
              
              {tagsError && (
                <div className="text-red-500 text-sm mt-1 bg-red-100 bg-opacity-20 border border-red-400 rounded-md py-1 px-3">
                  {tagsError}
                </div>
              )}
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap mb-3 gap-1 border-b border-gray-700 pb-2">
              {tagCategories && tagCategories.map(category => (
                <div
                  key={category}
                  onClick={() => {
                    console.log("Change category to", category);
                    handleTagCategoryChange(category);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    activeTagCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {TAG_CATEGORIES[category]?.icon} {TAG_CATEGORIES[category]?.label}
                </div>
              ))}
            </div>
            
            {/* Tag options for selected category */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
              {availableTags[activeTagCategory]?.map(tag => {
                const isSelected = tags.some(t => t._id === tag._id);
                const isDisabled = isTagLimitReached && !isSelected;
                
                return (
                  <div
                    key={tag._id}
                    onClick={() => {
                      if (!isDisabled) {
                        console.log("Select tag:", tag.name, tag._id);
                        handleTagChange(tag._id);
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-orange-600 text-white cursor-pointer'
                        : isDisabled
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
                      }`}
                  >
                    {tag.name}
                  </div>
                );
              })}
              
              {!availableTags[activeTagCategory]?.length && (
                <div className="text-gray-400 col-span-full p-4 text-center">
                  No tags available in this category
                </div>
              )}
            </div>
            
            {isTagLimitReached && (
              <p className="text-yellow-500 text-sm mt-1">
                You&apos;ve reached the maximum of {maxTags} tags.
              </p>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default RecipeForm;