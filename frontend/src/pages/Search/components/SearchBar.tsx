import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar = ({ value, onChange, onClear, placeholder, autoFocus = false }: SearchBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <div className="relative flex items-center">
        <FiSearch className="absolute left-4 text-gray-400 text-lg" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-12 py-3.5 rounded-xl bg-[#2A2725] text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-[#BE6F50] focus:bg-[#BE6F50]/5 transition-all duration-200"
        />
        {value && onClear && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="absolute right-4 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="text-lg" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
