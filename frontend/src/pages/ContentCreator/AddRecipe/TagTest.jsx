import React, { useState } from 'react';

const TagTest = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Sample tags for testing
  const tagOptions = [
    { _id: '1', name: 'Test Tag 1', category: 'test' },
    { _id: '2', name: 'Test Tag 2', category: 'test' },
    { _id: '3', name: 'Test Tag 3', category: 'test' },
    { _id: '4', name: 'Test Tag 4', category: 'test' },
  ];
  
  const handleTagClick = (tagId) => {
    console.log("Tag clicked:", tagId);
    const tagExists = selectedTags.some(tag => tag._id === tagId);
    
    if (tagExists) {
      // Remove tag
      const newTags = selectedTags.filter(tag => tag._id !== tagId);
      setSelectedTags(newTags);
    } else {
      // Add tag
      const tagToAdd = tagOptions.find(tag => tag._id === tagId);
      if (tagToAdd) {
        setSelectedTags([...selectedTags, tagToAdd]);
      }
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Tag Test</h2>
      
      <div className="mb-4">
        <h3 className="text-lg mb-2">Selected Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTags.length === 0 ? (
            <p>No tags selected</p>
          ) : (
            selectedTags.map(tag => (
              <div key={tag._id} className="bg-blue-500 text-white px-3 py-1 rounded-full">
                {tag.name}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTagClick(tag._id);
                  }}
                  className="ml-2"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg mb-2">Available Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map(tag => (
            <button
              key={tag._id}
              onClick={(e) => {
                e.preventDefault();
                handleTagClick(tag._id);
              }}
              className={`px-3 py-1 rounded-md ${
                selectedTags.some(t => t._id === tag._id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagTest; 