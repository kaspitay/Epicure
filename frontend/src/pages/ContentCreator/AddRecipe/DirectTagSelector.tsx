import React, { useState } from 'react';

/**
 * A simple standalone tag selector for testing
 */
const DirectTagSelector = () => {
  // Mock tag data
  const tagCategories = ['vegetables', 'fruits', 'meats', 'dairy'];
  const availableTags = {
    vegetables: [
      { _id: 'v1', name: 'Carrot', category: 'vegetables' },
      { _id: 'v2', name: 'Broccoli', category: 'vegetables' },
      { _id: 'v3', name: 'Spinach', category: 'vegetables' },
    ],
    fruits: [
      { _id: 'f1', name: 'Apple', category: 'fruits' },
      { _id: 'f2', name: 'Banana', category: 'fruits' },
      { _id: 'f3', name: 'Orange', category: 'fruits' },
    ],
    meats: [
      { _id: 'm1', name: 'Chicken', category: 'meats' },
      { _id: 'm2', name: 'Beef', category: 'meats' },
    ],
    dairy: [
      { _id: 'd1', name: 'Milk', category: 'dairy' },
      { _id: 'd2', name: 'Cheese', category: 'dairy' },
    ]
  };
  
  // State
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState('vegetables');
  const maxTags = 5;
  
  // Check if we've hit the tag limit
  const isTagLimitReached = selectedTags.length >= maxTags;
  
  // Handle tag selection
  const handleTagClick = (tagId) => {
    // Check if tag is already selected
    const tagIndex = selectedTags.findIndex(tag => tag._id === tagId);
    
    if (tagIndex !== -1) {
      // Remove tag if already selected
      const updatedTags = [...selectedTags];
      updatedTags.splice(tagIndex, 1);
      setSelectedTags(updatedTags);
    } else {
      // Check if we've hit the limit
      if (selectedTags.length >= maxTags) {
        alert(`You can only select up to ${maxTags} tags`);
        return;
      }
      
      // Find the tag in available tags
      for (const category in availableTags) {
        const foundTag = availableTags[category].find(tag => tag._id === tagId);
        if (foundTag) {
          setSelectedTags([...selectedTags, foundTag]);
          break;
        }
      }
    }
  };
  
  // Change active category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Remove tag by index
  const removeTag = (index) => {
    const updatedTags = [...selectedTags];
    updatedTags.splice(index, 1);
    setSelectedTags(updatedTags);
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Tag Selector Test</h2>
      
      {/* Selected tags */}
      <div className="mb-4">
        <h3 className="text-lg text-white mb-2">Selected Tags ({selectedTags.length}/{maxTags})</h3>
        <div className="min-h-[60px] p-4 bg-gray-700 rounded-lg">
          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag, idx) => (
                <div 
                  key={idx}
                  className="bg-orange-600 text-white px-3 py-1 rounded-full flex items-center"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="ml-2 text-white hover:text-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center">No tags selected</div>
          )}
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-700 pb-3">
        {tagCategories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Available tags */}
      <div>
        <h3 className="text-lg text-white mb-2">Available Tags</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableTags[activeCategory]?.map(tag => {
            const isSelected = selectedTags.some(t => t._id === tag._id);
            const isDisabled = isTagLimitReached && !isSelected;
            
            return (
              <div
                key={tag._id}
                onClick={() => !isDisabled && handleTagClick(tag._id)}
                className={`px-3 py-2 rounded text-sm text-center cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white'
                    : isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DirectTagSelector; 