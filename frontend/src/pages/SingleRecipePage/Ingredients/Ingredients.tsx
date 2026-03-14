import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

interface Ingredient {
  name: string;
  quantity: string;
  measurement: string;
}

interface IngredientsProps {
  recipeIngredients: Ingredient[];
}

const Ingredients = ({ recipeIngredients }: IngredientsProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const checkedCount = checkedItems.size;
  const totalCount = recipeIngredients?.length || 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-[#BE6F50] rounded-full" />
          Ingredients
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {checkedCount} / {totalCount}
          </span>
          <div className="w-24 h-2 bg-[#272727] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#BE6F50] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-2">
        {recipeIngredients?.map((ingredient, index) => {
          const isChecked = checkedItems.has(index);
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => toggleItem(index)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                isChecked
                  ? "bg-[#BE6F50]/10 border border-[#BE6F50]/30"
                  : "bg-[#272727] hover:bg-[#2F2B29] border border-transparent"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isChecked
                    ? "bg-[#BE6F50] text-white"
                    : "bg-[#3A3633] text-transparent"
                }`}
              >
                <FiCheck className="text-sm" />
              </div>

              {/* Number */}
              <span
                className={`text-sm font-bold w-8 text-center transition-colors ${
                  isChecked ? "text-[#BE6F50]" : "text-gray-500"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Ingredient Info */}
              <div className="flex-1 flex items-center justify-between">
                <span
                  className={`text-left transition-all duration-200 ${
                    isChecked ? "text-gray-400 line-through" : "text-white"
                  }`}
                >
                  {ingredient.name}
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isChecked ? "text-[#BE6F50]/60" : "text-[#BE6F50]"
                  }`}
                >
                  {ingredient.quantity} {ingredient.measurement}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Empty State */}
      {(!recipeIngredients || recipeIngredients.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400">No ingredients listed</p>
        </div>
      )}
    </div>
  );
};

export default Ingredients;
