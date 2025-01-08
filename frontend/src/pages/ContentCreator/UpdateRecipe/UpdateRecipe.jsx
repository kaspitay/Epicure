import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";
import axios from "axios";
import foodMeasurements from "../AddRecipe/foodMeasurements";
import foodTags from "../AddRecipe/foodTags";
import BASE_URL from '../config';  // Adjust the path as needed



const UpdateRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [finalProductPicture, setFinalProductPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [ingredientFields, setIngredientFields] = useState([
    { id: 1, name: '', quantity: '', measurement: '' },
  ]);
  const [stepFields, setStepFields] = useState([{ id: 1, description: '', stepImage: null }]);
  const [tags, setTags] = useState([{id: 1, tag: ''}]);
  const [sections, setSections] = useState([]);
  const [yieldAmount, setYieldAmount] = useState('');

  const [imageBase64, setImageBase64] = useState('');
  const [extraImages, setExtraImages] = useState([{ id: 1, image: '' }]);

  const handleIngredientChange = (index, field, event) => {
    const values = [...ingredientFields];
    values[index][field] = event.target.value;
    setIngredientFields(values);
  };

  const handleAddIngredient = () => {
    setIngredientFields([
      ...ingredientFields,
      { id: ingredientFields.length + 1, name: '', quantity: '', measurement: '' },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const values = [...ingredientFields];
    values.splice(index, 1);
    for (let i = index; i < values.length; i++) {
      values[i].id = i+1;
    }
    setIngredientFields(values);
  };

  const handleStepChange = (index, field, event) => {
    const values = [...stepFields];
    if (field === 'value') {
      values[index].description = event.target.value;
    } else if (field === 'image') {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the Base64 string as the image source
        values[index].stepImage = reader.result;
        setStepFields(values);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setStepFields(values);
    }
  };

  const handleAddStep = () => {
    setStepFields([
      ...stepFields,
      { id: stepFields.length + 1, description: '', stepImage: null }
    ]);
  };

  const handleRemoveStep = (index) => {
    const values = [...stepFields];
    values.splice(index, 1);
    for (let i = index; i < values.length; i++) {
      values[i].id = i+1;
    }
    setStepFields(values);
  };

  function handleKeyDown(e) {
    if (e.key === 'Enter')
      // Prevent form submission on Enter key press
      e.preventDefault();
    // If user did not press enter key, return
    if (e.key !== 'Enter') return
    // Get the value of the input
    const value = e.target.value
    // If the value is empty, return
    if (!value.trim()) return
    // Add the value to the tags array
    setTags([...tags,
       {id: tags.length + 1, tag: value} ]);
    // Clear the input
    e.target.value = ''
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index))
  }

  const handleSectionChange = (index, event) => {
    const values = [...sections];
    values[index] = event.target.value;
    setSections(values);
  };

  const handleExtraImageChange = (index, event) => {
    const images = [...extraImages];
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // Set the Base64 string as the image source
      images[index].image = reader.result;
      setExtraImages(images);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setExtraImages(images);
    }
  }

  const handleAddExtraImage = () => {
    setExtraImages([
      ...extraImages,
      { id: extraImages.length + 1, image: '' }
    ]);
  };

  const handleRemoveExtraImage = (index) => {
    const images = [...extraImages];
    images.splice(index, 1);
    for (let i = index; i < images.length; i++) {
      images[i].id = i + 1;
    }
    setExtraImages(images);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Set the Base64 string as the image source
      setImageBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(`${BASE_URL}/recipe`, {
        title: recipeName,
        image: imageBase64,
        description: description,
        ingredients: ingredientFields,
        steps: stepFields,
        tags: tags,
        photos: extraImages
      });
    } catch (error) {
      console.error('Error posting recipe:', error.response ? error.response.data : error.message);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="max-w-screen-2xl lg:max-w-screen-lg mb-20 mx-auto">
      {/* About Section */}
      <h1 className="text-[#D9D9D9] text-3xl mb-5">Add Recipe</h1>

      <div className="grid grid-cols-2 gap-2">
        {/* Recipe Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
          />
        </div>
        {/* Final Product Picture */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
          />
          {imageBase64 && (
            <img src={imageBase64} alt="Uploaded" style={{ maxWidth: '100px' }} />
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
        />
      </div>

      {/* Ingredient List */}
      <div className="mb-4">
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Ingredient Name`}
              value={field.name}
              onChange={(e) => handleIngredientChange(index, 'name', e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
            />
            <input
              type="number"
              placeholder={`Quantity`}
              value={field.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
            />
            <input
              list="measurements"
              name="measurement"
              placeholder={`Measurement`}
              value={field.measurement}
              onChange={(e) => handleIngredientChange(index, 'measurement', e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
            />
            <datalist id="measurements">
              {foodMeasurements.map((measurement, index) => (
                <option key={index} value={measurement} />
              ))}
            </datalist>
            {index !== 0 && (
              <button type="button" onClick={() => handleRemoveIngredient(index)}>
                <FaMinusCircle className="text-gray-500 ml-2" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          <IoMdAddCircle className="text-gray-400" />
        </button>
      </div>

      {/* Steps */}
      <div className="mb-4">
        {stepFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={field.value}
              onChange={(e) => handleStepChange(index, 'value', e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 mb-2 bg-transparent text-gray-400 placeholder-gray-300"
            />
            <input
              type="file"
              onChange={(e) => handleStepChange(index, 'image', e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 mb-2 bg-transparent text-gray-400 placeholder-gray-300"
            />
            {index !== 0 && (
              <button type="button" onClick={() => handleRemoveStep(index)}>
                <FaMinusCircle className="text-gray-400 ml-2" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddStep}>
          <IoMdAddCircle className="text-gray-400" />
        </button>
      </div>

      {/* Tags */}
      {/* <div className="mb-4">
        {tags.map((tag, index) => () => (
          <div key={index} className="mb-2">
            <span>{tag}</span> 
          </div>
        ))} */}

      {/* Tags Input */}
      {/* <input
          type="text"
          placeholder="enter some related Tags"
          value={tags}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
        />
      </div> */}

      <div className="border-2 border-gray-300 p-2 rounded-md w-full mt-4 flex items-center flex-wrap gap-2 mb-4">
        {tags.map((value, index) => (
          <div className="border-2 border-black bg-gray-300 inline-block px-2 py-1 rounded-full" key={index}>
            <span className="text">{tags.length != 0 && value.tag}</span>
            <span className=" h-5 w-5 bg-gray-800 text-white rounded-full flex justify-center items-center ml-2 text-lg cursor-pointer" onClick={() => removeTag(index)}>&times;</span>
          </div>
        ))}

        <input list="foodTags" name="foodTag" onKeyDown={handleKeyDown} className="flex-grow px-2 py-1 border-none outline-none bg-transparent text-gray-400 placeholder-gray-300" placeholder="Type something" />
        <datalist id="foodTags">
          {foodTags.map((foodTag, index) => (
            <option key={index} value={foodTag} />
          ))}
        </datalist>
      </div>

      
      {/* photos */}
      <label> photos</label>
      <div className="mb-4">
        {extraImages.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              type="file"
              onChange={(e) => handleExtraImageChange(index, e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 mb-2 bg-transparent text-gray-400 placeholder-gray-300"
            />
            {index !== 0 && (
              <button type="button" onClick={() => handleRemoveExtraImage(index)}>
                <FaMinusCircle className="text-gray-400 ml-2" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddExtraImage}>
          <IoMdAddCircle className="text-gray-400" />
        </button>
      </div>
      {/* Sections */}
      {/* <div className="mb-4">
        {sections.map((section, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder={`Section ${index + 1}`}
              value={section}
              onChange={(e) => handleSectionChange(index, e)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
            />
          </div>
        ))}
      </div> */}

      {/* Yield Amount */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Yield Amount"
          value={yieldAmount}
          onChange={(e) => setYieldAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 bg-transparent text-gray-400 placeholder-gray-300"
        />
      </div> */}

      {/* Submit Button */}
      <div className="mt-4">
        <button type="submit" className="w-full bg-[#272727] border border-gray-600 hover:bg-[#BE6F50] hover:text-white text-gray-400 font-bold py-2 px-4 rounded-full">
          Submit
        </button>
      </div>
    </form>
  );
};

export default UpdateRecipe;
