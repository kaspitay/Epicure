import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";

const RecipeContext = createContext();
export const useRecipeContext = () => {
  return useContext(RecipeContext);
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/recipe`);
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, loading }}>
      {children}
    </RecipeContext.Provider>
  );
};
