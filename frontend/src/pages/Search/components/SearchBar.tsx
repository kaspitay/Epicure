import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-[#2A2826] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BE6F50]"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBar;