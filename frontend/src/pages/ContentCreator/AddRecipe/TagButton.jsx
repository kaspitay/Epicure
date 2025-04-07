import React from 'react';

const TagButton = ({ tag, handleTagChange, isSelected, isDisabled }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Clicked tag:", tag.name, tag._id);
    handleTagChange(tag._id);
  };

  return (
    <button
      key={tag._id}
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isSelected
          ? 'bg-orange-600 text-white'
          : isDisabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
      {tag.name}
    </button>
  );
};

export default TagButton; 