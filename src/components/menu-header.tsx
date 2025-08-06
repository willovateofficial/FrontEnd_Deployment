import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";

interface MenuHeaderProps {
  selectedCategory: string;
  onSearch: (searchTerm: string) => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  selectedCategory,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
      {/* Left: Title */}
      <h1 className="text-3xl font-bold">{selectedCategory || "Menu"}</h1>

      {/* Right: Search + Buttons */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center w-full md:w-auto md:justify-start justify-center">
        {/* Stylish Search Bar */}
        <div className="relative flex items-center flex-grow min-w-[200px] md:min-w-[250px]">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search dishes..."
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
          />
          {searchValue && (
            <FaTimes
              className="absolute right-3 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={clearSearch}
            />
          )}
        </div>

        {/* Add Dish Button */}
        <button
          onClick={() => navigate("/add-edit-dish")}
          className="bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-green-600 transition whitespace-nowrap"
        >
          <span className="text-lg font-bold">+</span>
          <span>Add More Dishes</span>
        </button>

        {/* Add Coupon Button */}
        <button
          onClick={() => navigate("/add-coupon")}
          className="bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-indigo-900 transition whitespace-nowrap"
        >
          <span className="text-lg font-bold">+</span>
          <span>Add Coupon</span>
        </button>
      </div>
    </div>
  );
};

export default MenuHeader;
