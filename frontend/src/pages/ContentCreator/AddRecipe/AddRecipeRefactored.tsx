import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiX, FiUpload, FiCheck, FiAlertCircle,
  FiImage, FiList, FiTag, FiFileText, FiCamera
} from 'react-icons/fi';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { recipeApi, tagApi } from '../../../api';
import { TAG_CATEGORIES } from '../../../constants';
import { recipeFormSchema, RECIPE_LIMITS, TagField } from '../../../schemas/recipeSchema';
import foodMeasurements from '../../../layout/components/foodMeasurements';

interface AddRecipeProps {
  onRecipeAdded?: (recipe: unknown) => void;
}

type RecipeFormValues = {
  title: string;
  description: string;
  image: string;
  ingredients: { name: string; quantity: string; measurement: string }[];
  steps: { description: string; stepImage?: string | null }[];
  tags: TagField[];
  photos: { base64: string }[];
};

// Progress steps for the stepper
const FORM_SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: FiFileText },
  { id: 'ingredients', label: 'Ingredients', icon: FiList },
  { id: 'steps', label: 'Steps', icon: FiCheck },
  { id: 'tags', label: 'Tags', icon: FiTag },
  { id: 'photos', label: 'Photos', icon: FiCamera },
];

const AddRecipeRefactored = ({ onRecipeAdded }: AddRecipeProps) => {
  const { user } = useAuthContext();
  const [activeSection, setActiveSection] = useState('basic');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      image: '',
      ingredients: [{ name: '', quantity: '', measurement: '' }],
      steps: [{ description: '', stepImage: null }],
      tags: [],
      photos: [],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps',
  });

  const [availableTags, setAvailableTags] = useState<Record<string, TagField[]>>({});
  const [activeTagCategory, setActiveTagCategory] = useState('dietary');
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [extraImages, setExtraImages] = useState<{ base64: string }[]>([]);
  const stepFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const watchedValues = watch();
  const selectedTags = watch('tags');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const tagsData = await tagApi.getAll();
        const tagsByCategory: Record<string, TagField[]> = {};
        Object.keys(TAG_CATEGORIES).forEach(category => {
          tagsByCategory[category] = [];
        });
        tagsData.forEach((tag: TagField) => {
          if (tag.category && tagsByCategory[tag.category]) {
            tagsByCategory[tag.category].push(tag);
          }
        });
        setAvailableTags(tagsByCategory);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  const getSectionStatus = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return watchedValues.title?.trim() && watchedValues.description?.trim() && watchedValues.image;
      case 'ingredients':
        return watchedValues.ingredients?.length > 0 &&
          watchedValues.ingredients.every(ing => ing.name && ing.quantity && ing.measurement);
      case 'steps':
        return watchedValues.steps?.length > 0 &&
          watchedValues.steps.every(step => step.description);
      case 'tags':
        return watchedValues.tags?.length > 0;
      case 'photos':
        return true; // Optional
      default:
        return false;
    }
  }, [watchedValues]);

  const completedSections = FORM_SECTIONS.filter(s => getSectionStatus(s.id)).length;
  const progress = Math.round((completedSections / (FORM_SECTIONS.length - 1)) * 100); // -1 because photos is optional

  const handleMainImageChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > RECIPE_LIMITS.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Maximum image size is ${RECIPE_LIMITS.MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image', reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleStepImageChange = (index: number, file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(`steps.${index}.stepImage`, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTagToggle = (tag: TagField) => {
    const currentTags = watchedValues.tags || [];
    const isSelected = currentTags.some(t => t._id === tag._id);
    if (isSelected) {
      setValue('tags', currentTags.filter(t => t._id !== tag._id), { shouldValidate: true });
    } else if (currentTags.length < RECIPE_LIMITS.MAX_TAGS) {
      setValue('tags', [...currentTags, tag], { shouldValidate: true });
    }
  };

  const handleExtraImageChange = (index: number, file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedImages = [...extraImages];
      updatedImages[index] = { base64: reader.result as string };
      setExtraImages(updatedImages);
      setValue('photos', updatedImages, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const addExtraImage = () => {
    if (extraImages.length < RECIPE_LIMITS.MAX_EXTRA_IMAGES) {
      setExtraImages([...extraImages, { base64: '' }]);
    }
  };

  const removeExtraImage = (index: number) => {
    const updatedImages = extraImages.filter((_, i) => i !== index);
    setExtraImages(updatedImages);
    setValue('photos', updatedImages.filter(img => img.base64), { shouldValidate: true });
  };

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      const recipeData = {
        title: data.title,
        image: data.image,
        description: data.description,
        ingredients: data.ingredients.map(ing => ({
          name: ing.name,
          quantity: Number(ing.quantity),
          measurement: ing.measurement,
        })),
        steps: data.steps.map(step => ({
          description: step.description,
          stepImage: step.stepImage || null,
        })),
        tags: data.tags.map(tag => ({
          tag: tag.name,
          _id: tag._id,
          category: tag.category,
        })),
        photos: data.photos?.filter(p => p.base64).map(p => ({ image: p.base64 })) || [],
        userId: user?.user?._id,
        user: user?.user,
      };

      const newRecipe = await recipeApi.create(recipeData);

      for (const tag of data.tags) {
        try {
          await tagApi.incrementUsage(tag.name);
        } catch (error) {
          console.error(`Error incrementing tag usage for ${tag.name}:`, error);
        }
      }

      if (onRecipeAdded) onRecipeAdded(newRecipe);
      reset();
      setExtraImages([]);
      alert('Recipe created successfully!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(`Error creating recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#BE6F50] via-[#A85D40] to-[#8B4513] p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create New Recipe</h1>
          <p className="text-white/80">Share your culinary masterpiece with the world</p>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>{progress}% Complete</span>
            <span>{completedSections}/4 sections</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {FORM_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isComplete = getSectionStatus(section.id);
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                ${isActive
                  ? 'bg-[#BE6F50] text-white shadow-lg shadow-[#BE6F50]/30'
                  : isComplete
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-[#2A2725] text-gray-400 hover:bg-[#353230] hover:text-white'
                }`}
            >
              {isComplete && !isActive ? (
                <FiCheck className="text-green-400" />
              ) : (
                <Icon />
              )}
              {section.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Text Inputs */}
                <div className="space-y-6">
                  {/* Recipe Name */}
                  <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                    <label className="flex items-center gap-2 text-white font-medium mb-4">
                      <FiFileText className="text-[#BE6F50]" />
                      Recipe Name
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="e.g., Grandma's Secret Pasta"
                      className={`w-full bg-[#1E1C1A] text-white text-lg px-5 py-4 rounded-xl border-2 transition-all placeholder:text-gray-600
                        ${errors.title
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-transparent focus:border-[#BE6F50]'
                        }`}
                    />
                    <div className="flex justify-between mt-2">
                      {errors.title ? (
                        <span className="text-red-400 text-sm flex items-center gap-1">
                          <FiAlertCircle /> {errors.title.message}
                        </span>
                      ) : <span />}
                      <span className="text-gray-500 text-sm">
                        {watchedValues.title?.length || 0}/{RECIPE_LIMITS.MAX_RECIPE_NAME_LENGTH}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                    <label className="flex items-center gap-2 text-white font-medium mb-4">
                      <FiFileText className="text-[#BE6F50]" />
                      Description
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder="Tell us about your recipe... What makes it special?"
                      rows={6}
                      className={`w-full bg-[#1E1C1A] text-white px-5 py-4 rounded-xl border-2 transition-all resize-none placeholder:text-gray-600
                        ${errors.description
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-transparent focus:border-[#BE6F50]'
                        }`}
                    />
                    <div className="flex justify-between mt-2">
                      {errors.description ? (
                        <span className="text-red-400 text-sm flex items-center gap-1">
                          <FiAlertCircle /> {errors.description.message}
                        </span>
                      ) : <span />}
                      <span className="text-gray-500 text-sm">
                        {watchedValues.description?.length || 0}/{RECIPE_LIMITS.MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5 h-fit">
                  <label className="flex items-center gap-2 text-white font-medium mb-4">
                    <FiImage className="text-[#BE6F50]" />
                    Cover Photo
                    <span className="text-red-400">*</span>
                  </label>

                  <div
                    onClick={() => document.getElementById('mainImageInput')?.click()}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all aspect-[4/3]
                      ${watchedValues.image
                        ? 'ring-2 ring-green-500'
                        : errors.image
                          ? 'ring-2 ring-red-500'
                          : 'ring-2 ring-dashed ring-gray-600 hover:ring-[#BE6F50]'
                      }`}
                  >
                    {watchedValues.image ? (
                      <>
                        <img
                          src={watchedValues.image}
                          alt="Recipe cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                            Change Photo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E1C1A]">
                        <div className="w-16 h-16 rounded-full bg-[#BE6F50]/20 flex items-center justify-center mb-4">
                          <FiUpload className="text-[#BE6F50] text-2xl" />
                        </div>
                        <p className="text-white font-medium mb-1">Upload Cover Photo</p>
                        <p className="text-gray-500 text-sm">PNG, JPG up to {RECIPE_LIMITS.MAX_IMAGE_SIZE_MB}MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="mainImageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMainImageChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {errors.image && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle /> {errors.image.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Next button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection('ingredients')}
                  className="px-6 py-3 bg-[#BE6F50] text-white rounded-xl font-medium hover:bg-[#A85D40] transition-colors"
                >
                  Next: Ingredients →
                </button>
              </div>
            </motion.div>
          )}

          {/* Ingredients Section */}
          {activeSection === 'ingredients' && (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiList className="text-[#BE6F50] text-xl" />
                    <h2 className="text-xl font-semibold text-white">Ingredients</h2>
                    <span className="text-gray-500 text-sm">({ingredientFields.length}/{RECIPE_LIMITS.MAX_INGREDIENTS})</span>
                  </div>
                  {ingredientFields.length < RECIPE_LIMITS.MAX_INGREDIENTS && (
                    <button
                      type="button"
                      onClick={() => appendIngredient({ name: '', quantity: '', measurement: '' })}
                      className="flex items-center gap-2 px-4 py-2 bg-[#BE6F50]/20 text-[#BE6F50] rounded-lg hover:bg-[#BE6F50]/30 transition-colors"
                    >
                      <FiPlus /> Add Ingredient
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {ingredientFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-[#1E1C1A] p-4 rounded-xl group"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-[#BE6F50]/20 text-[#BE6F50] rounded-lg font-medium text-sm">
                        {index + 1}
                      </span>

                      <input
                        {...register(`ingredients.${index}.name`)}
                        type="text"
                        placeholder="Ingredient name"
                        className={`flex-1 bg-[#2A2725] text-white px-4 py-3 rounded-lg border transition-all
                          ${errors.ingredients?.[index]?.name
                            ? 'border-red-500/50'
                            : 'border-transparent focus:border-[#BE6F50]'
                          }`}
                      />

                      <input
                        {...register(`ingredients.${index}.quantity`)}
                        type="text"
                        placeholder="Qty"
                        className={`w-20 bg-[#2A2725] text-white px-4 py-3 rounded-lg border text-center transition-all
                          ${errors.ingredients?.[index]?.quantity
                            ? 'border-red-500/50'
                            : 'border-transparent focus:border-[#BE6F50]'
                          }`}
                      />

                      <select
                        {...register(`ingredients.${index}.measurement`)}
                        className={`w-32 bg-[#2A2725] text-white px-4 py-3 rounded-lg border transition-all appearance-none cursor-pointer
                          ${errors.ingredients?.[index]?.measurement
                            ? 'border-red-500/50'
                            : 'border-transparent focus:border-[#BE6F50]'
                          }`}
                      >
                        <option value="">Unit</option>
                        {foodMeasurements.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>

                      {ingredientFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiX />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {errors.ingredients?.root && (
                  <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                    <FiAlertCircle /> {errors.ingredients.root.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('basic')}
                  className="px-6 py-3 bg-[#2A2725] text-white rounded-xl font-medium hover:bg-[#353230] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('steps')}
                  className="px-6 py-3 bg-[#BE6F50] text-white rounded-xl font-medium hover:bg-[#A85D40] transition-colors"
                >
                  Next: Steps →
                </button>
              </div>
            </motion.div>
          )}

          {/* Steps Section */}
          {activeSection === 'steps' && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-[#BE6F50] text-xl" />
                    <h2 className="text-xl font-semibold text-white">Cooking Steps</h2>
                    <span className="text-gray-500 text-sm">({stepFields.length}/{RECIPE_LIMITS.MAX_STEPS})</span>
                  </div>
                  {stepFields.length < RECIPE_LIMITS.MAX_STEPS && (
                    <button
                      type="button"
                      onClick={() => appendStep({ description: '', stepImage: null })}
                      className="flex items-center gap-2 px-4 py-2 bg-[#BE6F50]/20 text-[#BE6F50] rounded-lg hover:bg-[#BE6F50]/30 transition-colors"
                    >
                      <FiPlus /> Add Step
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {stepFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1E1C1A] rounded-xl overflow-hidden group"
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-[#252220]">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-[#BE6F50] text-white rounded-lg font-medium">
                            {index + 1}
                          </span>
                          <span className="text-white font-medium">Step {index + 1}</span>
                        </div>
                        {stepFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>

                      <div className="p-4 flex gap-4">
                        <div className="flex-1">
                          <textarea
                            {...register(`steps.${index}.description`)}
                            placeholder={`Describe what to do in step ${index + 1}...`}
                            rows={4}
                            className={`w-full bg-[#2A2725] text-white px-4 py-3 rounded-lg border resize-none transition-all placeholder:text-gray-600
                              ${errors.steps?.[index]?.description
                                ? 'border-red-500/50'
                                : 'border-transparent focus:border-[#BE6F50]'
                              }`}
                          />
                          {errors.steps?.[index]?.description && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.steps[index]?.description?.message}
                            </p>
                          )}
                        </div>

                        <div
                          onClick={() => stepFileRefs.current[index]?.click()}
                          className={`w-32 h-32 flex-shrink-0 rounded-lg cursor-pointer transition-all overflow-hidden
                            ${watchedValues.steps?.[index]?.stepImage
                              ? 'ring-2 ring-green-500'
                              : 'ring-2 ring-dashed ring-gray-600 hover:ring-[#BE6F50]'
                            }`}
                        >
                          {watchedValues.steps?.[index]?.stepImage ? (
                            <img
                              src={watchedValues.steps[index].stepImage as string}
                              alt={`Step ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#2A2725] flex flex-col items-center justify-center">
                              <FiCamera className="text-gray-500 text-xl mb-1" />
                              <span className="text-gray-500 text-xs">Add photo</span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={(el) => { stepFileRefs.current[index] = el; }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStepImageChange(index, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('ingredients')}
                  className="px-6 py-3 bg-[#2A2725] text-white rounded-xl font-medium hover:bg-[#353230] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('tags')}
                  className="px-6 py-3 bg-[#BE6F50] text-white rounded-xl font-medium hover:bg-[#A85D40] transition-colors"
                >
                  Next: Tags →
                </button>
              </div>
            </motion.div>
          )}

          {/* Tags Section */}
          {activeSection === 'tags' && (
            <motion.div
              key="tags"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiTag className="text-[#BE6F50] text-xl" />
                    <h2 className="text-xl font-semibold text-white">Tags</h2>
                    <span className="text-gray-500 text-sm">({selectedTags?.length || 0}/{RECIPE_LIMITS.MAX_TAGS})</span>
                  </div>
                  {/* Category Dropdown */}
                  <select
                    value={activeTagCategory}
                    onChange={(e) => setActiveTagCategory(e.target.value)}
                    className="bg-[#1E1C1A] text-white px-4 py-2 rounded-lg border border-white/10 text-sm cursor-pointer"
                  >
                    {Object.keys(TAG_CATEGORIES).map(category => (
                      <option key={category} value={category}>
                        {(TAG_CATEGORIES as Record<string, { icon: string; label: string }>)[category]?.label}
                      </option>
                    ))}
                  </select>
                </div>

                {isLoadingTags ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#BE6F50] border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected Tags */}
                    {selectedTags && selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 bg-[#1E1C1A] rounded-xl">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#BE6F50] text-white rounded-lg text-sm font-medium"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {errors.tags && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FiAlertCircle /> {errors.tags.message}
                      </p>
                    )}

                    {/* Tag Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTags[activeTagCategory]?.map(tag => {
                        const isSelected = selectedTags?.some(t => t._id === tag._id);
                        const isDisabled = (selectedTags?.length || 0) >= RECIPE_LIMITS.MAX_TAGS && !isSelected;

                        return (
                          <button
                            key={tag._id}
                            type="button"
                            onClick={() => !isDisabled && handleTagToggle(tag)}
                            disabled={isDisabled}
                            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                              ${isSelected
                                ? 'bg-[#BE6F50] text-white'
                                : isDisabled
                                  ? 'bg-[#1E1C1A] text-gray-600 cursor-not-allowed'
                                  : 'bg-[#1E1C1A] text-gray-300 hover:bg-[#353230] hover:text-white'
                              }`}
                          >
                            <span className="truncate">{tag.name}</span>
                            {isSelected && <FiCheck className="flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {(!availableTags[activeTagCategory] || availableTags[activeTagCategory].length === 0) && (
                      <div className="text-center py-8 text-gray-500 bg-[#1E1C1A] rounded-xl">
                        No tags available in this category
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('steps')}
                  className="px-6 py-3 bg-[#2A2725] text-white rounded-xl font-medium hover:bg-[#353230] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('photos')}
                  className="px-6 py-3 bg-[#BE6F50] text-white rounded-xl font-medium hover:bg-[#A85D40] transition-colors"
                >
                  Next: Photos →
                </button>
              </div>
            </motion.div>
          )}

          {/* Photos Section */}
          {activeSection === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-[#2A2725] rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiCamera className="text-[#BE6F50] text-xl" />
                    <h2 className="text-xl font-semibold text-white">Extra Photos</h2>
                    <span className="text-gray-500 text-sm">(Optional)</span>
                  </div>
                  {extraImages.length < RECIPE_LIMITS.MAX_EXTRA_IMAGES && (
                    <button
                      type="button"
                      onClick={addExtraImage}
                      className="flex items-center gap-2 px-4 py-2 bg-[#BE6F50]/20 text-[#BE6F50] rounded-lg hover:bg-[#BE6F50]/30 transition-colors"
                    >
                      <FiPlus /> Add Photo
                    </button>
                  )}
                </div>

                <p className="text-gray-400 mb-6">
                  Add up to {RECIPE_LIMITS.MAX_EXTRA_IMAGES} additional photos to showcase your recipe
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {extraImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div
                        onClick={() => document.getElementById(`extraImage-${index}`)?.click()}
                        className={`aspect-square rounded-xl cursor-pointer transition-all overflow-hidden
                          ${img.base64
                            ? 'ring-2 ring-green-500'
                            : 'ring-2 ring-dashed ring-gray-600 hover:ring-[#BE6F50]'
                          }`}
                      >
                        {img.base64 ? (
                          <img src={img.base64} alt={`Extra ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#1E1C1A] flex flex-col items-center justify-center">
                            <FiUpload className="text-gray-500 text-2xl mb-2" />
                            <span className="text-gray-500 text-sm">Upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        id={`extraImage-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleExtraImageChange(index, e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Section */}
              <div className="mt-8 bg-gradient-to-r from-[#BE6F50]/20 to-[#A85D40]/20 rounded-2xl p-6 border border-[#BE6F50]/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Ready to publish?</h3>
                    <p className="text-gray-400 text-sm">
                      {progress === 100
                        ? 'All required sections are complete!'
                        : `Complete all required sections to publish (${progress}% done)`
                      }
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSection('tags')}
                      className="px-6 py-3 bg-[#2A2725] text-white rounded-xl font-medium hover:bg-[#353230] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
                        ${isSubmitting
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-[#BE6F50] text-white hover:bg-[#A85D40] hover:shadow-lg hover:shadow-[#BE6F50]/30'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          Publish Recipe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default AddRecipeRefactored;
