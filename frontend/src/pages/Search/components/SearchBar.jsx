import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center justify-center mb-5 lg:mb-5 ">
      <div className="flex items-center justify-center w-full h-[50px] rounded-lg px-3 relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full lg:h-5 xl:h-10 px-10 mx-5 py-3 rounded-lg bg-white outline-none text-gray-800 placeholder-gray-500"
          value={value}
          onChange={onChange}
        />
        <div className="absolute top-[50%] right-[6%] transform -translate-y-1/2">
          <FaSearch className="text-2xl text-gray-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;