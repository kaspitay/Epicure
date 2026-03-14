import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useRecipeContext } from "../../../context/RecipeContext";
import { recipeApi, tagApi } from "../../../api";
import RecipeForm from "../../../layout/components/RecipeForm";
import TagSelector from "./TagSelector";
import { TAG_CATEGORIES } from "../../../constants";

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

  // Updated tag state to handle structured tags
  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState("");
  const [availableTags, setAvailableTags] = useState({});
  const [activeTagCategory, setActiveTagCategory] = useState("dietary");

  const [extraImages, setExtraImages] = useState([]);
  const [extraImagesError, setExtraImagesError] = useState("");

  const [imageBase64, setImageBase64] = useState("");
  const [imageError, setImageError] = useState("");

  const fileInputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch available tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const tagsData = await tagApi.getAll();
        console.log("API response tags:", tagsData);

        // Organize tags by category
        const tagsByCategory = {};

        // Initialize with empty arrays for each category to ensure all categories are shown
        Object.keys(TAG_CATEGORIES).forEach(category => {
          tagsByCategory[category] = [];
        });

        // Add tags to their respective categories
        tagsData.forEach(tag => {
          if (tag.category && tagsByCategory[tag.category]) {
            tagsByCategory[tag.category].push(tag);
          } else if (tag.category) {
            // If category exists in tag but not in our predefined categories
            tagsByCategory[tag.category] = [tag];
          } else {
            // Fallback for tags without category
            if (!tagsByCategory['uncategorized']) {
              tagsByCategory['uncategorized'] = [];
            }
            tagsByCategory['uncategorized'].push(tag);
          }
        });
        
        setAvailableTags(tagsByCategory);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tags:", error);
        // Provide fallback data in case of error
        const fallbackTags = {};
        Object.keys(TAG_CATEGORIES).forEach(category => {
          fallbackTags[category] = [];
        });
        setAvailableTags(fallbackTags);
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);

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
      {
        id: stepFields.length + 1,
        description: "",
        stepImage: null,
        imageName: "Upload image",
      },
    ]);
    setStepErrors([...stepErrors, ""]);
  };

  const handleRemoveStep = (index) => {
    setStepFields((fields) => fields.filter((_, i) => i !== index));
    setStepErrors((errors) => errors.filter((_, i) => i !== index));
  };

  // Updated tag handling functions
  // Set active category
  const handleTagCategoryChange = (category) => {
    setActiveTagCategory(category);
  };

  // Handle tag selection - SIMPLIFIED VERSION
  const handleTagChange = (tagId) => {
    // Debug log
    console.log("Tag clicked in handleTagChange:", tagId);
    
    // Check if tag is already selected (exists in tags array)
    const tagExists = tags.some(tag => tag._id === tagId);
    console.log("Tag exists in selection?", tagExists);
    
    if (tagExists) {
      // Remove tag if already selected
      const filteredTags = tags.filter(tag => tag._id !== tagId);
      console.log("After removal:", filteredTags);
      setTags(filteredTags);
    } else {
      // Add tag if not already selected
      // Find the tag object in availableTags
      let tagObject = null;
      
      // Check all categories
      Object.values(availableTags).forEach(categoryTags => {
        const found = categoryTags.find(tag => tag._id === tagId);
        if (found) {
          tagObject = found;
        }
      });
      
      if (!tagObject) {
        console.error("Tag not found:", tagId);
        return;
      }
      
      // Check if we've hit the limit
      if (tags.length >= MAX_TAGS) {
        setTagsError(`You can only select up to ${MAX_TAGS} tags.`);
        return;
      }
      
      // Add the tag
      console.log("Adding tag:", tagObject);
      setTags([...tags, tagObject]);
    }
    
    // Clear any error message
    setTagsError("");
  };

  // Remove a tag by index
  const removeTag = (index) => {
    // Safety check
    if (index < 0 || index >= tags.length) return;
    
    // Create a new array without the tag at the given index
    const newTags = [...tags];
    newTags.splice(index, 1);
    
    // Update tags
    setTags(newTags);
  };

  const handleExtraImageChange = (index, file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    if (!validateImageSize(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedImages = [...extraImages];
      updatedImages[index] = { id: index + 1, file, base64: reader.result };
      setExtraImages(updatedImages);
      validateExtraImages(updatedImages);
    };
    reader.readAsDataURL(file);
  };

  const handleAddExtraImage = () => {
    setExtraImages([...extraImages, { id: extraImages.length + 1 }]);
  };

  const handleRemoveExtraImage = (index) => {
    setExtraImages((images) => images.filter((_, i) => i !== index));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    if (!validateImageSize(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImageError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all required fields
    const isRecipeNameValid = validateRecipeName(recipeName);
    const isDescriptionValid = validateDescription(description);
    const areIngredientsValid = validateIngredients(ingredientFields);
    const areStepsValid = validateSteps(stepFields);
    
    // Validate tags
    let areTagsValid = true;
    if (tags.length === 0) {
      setTagsError("Please add at least one tag.");
      areTagsValid = false;
    } else if (tags.length > MAX_TAGS) {
      setTagsError(`You can add up to ${MAX_TAGS} tags.`);
      areTagsValid = false;
    } else {
      setTagsError("");
    }

    if (
      !isRecipeNameValid ||
      !isDescriptionValid ||
      !areIngredientsValid ||
      !areStepsValid ||
      !areTagsValid ||
      !imageBase64
    ) {
      if (!imageBase64) {
        setImageError("Please select a recipe image.");
      }
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert steps images to base64
      const stepsWithImages = stepFields.map((step) => {
        let stepImageBase64 = null;
        if (step.stepImage) {
          const reader = new FileReader();
          reader.readAsDataURL(step.stepImage);
          stepImageBase64 = step.stepImageBase64;
        }
        return {
          description: step.description,
          stepImage: stepImageBase64,
        };
      });

      // Extract tag information for the API
      const tagData = tags.map(tag => {
        // Ensure each tag has required fields
        return {
          tag: tag.name || tag.tag || "Unknown Tag",
          _id: tag._id || "",
          category: tag.category || "uncategorized"
        };
      });
      
      console.log("Submitting recipe with tags:", tagData);

      // Create the recipe object
      const recipeData = {
        title: recipeName,
        image: imageBase64,
        description,
        ingredients: ingredientFields.map(({ name, quantity, measurement }) => ({
          name,
          quantity: Number(quantity),
          measurement,
        })),
        steps: stepsWithImages,
        tags: tagData,
        photos: extraImages.map(({ base64 }) => ({ image: base64 })),
        userId: user._id,
        user,
      };

      // Make the API request to create the recipe
      const newRecipe = await recipeApi.create(recipeData);

      // Increment usage count for each tag
      for (const tag of tags) {
        try {
          await tagApi.incrementUsage(tag.name);
        } catch (error) {
          console.error(`Error incrementing tag usage for ${tag.name}:`, error);
        }
      }

      if (onRecipeAdded) {
        onRecipeAdded(newRecipe);
      }

      // Reset form after successful submission
      setRecipeName("");
      setDescription("");
      setIngredientFields([
        { id: 1, name: "", quantity: "", measurement: "" },
      ]);
      setStepFields([
        { id: 1, description: "", stepImage: null, imageName: "Upload image" },
      ]);
      setTags([]);
      setExtraImages([]);
      setImageBase64("");

      alert("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert(`Error creating recipe: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
      handleTagCategoryChange={handleTagCategoryChange}
      activeTagCategory={activeTagCategory}
      availableTags={availableTags}
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
      isLoading={isLoading}
      tagCategories={Object.keys(TAG_CATEGORIES)}
    />
  );
};

export default AddRecipe;
