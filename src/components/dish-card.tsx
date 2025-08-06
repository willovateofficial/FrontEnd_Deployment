import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Dish {
  id: number;
  name: string;
  spiciness?: number;
  description: string;
  priceHalf?: number;
  price: number;
  image: string;
  favorite: boolean;
  category?: string;
  isActive?: boolean;
  metadata?: {
    priceHalf?: number;
    priceFull?: number;
    spiciness?: number;
    ingredients?: string;
    about?: string;
    images?: string[];
    favorite?: boolean;
  };
}

interface DishCardProps {
  dish: Dish;
  onEdit?: () => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, newStatus: boolean) => void; // ✅ Added
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeStatus, setActiveStatus] = useState<boolean>(
    dish.isActive ?? true
  );

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
      toast.info("Edit mode activated");
      return;
    }
    navigate("/add-edit-dish", { state: { dishToEdit: dish } });
    toast.info("Navigating to edit dish...");
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/products/${dish.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete dish");

      toast.success("Dish deleted successfully");

      setTimeout(() => {
        if (onDelete) onDelete(dish.id);
      }, 1000);
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast.error("Failed to delete dish. Try again.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    toast.info("Deletion cancelled", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const spiciness = dish.spiciness ?? dish.metadata?.spiciness ?? 2;
  const priceHalf = dish.priceHalf ?? dish.metadata?.priceHalf;
  const priceFull = dish.price ?? dish.metadata?.priceFull ?? 0;
  const isFavorite = dish.favorite ?? dish.metadata?.favorite ?? false;

  const toggleActiveStatus = async () => {
    const newStatus = !activeStatus;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/products/${dish.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setActiveStatus(newStatus); // Update local state
      toast.success(`Dish marked as ${newStatus ? "Active" : "Inactive"}`); // ✅ Only one toast here

      if (onStatusChange) {
        onStatusChange(dish.id, newStatus); // ✅ Notify parent silently
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update active status");
    }
  };

  return (
    <>
      <div
        className={`relative rounded-2xl shadow-md p-4 flex flex-col items-center justify-between h-full w-[320px] mx-auto transition-all duration-300 transform hover:scale-[1.02] ${
          activeStatus
            ? "bg-yellow-50"
            : "bg-red-100 border-2 border-red-400 scale-[0.98]"
        }`}
      >
        {/* Edit / Delete Icons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button title="Edit dish" onClick={handleEditClick}>
            <FaEdit className="text-blue-300 hover:text-blue-800 text-xl" />
          </button>
          <button title="Delete dish" onClick={handleDeleteClick}>
            <FaTrash className="text-red-400 hover:text-red-700 text-xl" />
          </button>
        </div>

        {/* Dish Image */}
        <div className="relative">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-28 w-28 sm:h-36 sm:w-36 object-cover rounded-full border-4 border-yellow-300"
          />
          {isFavorite && (
            <span className="absolute top-0 right-0 text-red-500 text-2xl">
              ❤️
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center mt-2">
          {dish.name}
        </h2>

        {/* Spiciness */}
        <div className="flex items-center space-x-1 mt-1">
          {[...Array(spiciness)].map((_, i) => (
            <span key={i} className="text-red-500 text-xl">
              🌶️
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-lg text-gray-600 text-center mt-1 px-1">
          {dish.description}
        </p>

        {/* Price */}
        <div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
          {priceHalf !== undefined && priceHalf !== 0 && (
            <div className="bg-yellow-300 text-black rounded-lg px-4 py-1 text-base font-semibold shadow-md whitespace-nowrap">
              Half - ₹{priceHalf}
            </div>
          )}
          <div className="bg-black text-white rounded-lg px-4 py-1 text-base font-semibold shadow-md whitespace-nowrap">
            Full - ₹{priceFull}
          </div>
        </div>

        {/* Status Toggle in top-left */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur px-2 py-1 rounded-md shadow">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <input
              type="checkbox"
              checked={activeStatus}
              onChange={toggleActiveStatus}
              className={`scale-110 transition-all duration-300 ${
                activeStatus ? "accent-green-500" : "accent-red-500"
              }`}
            />
            <span
              className={`transition-all duration-300 ${
                activeStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {activeStatus ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        {/* Confirm Delete */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 rounded-2xl">
            <div className="bg-white rounded-xl p-4 w-72 text-center shadow-lg">
              <p className="text-lg font-semibold mb-4 text-gray-800">
                Are you sure you want to delete this dish?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DishCard;
