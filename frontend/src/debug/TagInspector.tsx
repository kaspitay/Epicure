import { useState, useEffect } from 'react';
import { tagApi } from '../api';
import { TAG_CATEGORIES } from '../constants';

const TagInspector = () => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeCategory, setActiveCategory] = useState('dietary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logMessages, setLogMessages] = useState([]);

  // Add log message with timestamp
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        addLog('Fetching tags from API...');

        const tagsData = await tagApi.getAll();
        addLog(`Received ${tagsData.length} tags from API`);
        
        // Group tags by category
        const tagsByCategory = {};
        
        // Initialize categories
        Object.keys(TAG_CATEGORIES).forEach(category => {
          tagsByCategory[category] = [];
        });
        
        // Add tags to categories
        tagsData.forEach(tag => {
          if (tag.category && tagsByCategory[tag.category]) {
            tagsByCategory[tag.category].push(tag);
          } else if (tag.category) {
            tagsByCategory[tag.category] = [tag];
          } else {
            if (!tagsByCategory['uncategorized']) {
              tagsByCategory['uncategorized'] = [];
            }
            tagsByCategory['uncategorized'].push(tag);
          }
        });
        
        addLog('Tags grouped by category');
        setAllTags(tagsByCategory);
        setLoading(false);
      } catch (err) {
        addLog(`Error: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchTags();
  }, []);

  const handleCategoryChange = (category) => {
    addLog(`Changed category to: ${category}`);
    setActiveCategory(category);
  };

  const handleTagClick = (tag) => {
    addLog(`Clicked tag: ${tag.name} (${tag._id})`);
    
    // Check if already selected
    if (selectedTags.some(t => t._id === tag._id)) {
      addLog(`Removing tag: ${tag.name}`);
      setSelectedTags(selectedTags.filter(t => t._id !== tag._id));
    } else {
      addLog(`Adding tag: ${tag.name}`);
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (index) => {
    const tagToRemove = selectedTags[index];
    addLog(`Removing tag at index ${index}: ${tagToRemove?.name}`);
    
    const updatedTags = [...selectedTags];
    updatedTags.splice(index, 1);
    setSelectedTags(updatedTags);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Tag Inspector Debugger</h1>
      
      {loading ? (
        <div className="text-white">Loading tags...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl text-white mb-2">Available Tags</h2>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(TAG_CATEGORIES).map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm ${activeCategory === category 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {TAG_CATEGORIES[category]?.icon} {TAG_CATEGORIES[category]?.label}
                </button>
              ))}
            </div>
            
            {/* Tags in category */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white text-lg mb-2">
                {TAG_CATEGORIES[activeCategory]?.label || activeCategory}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {allTags[activeCategory]?.map(tag => (
                  <button
                    key={tag._id}
                    onClick={() => handleTagClick(tag)}
                    className={`p-2 rounded text-sm ${
                      selectedTags.some(t => t._id === tag._id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag.name} {tag._id && <span className="text-xs opacity-50">({tag._id.substring(0, 4)}...)</span>}
                  </button>
                ))}
                
                {(!allTags[activeCategory] || allTags[activeCategory].length === 0) && (
                  <div className="text-gray-500 col-span-2 text-center p-4">
                    No tags in this category
                  </div>
                )}
              </div>
            </div>
            
            {/* Selected tags */}
            <div className="mt-4">
              <h2 className="text-xl text-white mb-2">Selected Tags ({selectedTags.length})</h2>
              <div className="bg-gray-800 p-4 rounded-lg min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag(index)}
                        className="ml-2 hover:text-red-200"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  {selectedTags.length === 0 && (
                    <div className="text-gray-500 w-full text-center p-4">
                      No tags selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Console log */}
          <div>
            <h2 className="text-xl text-white mb-2">Debug Log</h2>
            <div className="bg-gray-900 p-4 rounded-lg overflow-auto h-[400px] font-mono text-sm">
              {logMessages.map((msg, i) => (
                <div key={i} className="text-green-400 mb-1">{msg}</div>
              ))}
              
              {logMessages.length === 0 && (
                <div className="text-gray-500 italic">No log messages</div>
              )}
            </div>
            
            <div className="mt-4">
              <h3 className="text-white text-lg mb-2">Selected Tags Data</h3>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-auto h-[150px] text-xs text-blue-300">
                {JSON.stringify(selectedTags, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagInspector; 