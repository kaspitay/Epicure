import { useState, useRef } from "react";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useRecipeContext } from "../../../context/RecipeContext";
import BASE_URL from "./../../../config"; // Adjust the path as needed
import RecipeForm from "../../../layout/components/RecipeForm";

const AddRecipe = ({ onRecipeAdded }) => {
  const { user } = useAuthContext();
  const { setRecipes } = useRecipeContext();

  const [recipeName, setRecipeName] = useState("");
  const [recipeNameError, setRecipeNameError] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [ingredientFields, setIngredientFields] = useState([
    { id: 1, name: "", quantity: "", measurement: "" },
  ]);
  const [ingredientErrors, setIngredientErrors] = useState([
    { id: 1, name: "", quantity: "", measurement: "" },
  ]);

  const [stepFields, setStepFields] = useState([
    { id: 1, description: "", stepImage: null, imageName: "Upload image" },
  ]);
  const [stepErrors, setStepErrors] = useState([]);

  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState("");

  const [extraImages, setExtraImages] = useState([]);
  const [extraImagesError, setExtraImagesError] = useState("");

  const [imageBase64, setImageBase64] = useState("");
  const [imageError, setImageError] = useState("");

  const fileInputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_RECIPE_NAME_LENGTH = 30;
  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_INGREDIENTS = 20;
  const MAX_INGREDIENT_LENGTH = 30;
  const MAX_INGREDIENT_QUANTITY_LENGTH = 10;
  const MAX_STEPS = 15;
  const MAX_STEP_DESCRIPTION_LENGTH = 400;
  const MAX_TAGS = 5;
  const MAX_EXTRA_IMAGES = 4;
  const MAX_IMAGE_SIZE_MB = 5; // Maximum image size in megabytes

  // Validate Recipe Name
  const validateRecipeName = (name) => {
    // This regex allows letters from various languages, spaces, apostrophes, and hyphens
    const validNameRegex = /^[\p{L}\s'''-]+$/u;

    if (!validNameRegex.test(name) && name !== "") {
      setRecipeNameError(
        "Recipe name should contain only letters, spaces, apostrophes, and hyphens."
      );
      return false;
    } else if (name.length > MAX_RECIPE_NAME_LENGTH) {
      setRecipeNameError(
        `Recipe name should be less than ${MAX_RECIPE_NAME_LENGTH} characters.`
      );
      return false;
    } else {
      setRecipeNameError("");
      return true;
    }
  };

  // Validate Description
  const validateDescription = (description) => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(
        `Description should be less than ${MAX_DESCRIPTION_LENGTH} characters.`
      );
      return false;
    } else {
      setDescriptionError("");
      return true;
    }
  };

  // Validate Ingredients
  const validateIngredients = (ingredients) => {
    if (ingredients.length > MAX_INGREDIENTS) {
      setIngredientErrors([
        ...ingredientErrors,
        "You can add up to " + MAX_INGREDIENTS + " ingredients.",
      ]);
      return false;
    }

    let valid = true;
    const errors = ingredients.map((ingredient) => {
      if (!ingredient.name || !ingredient.quantity || !ingredient.measurement) {
        valid = false;
        return "All fields are required.";
      } else {
        return "";
      }
    });
    setIngredientErrors(errors);
    return valid;
  };

  // Validate Steps
  const validateSteps = (steps) => {
    if (steps.length > MAX_STEPS) {
      setStepErrors(["You can add up to " + MAX_STEPS + " steps."]);
      return false;
    }
    let valid = true;
    const errors = steps.map((step) => {
      if (!(step.description || step.description === "")) {
        valid = false;
        return "Step description is required.";
      } else if (step.description.length > MAX_STEP_DESCRIPTION_LENGTH) {
        valid = false;
        return `Step description should be less than ${MAX_STEP_DESCRIPTION_LENGTH} characters.`;
      } else {
        return "";
      }
    });
    setStepErrors(errors);
    return valid;
  };

  // Validate Tags
  const validateTags = (tags) => {
    if (tags.length > MAX_TAGS) {
      setTagsError(`You can add up to ${MAX_TAGS} tags.`);
      return false;
    } else if (tags.length === 0) {
      setTagsError("Please add at least one tag.");
      return false;
    } else {
      setTagsError("");
      return true;
    }
  };

  // Validate Extra Images
  const validateExtraImages = (images) => {
    if (images.length > MAX_EXTRA_IMAGES) {
      setExtraImagesError(
        "You can add up to " + MAX_EXTRA_IMAGES + " extra images."
      );
      return false;
    }
    return true;
  };

  // Validate Image Size
  const validateImageSize = (file) => {
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Maximum image size allowed is ${MAX_IMAGE_SIZE_MB} MB.`);
      return false;
    }
    return true;
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    validateDescription(value);
  };

  const handleRecipeNameChange = (e) => {
    const { value } = e.target;
    setRecipeName(value);
    validateRecipeName(value);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedFields = [...ingredientFields];
    const updatedErrors = [...ingredientErrors];
    updatedFields[index][field] = value;
    // Validate ingredient name
    if (field === "name") {
      if (!(/^[A-Za-z\s]+$/.test(value) || value === "")) {
        updatedErrors[index][field] =
          "Ingredient name must contain only Engish letters and spaces.";
        setIngredientErrors(() => updatedErrors);
        return; // Exit the function early if the ingredient name contains invalid characters
      } else if (value.length > MAX_INGREDIENT_LENGTH) {
        updatedErrors[index][field] =
          "Ingredient name must be at most 20 characters.";
        setIngredientErrors(() => updatedErrors);
        return; // Exit the function early if the ingredient name exceeds the character limit
      } else {
        updatedErrors[index][field] = "";
      }
    }

    // Validate quantity
    if (field === "quantity") {
      if (value.trim().length > MAX_INGREDIENT_QUANTITY_LENGTH) {
        updatedErrors[index][field] = "Quantity must be at most 10 characters.";
        setIngredientErrors(() => updatedErrors);
        return; // Exit the function early if the quantity exceeds the character limit
      } else {
        updatedErrors[index][field] = "";
      }
    }

    setIngredientFields(updatedFields);
  };

  const handleAddIngredient = () => {
    setIngredientFields([
      ...ingredientFields,
      {
        id: ingredientFields.length + 1,
        name: "",
        quantity: "",
        measurement: "",
      },
    ]);
    setIngredientErrors([
      ...ingredientErrors,
      {
        id: ingredientFields.length + 1,
        name: "",
        quantity: "",
        measurement: "",
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredientFields((fields) => fields.filter((_, i) => i !== index));
    setIngredientErrors((errors) => errors.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const updatedFields = [...stepFields];
    if (field === "image") {
      if (value) {
        if (!value.type.startsWith('image/')) {
          alert("Please select an image file.");

          updatedFields[index].stepImage = null;
          updatedFields[index].imageName = "Upload Image";
          setStepFields(updatedFields);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedFields[index].stepImage = reader.result;
          updatedFields[index].imageName = "Uploaded!";
          setStepFields(updatedFields);
        };
        reader.readAsDataURL(value);
      } else {
        alert("Please select an image file.");
        updatedFields[index].stepImage = null;
        updatedFields[index].imageName = "Upload Image";
        setStepFields(updatedFields);
      }
    } else {
      updatedFields[index][field] = value;
      setStepFields(updatedFields);
    }
    validateSteps(updatedFields);
  };

  const handleAddStep = () => {
    setStepFields([
      ...stepFields,
      { id: stepFields.length + 1, description: "", stepImage: null },
    ]);
    setStepErrors([...stepErrors, ""]);
  };

  const handleRemoveStep = (index) => {
    stepFields[index].stepImage = null;
    const updatedFields = stepFields.filter((_, i) => i !== index);
    const updatedErrors = stepErrors.filter((_, i) => i !== index);

    const reindexedFields = updatedFields.map((field, i) => ({
      ...field,
      id: i + 1,
    }));

    setStepFields(reindexedFields);
    setStepErrors(updatedErrors);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (
      value &&
      !tags.some((tag) => tag.tag === value) &&
      tags.length < MAX_TAGS
    ) {
      const newTags = [...tags, { id: tags.length + 1, tag: value }];
      setTags(newTags);
      validateTags(newTags);
    }
    e.target.value = "";
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    validateTags(newTags);
  };

  const handleExtraImageChange = (index, file) => {
    if (!file) return;
    if (!validateImageSize(file)) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setExtraImages((images) => {
        const updatedImages = [...images];
        updatedImages[index] = { id: index + 1, image: reader.result }; // Update existing image object or add new one if it doesn't exist
        return updatedImages;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddExtraImage = () => {
    if (extraImages.length < MAX_EXTRA_IMAGES) {
      setExtraImages([
        ...extraImages,
        { id: extraImages.length + 1, image: "" },
      ]);
    }
  };

  const handleRemoveExtraImage = (index) => {
    setExtraImages((images) => images.filter((_, i) => i !== index));
  };

  const handleImageChange = (file) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageBase64("");
        setImageError("Please select an image file.");
        return;
      }
      if (!validateImageSize(file)) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setImageError("");
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64("");
      alert("Please select an image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true); 

    const isValid =
      validateRecipeName(recipeName) &&
      validateDescription(description) &&
      validateIngredients(ingredientFields) &&
      validateSteps(stepFields) &&
      validateTags(tags) &&
      validateExtraImages(extraImages) &&
      validateImageSize(imageBase64);

    if (!isValid) {
      setIsSubmitting(false); 
      return;
    }


    try {
      const response = await axios.post(
        `${BASE_URL}/recipe/add_recipe/${user.user._id}`,
        {
          title: recipeName,
          image: imageBase64,
          description,
          ingredients: ingredientFields,
          steps: stepFields.map(step => ({
            ...step,
            stepImage: step.stepImage // This will send the base64 image data
          })),
          tags,
          photos: extraImages,
          user: user.user,
          userId: user.user._id,
        }
      );
      if (response.status === 201) {
        const { recipe } = response.data;
        setRecipes((prevRecipes) => [...prevRecipes, recipe]);
        onRecipeAdded();
      }
    } catch (error) {
      console.error("Error posting recipe:", error.response ? error.response.data : error.message);
    } finally {
      setIsSubmitting(false); // Stop submitting after request completes

    }
  };

  return (
    <div className="max-w-screen-2xl lg:max-w-screen-lg mb-20 mx-auto">
      <h1 className="text-[#D9D9D9] text-4xl font-bold text-center mb-8 tracking-wide shadow-lg p-4 bg-gradient-to-r from-[#4A1C03] via-[#8B4000] to-[#D2691E] rounded-lg">
        Lets make your recipe public!
      </h1>
      <RecipeForm
        recipeName={recipeName}
        recipeNameError={recipeNameError}
        handleRecipeNameChange={handleRecipeNameChange}
        handleImageChange={handleImageChange}
        imageError={imageError}
        imageBase64={imageBase64}
        description={description}
        descriptionError={descriptionError}
        handleDescriptionChange={handleDescriptionChange}
        ingredientFields={ingredientFields}
        ingredientErrors={ingredientErrors}
        handleIngredientChange={handleIngredientChange}
        handleAddIngredient={handleAddIngredient}
        handleRemoveIngredient={handleRemoveIngredient}
        maxIngredients={MAX_INGREDIENTS}
        stepFields={stepFields}
        stepErrors={stepErrors}
        handleStepChange={handleStepChange}
        handleAddStep={handleAddStep}
        handleRemoveStep={handleRemoveStep}
        maxSteps={MAX_STEPS}
        fileInputRefs={fileInputRefs}
        tags={tags}
        tagsError={tagsError}
        handleTagChange={handleTagChange}
        removeTag={removeTag}
        maxTags={MAX_TAGS}
        extraImages={extraImages}
        extraImagesError={extraImagesError}
        handleExtraImageChange={handleExtraImageChange}
        handleAddExtraImage={handleAddExtraImage}
        handleRemoveExtraImage={handleRemoveExtraImage}
        maxExtraImages={MAX_EXTRA_IMAGES}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddRecipe;
