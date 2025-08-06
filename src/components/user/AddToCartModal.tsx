import React from "react";
import { FaTimes } from "react-icons/fa";

interface PairedItem {
  name: string;
  price: number;
}

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  halfPlatePrice?: number;
  hasHalfPlate?: boolean;
  selectedSize: "full" | "half";
  onSizeChange: (size: "full" | "half") => void;
  pairedItems: PairedItem[];
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  halfPlatePrice,
  hasHalfPlate,
  selectedSize,
  onSizeChange,
  pairedItems,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const selectedPrice =
    selectedSize === "half" && halfPlatePrice ? halfPlatePrice : itemPrice;
  const total = selectedPrice * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl relative p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg transition"
          title="Close modal"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Item Name */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
          {itemName}
        </h2>

        {/* Size Selector */}
        {hasHalfPlate && (
          <div className="flex justify-center gap-4 my-4">
            <button
              className={`px-5 py-2 rounded-full border transition font-medium text-sm ${
                selectedSize === "full"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => onSizeChange("full")}
            >
              Full ₹{itemPrice}
            </button>
            <button
              className={`px-5 py-2 rounded-full border transition font-medium text-sm ${
                selectedSize === "half"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => onSizeChange("half")}
            >
              Half ₹{halfPlatePrice}
            </button>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
          <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-gray-100">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="text-xl font-semibold px-2 text-gray-700 hover:text-red-500"
            >
              –
            </button>
            <span className="min-w-[32px] text-center text-lg font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="text-xl font-semibold px-2 text-gray-700 hover:text-green-600"
            >
              +
            </button>
          </div>

          <button
            onClick={onAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition w-full md:w-auto mt-2 md:mt-0"
          >
            Add to Cart • ₹{total}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
