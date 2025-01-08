import React from "react";
import RecipeInput from "./RecipeInput";
import foodMeasurements from "./foodMeasurements";
import foodTags from "./foodTags";
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";

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
}) => {
  const isTagLimitReached = tags.length >= maxTags;
  const isStepLimitReached = stepFields.length >= maxSteps;
  const isStepMinReached = stepFields.length == 1;
  const isIngredientLimitReached = ingredientFields.length >= maxIngredients;
  const isIngredientMinReached = ingredientFields.length == 1;
  const isExtraImageLimitReached = extraImages.length >= maxExtraImages;
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-screen-2xl lg:max-w-screen-lg mb-20 mx-auto"
    >
      <RecipeInput
        label="Recipe Name"
        type="text"
        value={recipeName}
        onChange={handleRecipeNameChange}
        error={recipeNameError}
        placeholder="Enter recipe name"
      />
      <div className="mb-4">
        <label className="block text-[#D9D9D9] text-lg mb-2">
          Recipe Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
          className="w-full border rounded-md py-2 px-4 bg-transparent text-[#D9D9D9] focus:outline-none focus:border-blue-500 ${imageError ? 'border-red-500' : 'border-gray-300'}"
          required
        />
        {imageError && (
          <span className="block text-red-500 text-sm mt-1 bg-red-100 border border-red-400 rounded-md py-1 px-3">
            {imageError}
          </span>
        )}
        {imageBase64 && (

          <div className="mt-2">
            <img
              src={imageBase64}
              alt="Recipe"
              className="max-w-[200px] max-h-[200px] object-cover rounded-md"
            />
          </div>
        )}
      </div>
      <RecipeInput
        label="Description"
        type="textarea"
        value={description}
        onChange={handleDescriptionChange}
        error={descriptionError}
        placeholder="Enter description"
      />
      <div className="mb-4">
        <label className="block text-[#D9D9D9] text-lg mb-2">Ingredients</label>
        {ingredientFields.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
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
              className="flex-1"
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
              className="flex-1"
            />
            {!isIngredientMinReached && <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="text-red-500 hover:text-red-700 focus:outline-none mb-3"
            >
              <FaMinusCircle className="text-gray-500" />
            </button>}
          </div>
        ))}
        {isIngredientLimitReached ? (
          <p className="text-yellow-500 text-sm mt-1">
            You've reached the maximum of {maxIngredients} Ingredients.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleAddIngredient}
            className="text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
          >
            <IoMdAddCircle className="text-gray-400" />
          </button>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-[#CCCCCC] text-lg mb-2">Steps</label>
        {stepFields.map((step, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-stretch gap-3">
              <RecipeInput
                type="textarea"
                value={step.description}
                onChange={(e) =>
                  handleStepChange(index, "description", e.target.value)
                }
                error={stepErrors[index]}
                placeholder={`Step ${index + 1} description`}
                className="flex-grow h-full"
              />
              <button
                type="button"
                className="border rounded-md h-full py-5 px-4 bg-transparent text-[#CCCCCC] hover:border-blue-500 focus:outline-none"
                onClick={(e) => {
                  fileInputRefs.current[index].click()
                }}
              >
                {step.imageName || "Upload Image"}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={(el) => fileInputRefs.current[index] = el}
                onChange={(e) => {
                  handleStepChange(index, "image", e.target.files[0])
                }}
                key={`file-input-${index}-${Date.now()}`}
                className="hidden"
              />
              {!isStepMinReached && <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none mb-3"
              >
                <FaMinusCircle className="text-gray-500" />
              </button>}
            </div>
            {/* {step.image && <img src={URL.createObjectURL(step.image)} alt={`Step ${index + 1}`} className="mt-2 max-w-full h-auto" />} */}
          </div>
        ))}
        {isStepLimitReached ? (
          <p className="text-yellow-500 text-sm mt-1">
            You've reached the maximum of {maxSteps} Steps.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleAddStep}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <IoMdAddCircle className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-[#D9D9D9] text-lg mb-2">Tags</label>
        <RecipeInput
          type="select"
          value=""
          onChange={handleTagChange}
          options={foodTags.map((tag) => ({ label: tag, value: tag }))}
          error={tagsError}
          placeholder={isTagLimitReached ? "Max tags reached" : "Select a tag"}
          disabled={isTagLimitReached}
        />
        {isTagLimitReached && (
          <p className="text-yellow-500 text-sm mt-1">
            You've reached the maximum of {maxTags} tags.
          </p>
        )}
        <div className="flex flex-wrap mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
            >
              {tag.tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <FaMinusCircle size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[#D9D9D9] text-lg mb-2">
          Extra Images
        </label>
        {extraImages.map((extraImage, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(index, e.target.files[0])}
              className="w-full border rounded-md py-2 px-4 bg-transparent text-[#D9D9D9] focus:outline-none focus:border-blue-500"
              required
            />
            {extraImage.image && (
              <div className="relative w-32 h-10">
                <img
                  src={extraImage.image}
                  alt="Uploaded"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}
            <button type="button" onClick={() => handleRemoveExtraImage(index)}>
              <FaMinusCircle className="text-gray-500" />
            </button>
          </div>
        ))}
        {isExtraImageLimitReached ? (
          <p className="text-yellow-500 text-sm mt-1">
            You've reached the maximum of {maxExtraImages} extra images.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleAddExtraImage}
            className="text-blue-500 hover:text-blue-700 focus:outline-none mt-2"
          >
            <IoMdAddCircle className="text-gray-400" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="bg-[#D9D9D9] text-black py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
      >
        {isSubmitting ? "Submitting..." : "Add Recipe"}
      </button>
    </form>
  );
};

export default RecipeForm;
