import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuHeaderProps {
  selectedCategory: string;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ selectedCategory }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
      <h1 className="text-3xl font-bold">{selectedCategory || "Menu"}</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/add-edit-dish")}
          className="bg-green-500 border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-green-600 transition"
        >
          <span className="text-lg font-bold">+</span>
          <span>Add More Dishes</span>
        </button>
        <button
          onClick={() => navigate("/add-coupon")}
          className="bg-indigo-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-indigo-900 transition"
        >
          <span className="text-lg font-bold">+</span>
          <span>Add Coupon</span>
        </button>
      </div>
    </div>
  );
};

export default MenuHeader;
