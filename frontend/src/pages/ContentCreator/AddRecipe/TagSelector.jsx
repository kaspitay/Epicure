import React, { useState } from 'react';
import { FaTag, FaTags, FaMinusCircle } from 'react-icons/fa';
import { TAG_CATEGORIES } from '../../../constants';

const TagSelector = ({ tags, setTags, maxTags, availableTags, isLoading, errorMessage: externalError, setErrorMessage: setExternalError }) => {
  const [activeCategory, setActiveCategory] = useState('dietary');
  const [internalError, setInternalError] = useState('');
  
  const isTagLimitReached = tags.length >= maxTags;
  
  // Handle tag selection
  const handleTagClick = (tagId) => {
    // Check if tag is already selected
    const tagIndex = tags.findIndex(tag => tag._id === tagId);
    
    if (tagIndex !== -1) {
      // Remove tag if already selected
      const updatedTags = [...tags];
      updatedTags.splice(tagIndex, 1);
      setTags(updatedTags);
      setInternalError('');
      if (setExternalError) setExternalError('');
      return;
    }
    
    // Check if we've reached the limit
    if (tags.length >= maxTags) {
      const errorMsg = `You can only select up to ${maxTags} tags.`;
      setInternalError(errorMsg);
      if (setExternalError) setExternalError(errorMsg);
      return;
    }
    
    // Find the tag in available tags
    let selectedTag = null;
    
    for (const category in availableTags) {
      const found = availableTags[category].find(tag => tag._id === tagId);
      if (found) {
        selectedTag = found;
        break;
      }
    }
    
    if (selectedTag) {
      setTags([...tags, selectedTag]);
      setInternalError('');
      if (setExternalError) setExternalError('');
    }
  };
  
  // Remove tag by index
  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
    setInternalError('');
    if (setExternalError) setExternalError('');
  };
  
  return (
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
            <div className="flex flex-wrap mt-2 min-h-[60px] bg-gray-700 p-3 rounded-md">
              {tags.length > 0 ? (
                <div className="w-full">
                  <div className="flex flex-wrap">
                    {tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="bg-orange-600 text-white px-3 py-1 rounded-full mr-2 mb-2 flex items-center"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          className="ml-2 text-white hover:text-red-200 focus:outline-none transition-colors"
                        >
                          <FaMinusCircle size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full text-gray-500 text-sm flex items-center justify-center h-[60px]">
                  <FaTag className="mr-2" /> Select tags to categorize your recipe
                </div>
              )}
            </div>
            
            {/* Error messages */}
            {(internalError || externalError) && (
              <div className="text-red-500 text-sm mt-1 bg-red-100 bg-opacity-20 border border-red-400 rounded-md py-1 px-3">
                {internalError || externalError}
              </div>
            )}
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap mb-3 gap-1 border-b border-gray-700 pb-2">
            {Object.keys(TAG_CATEGORIES).map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {TAG_CATEGORIES[category]?.icon} {TAG_CATEGORIES[category]?.label}
              </button>
            ))}
          </div>
          
          {/* Tag options for selected category */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {availableTags[activeCategory]?.map(tag => {
              // Check if this tag is already selected
              const isSelected = tags.some(t => t._id === tag._id);
              const isDisabled = isTagLimitReached && !isSelected;
              
              return (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => handleTagClick(tag._id)}
                  disabled={isDisabled}
                  className={`px-3 py-2 rounded-md text-sm font-medium
                    ${isSelected
                      ? 'bg-orange-600 text-white'
                      : isDisabled
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {tag.name || "Unnamed Tag"}
                </button>
              );
            })}
            
            {!availableTags[activeCategory]?.length && (
              <div className="text-gray-400 col-span-full p-4 text-center">
                No tags available in this category
              </div>
            )}
          </div>
          
          {isTagLimitReached && (
            <p className="text-yellow-500 text-sm mt-1">
              You've reached the maximum of {maxTags} tags.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TagSelector; 