import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { recipeApi } from '../api';
import { Recipe } from '../types';

interface RecipeContextType {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  loading: boolean;
}

const RecipeContext = createContext<RecipeContextType | null>(null);

export const useRecipeContext = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await recipeApi.getAll();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
